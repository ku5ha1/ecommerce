from fastapi import Depends, APIRouter, HTTPException
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.models.product import Product
from app.models.category import Category
from app.schemas.product import ProductCreate, ProductOut

router = APIRouter(prefix="/products", tags=["products"])

@router.post("/add", response_model=ProductOut)
async def create_product(product_data: ProductCreate, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == product_data.category_id).first()
    if not category:
        raise HTTPException(
            status_code=400,
            detail="Category ID invalid"
        )    
    new_product = Product(
        name = product_data.name,
        quantity = product_data.quantity,
        category_id = product_data.category_id
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

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

@router.put("/update/{product_id}", response_model=ProductOut)
async def update_product(product_id: int, product_data: ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(
            status_code=404,
            detail="Product does not exist"
        )
    if product_data.category_id != db_product.category_id:
        raise HTTPException(
            status_code=400,
            detail="Invalid Category ID"
        )
    setattr(db_product, "name", product_data.name) 
    setattr(db_product, "quantity", product_data.quantity) 
    setattr(db_product, "category_id", product_data.category_id) 

    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}")
async def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(
            status_code=400,
            detail="Product Not Found"
        )
    
    db.delete(db_product)
    db.commit()
    return { "message" : f"Successfully deleted product {db_product.name}" }