from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.user import User 
from app.auth.auth_handler import get_current_user
from app.db.database import get_db
from app.schemas.cart import CartItemCreate, CartItemOut
from app.models.product import Product
from app.models.cartItem import CartItem

router = APIRouter(prefix="/cart", tags=["cart"])

@router.post("/add")
#Allow a logged-in user to add a product to their cart (either by creating a new cart item or updating quantity if it already exists
async def add_to_cart(item_to_add: CartItemCreate ,current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == item_to_add.product_id).first()
    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product does not exist"
        )
    cart_item = db.query(CartItem).filter(
        CartItem.product_id == item_to_add.product_id,
        CartItem.user_id == current_user.id
        ).first()
    if cart_item:
        setattr(cart_item, "quantity", cart_item.quantity + item_to_add.quantity)
    else:
        cart_item = CartItem(
            user_id = current_user.id,
            product_id = item_to_add.product_id,
            quantity = item_to_add.quantity
        )
        db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    return { "message" : "Item added successfully",
            "item": cart_item }

@router.get("/cart", response_model=list[CartItemOut])
async def get_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(
            status_code=404,
            detail="No products in cart"
        )
    return cart_items

@router.put("/update/{product_id}")
async def update_cart_item(product_id: int, qty: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if qty <= 0:
        raise HTTPException(
            status_code=400, 
            detail="Quantity cannot be negative"
        )
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )
    cart_item = db.query(CartItem).filter(
        CartItem.product_id == product_id,
        CartItem.user_id == current_user.id
        ).first()
    if not cart_item:
        raise HTTPException(
            status_code=400,
            detail="Cart item does not exist"
        )
    if qty > getattr(product, "quantity", 0):
        raise HTTPException(
            status_code=400, 
            detail="Cannot exceed inventory stock"
        )
    try:
        setattr(cart_item, "quantity", qty)
        db.commit()
        db.refresh(cart_item)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error updating cart: {str(e)}"
        )

@router.delete("/remove/{product_id}")
async def delete_product_from_cart(
    product_id: int, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart_item = db.query(CartItem).filter(
        CartItem.product_id == product_id,
        CartItem.user_id == current_user.id
        ).first()
    if not cart_item:
        raise HTTPException(
            status_code=404,
            detail="Cart Item not found"
        ) 
    db.delete(cart_item)
    db.commit()
    return {"message": "Item removed from cart successfully"}

@router.delete("/clear-all")
async def clear_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(
            status_code=404,
            detail="Cart is already empty"
        ) 
    for i in cart_items:
        db.delete(i)
    db.commit()
    return { "message" : "All items removed" }