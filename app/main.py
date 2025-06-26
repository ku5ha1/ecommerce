from fastapi import FastAPI
from app.routes.auth import router as auth_router
from app.db.database import Base, engine

app = FastAPI()

def init_db():
    Base.metadata.create_All(bind=engine)

app.include_router(auth_router)

@app.get("/ping")
async def ping():
    return {"message": "ping-pong - App pinged successfully"}

@app.on_event("startup")
async def startup_event():
    init_db()