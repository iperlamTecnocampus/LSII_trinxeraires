import os
from io import BytesIO
from uuid import uuid4
from collections.abc import Iterator

import boto3
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from PIL import Image, ImageOps, UnidentifiedImageError

router = APIRouter()


s3_client = boto3.client(
    "s3",
    endpoint_url=os.getenv("S3_ENDPOINT_URL", "http://localhost:9000"),
    aws_access_key_id=os.getenv("S3_ACCESS_KEY_ID", "admin"),
    aws_secret_access_key=os.getenv("S3_SECRET_ACCESS_KEY", "admin"),
    region_name=os.getenv("S3_REGION", "us-east-1"),
)


@router.get("/thumbnails/{fid}")
def get_thumbnail(fid: str) -> StreamingResponse:
    try:
        result = s3_client.get_object(Bucket="protube", Key=f"{fid}")

    except ClientError as exc:
        error = exc.response.get("Error", {})

        if error.get("Code") in {"NoSuchKey", "NotFound"} or exc.response.get("ResponseMetadata", {}).get("HTTPStatusCode") == 404:
            raise HTTPException(status_code=404, detail="Thumbnail not found") from exc
        
        raise HTTPException(
            status_code=502, detail="Unable to retrieve thumbnail from storage"
        ) from exc
    
    except BotoCoreError as exc:
        raise HTTPException(
            status_code=502, detail="Unable to retrieve thumbnail from storage"
        ) from exc

    body = result["Body"]

    def stream() -> Iterator[bytes]:
        try:
            yield from body.iter_chunks(chunk_size=64 * 1024)
        finally:
            body.close()

    return StreamingResponse(stream(), media_type="image/webp")


@router.post("/thumbnails", status_code=201)
def post_thumbnail(file: UploadFile = File(...)) -> dict[str, str]:
    webp = BytesIO()
    try:
        with Image.open(file.file) as source:
            image = ImageOps.exif_transpose(source)
            has_alpha = "A" in image.getbands() or "transparency" in image.info
            image.convert("RGBA" if has_alpha else "RGB").save(webp, format="WEBP")
    except (Image.DecompressionBombError, UnidentifiedImageError, OSError, ValueError) as exc:
        raise HTTPException(status_code=415, detail="Uploaded file must be a valid image") from exc

    webp.seek(0)

    fid = uuid4().hex
    try:
        s3_client.put_object(
            Bucket="protube",
            Key=fid,
            Body=webp,
            ContentType="image/webp",
        )

    except (ClientError, BotoCoreError) as exc:
        raise HTTPException(
            status_code=502, detail="Unable to store thumbnail"
        ) from exc

    return {"fid": fid}

@router.post("/videos", status_code=201)
def post_video(file: UploadFile = File(...)) -> dict[str, str]:
    header = file.file.read(12)
    file.file.seek(0)
    if len(header) < 12 or header[4:8] != b"ftyp":
        raise HTTPException(status_code=415, detail="Uploaded file must be an MP4 video")

    fid = uuid4().hex
    try:
        s3_client.put_object(
            Bucket="protube",
            Key=fid,
            Body=file.file,
            ContentType="video/mp4",
        )

    except (ClientError, BotoCoreError) as exc:
        raise HTTPException(
            status_code=502, detail="Unable to store video"
        ) from exc

    return {"fid": fid}
