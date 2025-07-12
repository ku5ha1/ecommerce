from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SQLEnum, DateTime
from app.db.database import Base 
from sqlalchemy.orm import relationship
from enum import Enum
from datetime import datetime


class DeliveryMethod(str, Enum):
    PICKUP = "pickup"
    DELIVERY = "delivery"

class ShippingInfo(Base):
    __tablename__ = "shippinginfo"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    full_name = Column(String)
    email = Column(String) 
    phone = Column(String)  # Changed from Integer to String to handle large phone numbers
    delivery_method = Column(SQLEnum(DeliveryMethod, values_callable=lambda x: [e.value for e in x], native_enum=False), nullable=False, server_default="delivery")
    pickup_time = Column(DateTime, nullable=True)
    address = Column(String)
    city = Column(String)
    state = Column(String)  
    country = Column(String)
    zip = Column(String)

    order = relationship("Order", back_populates="shipping_info")