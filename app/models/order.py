from sqlalchemy import Column, Integer, ForeignKey, Float, DateTime
from app.db.database import Base 
from sqlalchemy.orm import relationship

class Order(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id  = Column(Integer, ForeignKey("users.id"))
    total_amount = Column(Float)
    created_At = Column(DateTime)

    user = relationship("User", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order")