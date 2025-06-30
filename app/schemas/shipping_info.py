from pydantic import BaseModel
from typing import Optional

class ShippingInfoCreate(BaseModel):
    order_id: int
    full_name: str
    email: Optional[str] = None
    phone: Optional[int] = None
    address: str
    city: str
    state: str
    zip: str
    country: str

class ShippingInfoOut(BaseModel):
    id: int
    order_id: int
    full_name: str
    email: Optional[str] = None
    phone: Optional[int] = None
    address: str
    city: str
    state: str
    zipcode: str
    country: str

    class Config:
        from_attributes = True
