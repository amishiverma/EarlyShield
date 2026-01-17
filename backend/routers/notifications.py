from fastapi import APIRouter, HTTPException
from typing import List
from models import Notification, NotificationReadUpdate
import database as db

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=List[Notification])
async def get_notifications():
    notifications = db.get_all_notifications()
    return notifications


@router.patch("/{notification_id}/read", response_model=Notification)
async def mark_notification_read(notification_id: int, update: NotificationReadUpdate):
    updated = db.update_notification(notification_id, {'read': update.read})
    if not updated:
        raise HTTPException(status_code=404, detail="Notification not found")
    return updated


@router.post("/mark-all-read")
async def mark_all_read():
    db.mark_all_notifications_read()
    return {"message": "All notifications marked as read"}
