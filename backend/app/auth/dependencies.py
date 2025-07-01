from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session 
from app.models.user import User
from app.auth.auth_handler import get_current_user

async def admin_required(
        current_user: User = Depends(get_current_user)
):
    if not bool(current_user.is_admin):
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )   
    return current_user