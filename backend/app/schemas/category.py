from pydantic import BaseModel
from app.models.category import Category

class CategoryCreate(BaseModel):
    name: str
    category_image: str

class CategoryOut(BaseModel):
    id: int
    name: str 
    category_image: str 
    
    class Config:
        from_attributes = True