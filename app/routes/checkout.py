from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db 
from app.models.user import User
from app.models.product import Product
from app.auth.auth_handler import get_current_user
from app.models.cartItem import CartItem
from app.models.order import Order
from app.models.orderItem import OrderItem
from app.schemas.order import OrderCreate
from app.schemas.order_item import OrderItemCreate
from datetime import datetime

router = APIRouter(prefix="/checkout", tags=["checkout"])

@router.post("/")
async def checkout(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart_items = db.query(CartItem).filter(
        CartItem.user_id == current_user.id
    ).all()
    if not cart_items:
        raise HTTPException(
            status_code=404,
            detail="Cart is empty"
        )
    total_amount = 0
    order_items_data = []

    for item in cart_items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()
        if not product: 
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )
        total_amount += product.price * item.quantity
        order_items_data.append({
            "product_id": item.product_id,
            "quantity": item.quantity,
            "price": product.price
        })
    new_order = Order(
        user_id = current_user.id,
        total_amount = total_amount,
        created_At = datetime.now()
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for item_data in order_items_data:
        order_item = OrderItem(
            order_id = new_order.id,
            product_id = item_data["product_id"],
            quantity = item_data["quantity"],
            price_at_purchase = item_data["price"]
        )
        db.add(order_item)
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    return {"message" : "Order placed successfully", "order_id": new_order.id}
    