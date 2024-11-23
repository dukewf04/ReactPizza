from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import pizza, user, auth

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://46.146.232.223",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pizza.worker, prefix="/api", tags=["pizza"])
app.include_router(user.worker, prefix="/api", tags=["user"])
app.include_router(auth.worker, prefix="/api", tags=["auth"])
