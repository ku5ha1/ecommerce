from fastapi import FastAPI
from app.routes.auth import router as auth_router
from app.routes.categories import router as category_router
from app.routes.products import router as product_router
from app.db.database import Base, engine
from app.routes.cart import router as cart_router
from app.routes.checkout import router as checkout_router
from app.routes.order import router as order_router
from app.routes.admin import router as admin_router

app = FastAPI()

def init_db():
    Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(category_router)
app.include_router(product_router)
app.include_router(cart_router)
app.include_router(checkout_router)
app.include_router(order_router)
app.include_router(admin_router)

@app.get("/ping")
async def ping():
    return {"message": "ping-pong - App pinged successfully"}

@app.on_event("startup")
async def startup_event():
    init_db()