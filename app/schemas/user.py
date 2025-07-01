from pydantic import BaseModel 
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: str
    password: str 

class UserLogin(BaseModel):
    username:  str
    password: str

class UserUpdate(BaseModel):
    username: Optional[str]
    email: Optional[str]

class UserPasswordUpdate(BaseModel):
    old_password: str 
    new_password: str

class UserOut(BaseModel):
    username: str
    email: str
    id: int
    is_admin: bool

    class Config: 
        from_attributes = True 
