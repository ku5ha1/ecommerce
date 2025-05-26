from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from random import randrange

app = FastAPI()


class Post(BaseModel):
    title: str
    content: str
    published: bool = True


posts = [
    {"title": "title of post 1", "content": "content of post 1", "id": 1},
    {"title": "title of post 2", "content": "content of post 2", "id": 2},
]


def get_single_post(id):
    for post in posts:
        if post["id"] == id:
            return post
        
def get_single_id(id):
    for i, p in enumerate(posts):
        if p["id"] == id:
            return i


@app.get("/")
def root():
    return {"message": "FastAPI is working!"}


@app.get("/posts")
async def get_posts():
    return {"message": posts}


@app.post("/posts", status_code=201)
async def create_post(post: Post):
    post_dict = post.dict()
    post_dict["id"] = randrange(0, 100000)
    posts.append(post_dict)
    return {"message": post_dict}


@app.get("/posts/{id}")
async def get_post(id: int):
    post = get_single_post(id)
    if not post:
        raise HTTPException(status_code=404, detail=f"Post with id: {id} was not found")
    return {"message": post}

@app.delete("/posts/{id}", status_code=204)
async def delete_post(id: int):
    index = get_single_id(id)
    if index is None:
        raise HTTPException(status_code=404, detail=f"Post with id: {id} was not found")
    posts.pop(index)
    return {"message": f"Post with id: {index} was deleted"}
    
@app.put("/posts/{id}")
async def update_post(id: int, post: Post):
    index = get_single_id(id)
    if index == None: 
        return HTTPException(status_code=404, detail=f"Post with id: {id} not found")
    post_dict = post.dict()
    post_dict["id"] = id
    posts[index] = post_dict
    return {"data" : post_dict}