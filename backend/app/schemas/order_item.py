from pydantic import BaseModel  
from app.schemas.product import ProductOut

class OrderItemCreate(BaseModel):
    order_id: int 
    product_id: int 
    quantity: int 

class OrderItemOut(BaseModel):
    id: int
    order_id: int
    quantity: int 
    price_at_purchase: float
    product: ProductOut

    class Config:
        from_attributes = True