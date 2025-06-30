from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.database import Base 
from sqlalchemy.orm import relationship

class ShippingInfo(Base):
    __tablename__ = "shippinginfo"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    full_name = Column(String)
    email = Column(String) 
    phone = Column(Integer)
    address = Column(String)
    city = Column(String)
    state = Column(String) 
    county = Column(String)
    zip = Column(String)

    order = relationship("Order", back_populates="shipping_info")



