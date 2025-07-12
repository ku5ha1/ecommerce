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
    
    # Convert orders to include user_details
    orders_with_user = []
    for order in my_orders:
        order_dict = {
            "id": order.id,
            "user_id": order.user_id,
            "total_amount": order.total_amount,
            "created_at": order.created_at,
            "status": order.status,
            "user_details": current_user,  # Use current user as user_details
            "order_items": order.order_items,
            "shipping_info": order.shipping_info
        }
        orders_with_user.append(order_dict)
    
    return orders_with_user

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
    return {
        "id": my_order.id,
        "user_id": my_order.user_id,
        "total_amount": my_order.total_amount,
        "created_at": my_order.created_at,
        "user_details": current_user,  # Use current user instead of my_order.user
        "order_items": my_order.order_items, 
        "status": my_order.status,
        "shipping_info": my_order.shipping_info  
    }