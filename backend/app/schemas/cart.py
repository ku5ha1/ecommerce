from pydantic import BaseModel 
from app.schemas.product import ProductOut

class CartItemCreate(BaseModel):
    product_id: int 
    quantity: int  

class CartItemOut(BaseModel):
    id: int 
    product_id: int 
    quantity: int 
    product: ProductOut

    class Config: 
        from_attributes = True  