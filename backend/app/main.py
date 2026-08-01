from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import projects as projects_router


def create_app() -> FastAPI:
    application = FastAPI(title="Stark Portfolio API", version="1.0.0")

    application.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "https://portofolio-9vcx.vercel.app",
            "https://portofolio-45vh.vercel.app",
        ],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(projects_router.router, prefix="/api")

    return application
