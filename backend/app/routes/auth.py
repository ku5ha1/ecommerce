from app.db.database import get_db
from sqlalchemy.orm import Session 
from app.models.user import User 
from app.schemas.user import UserCreate, UserLogin, UserOut
from app.auth.auth_handler import hash_password, verify_password, create_access_token, get_current_user
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
            detail="Username or Email already registered"
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

@router.post("/login")
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_data.username).first()

    if user is None or not verify_password(user_data.password, str(user.hashed_password)):
        raise HTTPException(    
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Username or Password"
        )
    access_token = create_access_token({"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer", "message": "Login successful"}

@router.post("/me", response_model=UserOut)
async def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user