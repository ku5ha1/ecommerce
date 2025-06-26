from fastapi import FastAPI 

app = FastAPI()

@app.get("/ping")
async def ping():
    return {"message": "ping-pong - App pinged successfully"}
