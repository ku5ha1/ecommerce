from pydantic import BaseModel
from app.models.category import Category

class CategoryCreate(BaseModel):
    name: str

class CategoryOut(BaseModel):
    id: int
    name: str 

    class Config:
        from_attributes = True