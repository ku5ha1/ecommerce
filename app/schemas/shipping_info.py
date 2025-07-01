from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.shipping_info import DeliveryMethod

class ShippingInfoCreate(BaseModel):
    order_id: int
    full_name: str
    email: Optional[str] = None
    phone: Optional[int] = None
    delivery_method: DeliveryMethod
    pickup_time: Optional[datetime] = Field(
        None,
        description="Required if delivery_method is PICKUP"
    )
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    zip: Optional[str]
    country: Optional[str]

class ShippingInfoOut(BaseModel):
    id: int
    order_id: int   
    full_name: str
    email: Optional[str]
    phone: Optional[int]
    delivery_method: DeliveryMethod
    pickup_time: Optional[datetime]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    zip: Optional[str]
    country: Optional[str]

    class Config:
        from_attributes = True
