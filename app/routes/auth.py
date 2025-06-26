from db.database import get_db
from sqlalchemy.orm import Session 
from models.user import User 
from schemas.user import UserCreate, UserLogin, UserOut
from auth.auth_handler import hash_password, verify_password, create_access_token, get_current_user
from fastapi import APIRouter, Depends, HTTPException, status 

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserOut)
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        (User.username == user_data.username) |
        (User.email == user_data.email)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="username or Email already registered"
        )
    hashed_password = hash_password(user_data.password)
    new_user = User(
        username = user_data.username,
        email = user_data.email,
        hashed_password = hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user