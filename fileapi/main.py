from fastapi import FastAPI
import uvicorn
import cdn
import streaming
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return "a"

app.include_router(cdn.router)
app.include_router(streaming.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
