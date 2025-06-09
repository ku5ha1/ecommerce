from fastapi import FastAPI, HTTPException
from . import models 
from .app import engine

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "FastAPI is working!"}
