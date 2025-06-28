from pydantic import BaseModel 
from app.models.product import Product
from app.schemas.category import CategoryOut

class ProductCreate(BaseModel):
    name: str 
    price: float
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
