from sqlalchemy import Column, Integer, ForeignKey, Float, DateTime, String
from app.db.database import Base 
from sqlalchemy.orm import relationship

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id  = Column(Integer, ForeignKey("users.id"))
    total_amount = Column(Float)
    created_at = Column(DateTime)
    status = Column(String, default="pending")

    user = relationship("User", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order")
    shipping_info = relationship("ShippingInfo", back_populates="order",uselist=False)