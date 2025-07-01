from fastapi import Depends, APIRouter, HTTPException
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.models.product import Product
from app.models.category import Category
from app.schemas.product import ProductCreate, ProductOut
from app.auth.dependencies import admin_required
from app.models.user import User

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/all", response_model=list[ProductOut])
async def get_all_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return products


@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )
    return product
