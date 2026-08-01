from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import projects as projects_router


def create_app() -> FastAPI:
    application = FastAPI(title="Stark Portfolio API", version="1.0.0")

    application.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "https://your-frontend.vercel.app",  # update once deployed
        ],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(projects_router.router, prefix="/api")

    return application