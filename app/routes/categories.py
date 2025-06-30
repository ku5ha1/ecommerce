from sqlalchemy import func
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.schemas.category import CategoryCreate, CategoryOut
from app.models.category import Category
from fastapi import APIRouter, Depends, HTTPException
from app.auth.dependencies import admin_required
from app.models.user import User

router = APIRouter(prefix="/categories", tags=["categories"])

@router.post("/add", response_model=CategoryOut)
async def create_category(category: CategoryCreate,
                          db: Session = Depends(get_db),
                          current_user: User = Depends(admin_required)):
    db_category = db.query(Category).filter(Category.name == category.name).first()
    if db_category:
        raise HTTPException(
            status_code=400,
            detail="Category already exists"
        )
    try:
        new_category = Category(
        name = category.name
        )
        db.add(new_category)
        db.commit()
        db.refresh(new_category)
        return new_category
    except Exception as e: 
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Could not create category: {e}"
        )

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

@router.put("/update/{category_id}", response_model=CategoryOut)
async def update_category(category_id: int,
                          category: CategoryCreate, 
                          db: Session = Depends(get_db),
                          current_user: User = Depends(admin_required)):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(
            status_code=404,
            detail="Invalid category id"
        )
    if category.name != db_category.name:
        existing_category = db.query(Category).filter(func.lower(Category.name) == category.name.lower()).first()
        if existing_category:
            raise HTTPException(
                status_code=409,
                detail="Category Name already in use"
            )
        
    setattr(db_category, "name", category.name)
    if category.category_image:
        setattr(db_category, "category_image", category.category_image)
    try:
        db.commit()
        db.refresh(db_category)
        return db_category
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Could not update category {e}"
        )


@router.delete("/delete/{id}")
async def delete_product(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )
    if category.products:
        raise HTTPException(
            status_code=400,
            detail="Category with existing products cannot be deleted"
        )
    
    db.delete(category)
    db.commit()
    return {"mmessage": f"Successfuly deleted category"}