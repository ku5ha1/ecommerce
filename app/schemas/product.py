from pydantic import BaseModel 
from app.models.product import Product
from app.schemas.category import CategoryOut
from typing import Optional

class ProductCreate(BaseModel):
    name: str 
    price: Optional[float] = None 
    description: str
    product_image: str
    quantity: int 
    category_id: int 

class ProductOut(BaseModel):
    id: int 
    name: str 
    price: float
    quantity: int
    category: CategoryOut

    class Config: 
        from_attributes = True
    