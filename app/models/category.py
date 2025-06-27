from sqlalchemy import Column, String, Integer
from app.db.database import Base
from sqlalchemy.orm import relationship

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True)

    products = relationship("Product", back_populates="category")