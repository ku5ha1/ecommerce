from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from app.db.database import get_db
from app.auth.dependencies import admin_required
from app.models.category import Category
from app.models.order import Order
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductOut
from app.models.user import User
from app.schemas.user import UserOut
from app.schemas.category import CategoryCreate, CategoryOut
from app.schemas.order import OrderOut, OrderStatusChange
from typing import List, Optional
from datetime import datetime
from app.schemas.shipping_info import ShippingInfoOut
 
router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/add-product", response_model=ProductOut)
async def create_product(product_data: ProductCreate, 
                         db: Session = Depends(get_db),
                         current_user: User = Depends(admin_required)):
    category = db.query(Category).filter(Category.id == product_data.category_id).first()
    if not category:
        raise HTTPException(
            status_code=400,
            detail="Category ID invalid"
        ) 
    try:
        new_product = Product(
        name = product_data.name,
        quantity = product_data.quantity,
        description = product_data.description,
        category_id = product_data.category_id,
        price=product_data.price,
        product_image = product_data.product_image
    )
        db.add(new_product)
        db.commit()
        db.refresh(new_product)
        return new_product
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to create product"
        )
    
@router.put("/update/{product_id}", response_model=ProductOut)
async def update_product(product_id: int, 
                        product_data: ProductCreate,
                        db: Session = Depends(get_db),
                        current_user: User = Depends(admin_required)):
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
    try:
        setattr(db_product, "name", product_data.name) 
        setattr(db_product, "quantity", product_data.quantity) 
        setattr(db_product, "category_id", product_data.category_id) 
        setattr(db_product, "price", product_data.price) 
        setattr(db_product, "product_image", product_data.product_image) 

        db.commit()
        db.refresh(db_product)
        return db_product
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Update failed"
        )
    
@router.delete("/{product_id}")
async def delete_product(product_id: int,
                         db: Session = Depends(get_db),
                         current_user: User = Depends(admin_required)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(
            status_code=404,
            detail="Product Not Found"
        )
    try:
        db.delete(db_product)
        db.commit()
        return { "message" : f"Successfully deleted the product" }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Deletion failed"
        )
    
@router.post("/add-category", response_model=CategoryOut)
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
        name = category.name,
        category_image = category.category_image
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

@router.delete("/{category_id}")
async def delete_category(category_id: int,
                          db: Session = Depends(get_db),
                          current_user: User = Depends(admin_required)):
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
    return {"message": f"Successfuly deleted category"}

@router.get("/view-all-orders", response_model=List[OrderOut])
async def view_all_orders(
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
    user_id: Optional[int] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
):
    query = db.query(Order).options(
        joinedload(Order.order_items),
        joinedload(Order.user),
        joinedload(Order.shipping_info)
    )
    if user_id:
        query = query.filter(Order.user_id == user_id)
    if start_date:
        query = query.filter(Order.created_at >= start_date)
    if end_date:
        query = query.filter(Order.created_at <= end_date)

    orders = query.order_by(desc(Order.created_at)).all()
    return [
        {
            "id": order.id,
            "user_id": order.user_id,
            "total_amount": order.total_amount,
            "created_at": order.created_at,
            "user_details": order.user,
            "order_items": order.order_items,
            "status": order.status,
            "shipping_info": order.shipping_info
        }
        for order in orders
    ]

@router.get("/orders/{order_id}", response_model=OrderOut)
async def fetch_single_order(
    order_id: int, 
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    single_order = db.query(Order).options(
        joinedload(Order.order_items),
        joinedload(Order.user),
        joinedload(Order.shipping_info)
    ).filter(
        Order.id == order_id
    ).first()
    if not single_order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )
    return {
        "id": single_order.id,
        "user_id": single_order.user_id,
        "total_amount": single_order.total_amount,
        "created_at": single_order.created_at,
        "user_details": single_order.user,
        "order_items": single_order.order_items,
        "status": single_order.status,
        "shipping_info": single_order.shipping_info
    }

@router.get("/all-users", response_model=List[UserOut])
async def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    all_users = db.query(User).all()
    if not all_users:
        raise HTTPException(
            status_code=404,
            detail="No user found"
        )
    return all_users

@router.put("/users/{user_id}")
async def update_user(
    user_id: int, 
    make_admin: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    user_to_update = db.query(User).get(user_id)
    if not user_to_update:
        raise HTTPException(404, "User not found")
    if user_to_update.id == current_user.id:
        raise HTTPException(400, "Cannot modify your own privileges")
    
    try:
        setattr(user_to_update, 'is_admin', bool(make_admin))
        db.commit()
        return {"message": f"Admin status updated to {make_admin}"}
    except Exception as e:
        db.rollback()
        raise HTTPException(500, "Update failed")
    
@router.get("/dashboard-stats")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    return {
        "Total Users": db.query(User).count(),
        "Total Orders": db.query(Order).count(),
        "Total Revenue": db.query(func.sum(Order.total_amount)).scalar() or 0,
        "Total Products": db.query(Product).count(),
        "Total out of Stock": db.query(Product).filter(
            Product.quantity == 0
        ).count()
    }

@router.get("/shipping-info/{order_id}", response_model=ShippingInfoOut)
async def get_shipping_details(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    order_detail = db.query(Order).filter(
        Order.id == order_id
    ).first()
    if not order_detail:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )
    shipping_detail = order_detail.shipping_info
    if not shipping_detail:
        raise HTTPException(
            status_code=404,
            detail="Shipping details not found"
        )
    return shipping_detail

@router.put("/order/status/{order_id}")
async def update_order_status(
    order_id: int, 
    order_status: OrderStatusChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    order_to_update = db.query(Order).filter(
        Order.id == order_id
    ).first()
    if not order_to_update:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )
    setattr(order_to_update, "status", order_status.status)
    db.commit()
    db.refresh(order_to_update)

    return {"message": f"Order status changed to {order_status.status.value}"}

