from fastapi import APIRouter
from models import Stats
import database as db

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("", response_model=Stats)
async def get_stats():
    stats = db.get_stats()
    return stats
