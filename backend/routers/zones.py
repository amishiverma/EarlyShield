from fastapi import APIRouter, HTTPException
from typing import List
from models import Zone, ZoneUpdate
import database as db

router = APIRouter(prefix="/zones", tags=["zones"])


@router.get("", response_model=List[Zone])
async def get_zones():
    zones = db.get_all_zones()
    return zones


@router.get("/{zone_id}", response_model=Zone)
async def get_zone(zone_id: str):
    zone = db.get_zone_by_id(zone_id)
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    return zone


@router.patch("/{zone_id}", response_model=Zone)
async def update_zone(zone_id: str, update: ZoneUpdate):
    update_data = update.model_dump(exclude_unset=True)
    updated = db.update_zone(zone_id, update_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Zone not found")
    return updated
