from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db 
from app.models.user import User
from app.models.product import Product
from app.auth.auth_handler import get_current_user
from app.models.cartItem import CartItem
from app.models.order import Order
from app.schemas.order import OrderCreate
from datetime import datetime

router = APIRouter(prefix="/checkout", tags=["checkout"])

@router.post("/")
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
    total_amount = 0
    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )
        total_amount += product.price * item.quantity

    new_order = Order(
        user_id = current_user.id, 
        total_amount=total_amount,
        created_at = datetime.now()
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order