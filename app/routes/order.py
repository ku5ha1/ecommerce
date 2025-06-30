from fastapi import APIRouter, Depends, HTTPException
from app.db.database import get_db 
from sqlalchemy.orm import Session 
from app.schemas.order import OrderOut, OrderItemOut
from app.auth.auth_handler import get_current_user
from app.models.user import User 
from app.models.order import Order
from app.models.product import Product
from app.models.orderItem import OrderItem

router = APIRouter(prefix="/orders", tags=["orders"])

@router.get("/", response_model=list[OrderOut])
async def get_my_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    my_orders = db.query(Order).filter(
        Order.user_id == current_user.id
    ).all()
    if not my_orders:
        raise HTTPException(
            status_code=404,
            detail="Looks empty here"
        )
    return my_orders

@router.get("/{order_id}", response_model=OrderOut)
async def get_single_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    my_order = db.query(Order).filter(
        Order.user_id == current_user.id,
        Order.id == order_id
    ).first()  
    if not my_order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )
    return my_order 