from pathlib import Path
import subprocess


HLS_SEGMENT_SECONDS = 6


def package_mp4(source_path: Path, output_dir: Path) -> Path:
    """Remux an MP4 into VOD HLS segments without re-encoding its streams."""
    output_dir.mkdir(parents=True, exist_ok=True)
    playlist_path = output_dir / "index.m3u8"
    command = [
        "ffmpeg",
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        str(source_path),
        "-map",
        "0:v:0",
        "-map",
        "0:a:0?",
        "-c:v",
        "copy",
        "-c:a",
        "copy",
        "-f",
        "hls",
        "-hls_time",
        str(HLS_SEGMENT_SECONDS),
        "-hls_playlist_type",
        "vod",
        "-hls_segment_type",
        "fmp4",
        "-hls_flags",
        "independent_segments",
        "-hls_fmp4_init_filename",
        "init.mp4",
        "-hls_segment_filename",
        str(output_dir / "segment_%05d.m4s"),
        str(playlist_path),
    ]

    result = subprocess.run(command, capture_output=True, text=True, check=False)
    if result.returncode != 0 or not playlist_path.is_file():
        detail = result.stderr.strip() or "FFmpeg did not produce an HLS playlist"
        raise RuntimeError(detail)

    if not (output_dir / "init.mp4").is_file() or not list(
        output_dir.glob("segment_*.m4s")
    ):
        raise RuntimeError("FFmpeg produced an incomplete HLS package")

    return playlist_path
