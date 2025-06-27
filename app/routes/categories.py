from app.db.database import get_db
from sqlalchemy.orm import Session
from app.schemas.category import CategoryCreate, CategoryOut
from app.models.category import Category
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/categories", tags=["categories"])

@router.post("/add", response_model=CategoryOut)
async def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = db.query(Category).filter(Category.name == category.name).first()
    if db_category:
        raise HTTPException(
            status_code=400,
            detail="Category already exists"
        )
    new_category = Category(
        name = category.name
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@router.get("/all", response_model=list[CategoryOut])
async def get_all_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return categories

@router.get("/{category_id}", response_model=CategoryOut)
async def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )
    return category

