from asyncio.log import logger
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone, time
from app.db.database import get_db
from app.models.user import User
from app.models.product import Product
from app.auth.auth_handler import get_current_user
from app.models.cartItem import CartItem
from app.models.order import Order
from app.models.orderItem import OrderItem
from app.schemas.shipping_info import ShippingInfoCreate
from app.models.shipping_info import DeliveryMethod, ShippingInfo

router = APIRouter(prefix="/checkout", tags=["checkout"])

PICKUP_LOCATION = {
    "name": "YourStore HQ",
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "MH",
    "country": "India",
    "zip": "400001"
}

@router.post("/")
async def checkout(
    shipping_info: ShippingInfoCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    print("=== CHECKOUT DEBUG ===")
    print("Received shipping_info:", shipping_info.dict())
    print("DELIVERY METHOD TO DB:", shipping_info.delivery_method, shipping_info.delivery_method.value)
    print("PICKUP TIME:", shipping_info.pickup_time, type(shipping_info.pickup_time))
    print("CART ITEMS:", shipping_info.cart_items)
    print("USER ID:", current_user.id)
    print("====================")
    try:
        if shipping_info.delivery_method == DeliveryMethod.DELIVERY:
            if not all([shipping_info.address, shipping_info.city, shipping_info.country]):
                raise HTTPException(
                    status_code=400,
                    detail="Address, city, and country are required for delivery"
                )
        elif shipping_info.delivery_method == DeliveryMethod.PICKUP:
            if not shipping_info.pickup_time:
                raise HTTPException(
                    status_code=400,
                    detail="Pickup time is required for pickup orders"
                )
            pickup_time_only = shipping_info.pickup_time.time()
            if not (time(10, 0) <= pickup_time_only <= time(16, 0)):
                raise HTTPException(
                    status_code=400,
                    detail="Pickup time must be between 10:00 AM and 4:00 PM"
                )
            # For pickup orders, we'll use the pickup location details
            # No need to validate address fields for pickup

        # Use cart items from request instead of database
        cart_items = shipping_info.cart_items

        if not cart_items:
            raise HTTPException(
                status_code=400,
                detail="Cart is empty"
            )

        product_ids = [item.product_id for item in cart_items]

        products = db.query(Product).filter(
            Product.id.in_(product_ids)
        ).with_for_update().all()

        product_map = {product.id: product for product in products}

        total_amount = Decimal('0')
        order_items_data = []

        for item in cart_items:
            product = product_map.get(item.product_id)
            if not product:
                raise HTTPException(
                    status_code=404,
                    detail=f"Product with ID {item.product_id} not found"
                )

            product_price = getattr(product, 'price')
            product_quantity = getattr(product, 'quantity')

            if product_quantity < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Not enough stock for product '{product.name}'. Available: {product_quantity}, Requested: {item.quantity}"
                )

            setattr(product, 'quantity', product_quantity - item.quantity)
            db.add(product)

            item_total = Decimal(str(product_price)) * Decimal(str(item.quantity))
            total_amount += item_total

            order_items_data.append({
                "product_id": item.product_id,
                "quantity": item.quantity,
                "price": float(product_price),
                "item_total": float(item_total)
            })

        new_order = Order(
            user_id=current_user.id,
            total_amount=float(total_amount),
            created_at=datetime.now(timezone.utc)
        )
        db.add(new_order)
        db.flush()

        shipping_data = ShippingInfo(
            order_id=new_order.id,
            full_name=shipping_info.full_name,
            email=shipping_info.email,
            phone=shipping_info.phone,
            delivery_method=shipping_info.delivery_method.value.lower(),
            **({
                'address': shipping_info.address,
                'city': shipping_info.city,
                'state': shipping_info.state,
                'country': shipping_info.country,
                'zip': shipping_info.zip
            } if shipping_info.delivery_method == DeliveryMethod.DELIVERY else {
                'pickup_time': shipping_info.pickup_time,
                'address': PICKUP_LOCATION['address'],
                'city': PICKUP_LOCATION['city'],
                'state': PICKUP_LOCATION['state'],
                'zip': PICKUP_LOCATION['zip'],
                'country': PICKUP_LOCATION['country']
            })
        )
        db.add(shipping_data)
        print("ACTUAL delivery_method TO DB:", shipping_data.delivery_method)

        

        for item_data in order_items_data:
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=item_data["product_id"],
                quantity=item_data["quantity"],
                price_at_purchase=item_data["price"]
            )
            db.add(order_item)

        db.commit()

        return {
            "order_id": new_order.id,
            "total_amount": float(total_amount),
            "delivery_type": shipping_info.delivery_method.value,
            "next_steps": (
                f"Your order will be delivered to {shipping_info.address}"
                if shipping_info.delivery_method == DeliveryMethod.DELIVERY
                else f"Ready for pickup at {shipping_info.pickup_time.strftime('%I:%M %p')}" 
                if shipping_info.pickup_time 
                else "Pickup time will be confirmed shortly"
            ),
            "order_items": order_items_data
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Checkout error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An error occurred during checkout. Please try again later."
        )
