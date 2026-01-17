from fastapi import APIRouter, HTTPException
from typing import List
from models import Signal, SignalCreate, SignalStatusUpdate
import database as db

router = APIRouter(prefix="/signals", tags=["signals"])


@router.get("", response_model=List[Signal])
async def get_signals():
    signals = db.get_all_signals()
    return signals


@router.get("/{signal_id}", response_model=Signal)
async def get_signal(signal_id: str):
    signal = db.get_signal_by_id(signal_id)
    if not signal:
        raise HTTPException(status_code=404, detail="Signal not found")
    return signal


@router.post("", response_model=Signal)
async def create_signal(signal_data: SignalCreate):
    new_signal = db.create_signal({
        'title': signal_data.title,
        'category': signal_data.category,
        'location': signal_data.location,
        'timestamp': "Just now",
        'riskLevel': signal_data.riskLevel,
        'description': signal_data.description,
        'status': "Open"
    })
    
    db.create_notification({
        'title': f"New Signal: {signal_data.title[:30]}...",
        'time': "Just now",
        'read': False
    })
    
    return new_signal


@router.patch("/{signal_id}/status", response_model=Signal)
async def update_signal_status(signal_id: str, update: SignalStatusUpdate):
    updated = db.update_signal(signal_id, {'status': update.status})
    if not updated:
        raise HTTPException(status_code=404, detail="Signal not found")
    return updated


@router.delete("/{signal_id}")
async def delete_signal(signal_id: str):
    if not db.delete_signal(signal_id):
        raise HTTPException(status_code=404, detail="Signal not found")
    return {"message": "Signal deleted"}
