from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True, unique=True)
    email = Column(String, index=True, unique=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)

    cart_items = relationship("CartItem", back_populates="user")
    orders = relationship("Order", back_populates="user")