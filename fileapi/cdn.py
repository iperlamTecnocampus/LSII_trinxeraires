from fastapi import APIRouter

router = APIRouter()

@router.get("/thumbnails/{fid}")
async def get_thumbnail(fid: str):
    pass