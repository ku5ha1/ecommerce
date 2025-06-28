from pydantic import BaseModel
from datetime import datetime
from order_item import OrderItemOut
from typing import List

class OrderCreate(BaseModel):
    total_amount: float 

class OrderOut(BaseModel):
    id: int 
    user_id: int 
    total_amount: float 
    created_at: datetime 
    order_items: List[OrderItemOut]

    class Config: 
        from_attributes = True