from fastapi import APIRouter, HTTPException
from models import User, UserUpdate
import database as db

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/{user_type}", response_model=User)
async def get_user(user_type: str):
    user = db.get_user_by_type(user_type)
    if not user:
        raise HTTPException(status_code=404, detail="User type not found")
    return user


@router.patch("/{user_type}", response_model=User)
async def update_user(user_type: str, update: UserUpdate):
    update_data = update.model_dump(exclude_unset=True)
    updated = db.update_user(user_type, update_data)
    if not updated:
        raise HTTPException(status_code=404, detail="User type not found")
    return updated
