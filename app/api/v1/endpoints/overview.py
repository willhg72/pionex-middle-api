from fastapi import APIRouter

from app.services.overview_macro_service import overview_macro_service

router = APIRouter(prefix="/overview")


@router.get("/macro")
async def overview_macro() -> dict:
    return await overview_macro_service.get_macro_basket()
