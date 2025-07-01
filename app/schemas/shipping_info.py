from pydantic import BaseModel, Field, validator
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
        description="Required if delivery_method is pickup"
    )
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    zip: Optional[str]
    country: Optional[str]

    @validator("delivery_method", pre=True)
    def delivery_method_to_lower(cls, v):
        if isinstance(v, str):
            return v.lower()
        return v

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
