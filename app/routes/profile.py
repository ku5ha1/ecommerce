from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate, UserPasswordUpdate
from app.auth.auth_handler import hash_password, verify_password
from app.db.database import get_db
from app.auth.auth_handler import get_current_user

router = APIRouter(prefix="/profile", tags=["user"])

@router.get("/", response_model=UserOut)
async def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return current_user

@router.put("/update", response_model=UserOut)
async def update_my_profile(
    updated_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  
):
    new_username = db.query(User).filter(User.username == updated_data.username,
                          User.id != current_user.id).first()
    if new_username:
        raise HTTPException(
            status_code=400,
            detail="Username already in use"
        )
    new_email = db.query(User).filter(User.email == updated_data.email,
                                      User.id != current_user.id).first()
    if new_email:
        raise HTTPException(
            status_code=400,
            detail="Email already in use"
        )
    if updated_data.username:
        setattr(current_user, "username", updated_data.username)
    if updated_data.email:
        setattr(current_user, "email", updated_data.email)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/update-password")
async def update_password(
    passwords: UserPasswordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not verify_password(passwords.old_password, str(current_user.hashed_password)):
        raise HTTPException(status_code=400, detail="Incorrect old password")

    setattr(current_user, "hashed_password", hash_password(passwords.new_password))
    db.commit()
    return {"message": "Password updated successfully"}