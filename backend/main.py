from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from routers import signals, zones, stats, users, notifications
import database as db


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing Firebase Firestore...")
    db.initialize_firestore()
    yield
    print("Shutting down...")


app = FastAPI(
    title="EarlyShield API",
    description="Backend API for EarlyShield Campus Risk Management Platform",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://earlyshield.onrender.com",
        "https://earlyshield.onrender.com",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(signals.router, prefix="/api")
app.include_router(zones.router, prefix="/api")
app.include_router(stats.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")


@app.get("/")
async def root():
    return {
        "message": "EarlyShield API",
        "docs": "/docs",
        "version": "2.0.0",
        "database": "Firebase Firestore"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "Firebase Firestore"}
