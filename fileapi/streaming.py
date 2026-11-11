from collections.abc import Iterator
from pathlib import Path
import re

from botocore.exceptions import BotoCoreError, ClientError
from fastapi import APIRouter, Header, HTTPException, Response
from fastapi.responses import StreamingResponse

from cdn import s3_client


router = APIRouter(tags=["streaming"])
BUCKET = "protube"
CHUNK_SIZE = 64 * 1024


def _storage_error(exc: ClientError, resource: str) -> HTTPException:
    error = exc.response.get("Error", {})
    if error.get("Code") in {"NoSuchKey", "NotFound", "404"} or exc.response.get(
        "ResponseMetadata", {}
    ).get("HTTPStatusCode") == 404:
        return HTTPException(status_code=404, detail=f"{resource} not found")
    return HTTPException(status_code=502, detail=f"Unable to retrieve {resource} from storage")


def _object_size(fid: str) -> int:
    try:
        return s3_client.head_object(Bucket=BUCKET, Key=fid)["ContentLength"]
    except ClientError as exc:
        raise _storage_error(exc, "Video") from exc
    except BotoCoreError as exc:
        raise HTTPException(status_code=502, detail="Unable to retrieve video from storage") from exc


def _parse_range(range_header: str, size: int) -> tuple[int, int]:
    """Return inclusive byte offsets for a single RFC 7233 byte range."""
    try:
        unit, value = range_header.strip().split("=", 1)
        if unit != "bytes" or "," in value:
            raise ValueError

        start_text, end_text = value.split("-", 1)
        if not start_text:
            suffix_length = int(end_text)
            if suffix_length <= 0:
                raise ValueError
            start = max(size - suffix_length, 0)
            end = size - 1
        else:
            start = int(start_text)
            end = int(end_text) if end_text else size - 1
            if start < 0 or end < start or start >= size:
                raise ValueError
            end = min(end, size - 1)

        if size == 0 or start >= size:
            raise ValueError
        return start, end
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=416,
            detail="Requested byte range is not satisfiable",
            headers={"Content-Range": f"bytes */{size}"},
        ) from None


@router.get("/hls/{fid}.m3u8", response_class=Response)
@router.get("/stream/{fid}", response_class=Response)
def get_playlist(fid: str) -> Response:
    """Return the pre-packaged HLS playlist for an uploaded video."""
    _validate_fid(fid)
    try:
        result = s3_client.get_object(
            Bucket=BUCKET, Key=f"hls/{fid}/index.m3u8"
        )
    except ClientError as exc:
        raise _storage_error(exc, "HLS playlist") from exc
    except BotoCoreError as exc:
        raise HTTPException(
            status_code=502, detail="Unable to retrieve HLS playlist from storage"
        ) from exc

    body = result["Body"]
    try:
        playlist_lines = body.read().decode("utf-8").splitlines()
    finally:
        body.close()

    segment_base = f"/stream/{fid}/segments/"
    rewritten_lines = []

    for line in playlist_lines:
        if line.startswith("#EXT-X-MAP:"):
            line = re.sub(
                r'URI="([^"]+)"',
                lambda match: f'URI="{segment_base}{Path(match.group(1)).name}"',
                line,
            )
        elif line and not line.startswith("#"):
            line = f"{segment_base}{Path(line).name}"
        rewritten_lines.append(line)

    return Response(
        content="\n".join(rewritten_lines) + "\n",
        media_type="application/vnd.apple.mpegurl",
        headers={"Cache-Control": "public, max-age=3600"},
    )


@router.get("/hls/{fid}/segments/{segment_name}")
@router.get("/stream/{fid}/segments/{segment_name}")
def get_hls_segment(fid: str, segment_name: str) -> StreamingResponse:
    """Stream one stored HLS initialization or media segment from S3."""
    _validate_fid(fid)
    if segment_name != "init.mp4" and not re.fullmatch(
        r"segment_\d{5}\.m4s", segment_name
    ):
        raise HTTPException(status_code=404, detail="HLS segment not found")

    try:
        result = s3_client.get_object(
            Bucket=BUCKET, Key=f"hls/{fid}/{segment_name}"
        )
    except ClientError as exc:
        raise _storage_error(exc, "HLS segment") from exc
    except BotoCoreError as exc:
        raise HTTPException(
            status_code=502, detail="Unable to retrieve HLS segment from storage"
        ) from exc

    body = result["Body"]

    def stream() -> Iterator[bytes]:
        try:
            yield from body.iter_chunks(chunk_size=CHUNK_SIZE)
        finally:
            body.close()

    return StreamingResponse(
        stream(),
        media_type="video/mp4" if segment_name == "init.mp4" else "video/iso.segment",
        headers={
            "Cache-Control": "public, max-age=3600",
            **(
                {"Content-Length": str(result["ContentLength"])}
                if "ContentLength" in result
                else {}
            ),
        },
    )


def _validate_fid(fid: str) -> None:
    if not re.fullmatch(r"[A-Za-z0-9_-]{1,128}", fid):
        raise HTTPException(status_code=400, detail="Invalid video id")


@router.get("/hls/{fid}.mp4")
def get_video(fid: str, range_header: str | None = Header(default=None, alias="Range")) -> StreamingResponse:
    size = _object_size(fid)
    status_code = 200
    request_range = None
    headers = {"Accept-Ranges": "bytes", "Content-Length": str(size)}

    if range_header is not None:
        start, end = _parse_range(range_header, size)
        request_range = f"bytes={start}-{end}"
        status_code = 206
        headers["Content-Range"] = f"bytes {start}-{end}/{size}"
        headers["Content-Length"] = str(end - start + 1)

    try:
        result = s3_client.get_object(
            Bucket=BUCKET,
            Key=fid,
            **({"Range": request_range} if request_range is not None else {}),
        )
    except ClientError as exc:
        raise _storage_error(exc, "Video") from exc
    except BotoCoreError as exc:
        raise HTTPException(status_code=502, detail="Unable to retrieve video from storage") from exc

    body = result["Body"]

    def stream() -> Iterator[bytes]:
        try:
            yield from body.iter_chunks(chunk_size=CHUNK_SIZE)
        finally:
            body.close()

    return StreamingResponse(
        stream(),
        status_code=status_code,
        media_type="video/mp4",
        headers=headers,
    )
