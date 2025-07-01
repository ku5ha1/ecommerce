from pydantic import BaseModel
from datetime import datetime
from app.schemas.order_item import OrderItemOut
from typing import List
from app.schemas.shipping_info import ShippingInfoOut
from app.schemas.user import UserOut
from typing import Optional

from enum import Enum

class OrderStatusEnum(str, Enum):
    pending = "pending"
    processing = "processing"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"

class OrderStatusChange(BaseModel):
    status: OrderStatusEnum

class OrderCreate(BaseModel):
    total_amount: float 

class OrderOut(BaseModel):
    id: int 
    user_id: int 
    total_amount: float 
    created_at: datetime
    user_details: UserOut
    order_items: List[OrderItemOut]
    status: OrderStatusEnum = OrderStatusEnum.pending
    shipping_info: Optional[ShippingInfoOut]

    class Config: 
        from_attributes = True