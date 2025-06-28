from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db 
from app.models.user import User
from app.auth.auth_handler import get_current_user
from typing import List
from app.models.cartItem import CartItem

router = APIRouter(prefix="/checkout", tags=["checkout"])

async def checkout(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(
            status_code=404,
            detail="Cart is empty"
        )