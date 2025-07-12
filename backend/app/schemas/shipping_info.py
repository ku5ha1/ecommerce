from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from app.models.shipping_info import DeliveryMethod

class CartItemData(BaseModel):
    product_id: int
    quantity: int

class ShippingInfoCreate(BaseModel):
    order_id: Optional[int] = None
    full_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
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
    cart_items: List[CartItemData] = Field(
        default=[],
        description="Cart items to be processed"
    )

    @validator("delivery_method", pre=True)
    def delivery_method_to_lower(cls, v):
        if isinstance(v, str):
            return v.lower()
        return v

    @validator("pickup_time", pre=True)
    def parse_pickup_time(cls, v):
        if isinstance(v, str) and v:
            try:
                # Handle datetime-local format (YYYY-MM-DDTHH:MM)
                if 'T' in v and len(v) == 16:
                    return datetime.fromisoformat(v)
                # Handle other ISO formats
                return datetime.fromisoformat(v.replace('Z', '+00:00'))
            except ValueError as e:
                print(f"DateTime parsing error: {e}, value: {v}")
                raise ValueError(f"Invalid datetime format: {v}")
        return v

class ShippingInfoOut(BaseModel):
    id: int
    order_id: int   
    full_name: str
    email: Optional[str]
    phone: Optional[str]
    delivery_method: DeliveryMethod
    pickup_time: Optional[datetime]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    zip: Optional[str]
    country: Optional[str]

    class Config:
        from_attributes = True
