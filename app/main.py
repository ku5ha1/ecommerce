from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from . import models 
from .schemas import CreatePost
from .database import engine
from .database import get_db

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "FastAPI is working!"}

@app.get("/posts")
async def get_posts(db: Session = Depends(get_db)):
    posts = db.query(models.Post).all()
    return {"posts" : posts}

