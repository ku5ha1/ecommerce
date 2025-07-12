from fastapi import FastAPI
from app.routes.auth import router as auth_router
from app.routes.categories import router as category_router
from app.routes.products import router as product_router
from app.db.database import Base, engine
from app.routes.cart import router as cart_router
from app.routes.checkout import router as checkout_router
from app.routes.order import router as order_router
from app.routes.admin import router as admin_router
from app.routes.profile import router as profile_router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Debug: Check if environment variables are loaded
print("=== ENV DEBUG ===")
print("SECRET_KEY loaded:", "Yes" if os.getenv("SECRET_KEY") else "No")
print("ALGORITHM loaded:", os.getenv("ALGORITHM"))
print("DATABASE_URL loaded:", "Yes" if os.getenv("DATABASE_URL") else "No")
print("==================")

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware, 
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

def init_db():
    Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(category_router)
app.include_router(product_router)
app.include_router(cart_router)
app.include_router(checkout_router)
app.include_router(order_router)
app.include_router(admin_router)
app.include_router(profile_router)

@app.get("/ping")
async def ping():
    return {"message": "ping-pong - App pinged successfully"}

@app.on_event("startup")
async def startup_event():
    init_db()