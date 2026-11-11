import os
from pathlib import Path
import shutil
import tempfile
from uuid import uuid4
from collections.abc import Iterator

import boto3
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from hls import package_mp4

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
    header = file.file.read(12)
    file.file.seek(0)
    if len(header) < 12 or header[:4] != b"RIFF" or header[8:12] != b"WEBP":
        raise HTTPException(status_code=415, detail="Uploaded file must be a WebP image")

    fid = uuid4().hex
    try:
        s3_client.put_object(
            Bucket="protube",
            Key=fid,
            Body=file.file,
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
    uploaded_keys: list[str] = []
    try:
        with tempfile.TemporaryDirectory(prefix="protube-upload-") as temp_dir:
            temp_path = Path(temp_dir)
            source_path = temp_path / "source.mp4"
            output_dir = temp_path / "hls"

            with source_path.open("wb") as source_file:
                shutil.copyfileobj(file.file, source_file, length=64 * 1024)

            playlist_path = package_mp4(source_path, output_dir)

            with source_path.open("rb") as source_file:
                s3_client.put_object(
                    Bucket="protube",
                    Key=fid,
                    Body=source_file,
                    ContentType="video/mp4",
                )
            uploaded_keys.append(fid)

            # Store the segments before the manifest so a published playlist
            # never points at objects that have not finished uploading.
            package_files = sorted(
                path
                for path in output_dir.iterdir()
                if path.is_file() and path != playlist_path
            )
            for path in package_files:
                key = f"hls/{fid}/{path.name}"
                content_type = (
                    "video/mp4"
                    if path.name == "init.mp4"
                    else "video/iso.segment"
                )
                with path.open("rb") as segment_file:
                    s3_client.put_object(
                        Bucket="protube",
                        Key=key,
                        Body=segment_file,
                        ContentType=content_type,
                    )
                uploaded_keys.append(key)

            playlist_key = f"hls/{fid}/index.m3u8"
            with playlist_path.open("rb") as playlist_file:
                s3_client.put_object(
                    Bucket="protube",
                    Key=playlist_key,
                    Body=playlist_file,
                    ContentType="application/vnd.apple.mpegurl",
                )
            uploaded_keys.append(playlist_key)

    except FileNotFoundError as exc:
        _delete_uploaded_objects(uploaded_keys)
        raise HTTPException(
            status_code=503, detail="FFmpeg is required to prepare HLS video"
        ) from exc
    except RuntimeError as exc:
        _delete_uploaded_objects(uploaded_keys)
        raise HTTPException(
            status_code=422, detail=f"Unable to package video for HLS: {exc}"
        ) from exc
    except (ClientError, BotoCoreError) as exc:
        _delete_uploaded_objects(uploaded_keys)
        raise HTTPException(
            status_code=502, detail="Unable to store video and HLS segments"
        ) from exc

    return {"fid": fid}


def _delete_uploaded_objects(keys: list[str]) -> None:
    if not keys:
        return

    try:
        s3_client.delete_objects(
            Bucket="protube",
            Delete={"Objects": [{"Key": key} for key in keys], "Quiet": True},
        )
    except (ClientError, BotoCoreError):
        pass
