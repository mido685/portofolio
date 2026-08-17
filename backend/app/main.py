from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.schema import init_db
from app.routes import articles as articles_router
from app.routes import projects as projects_router


def create_app() -> FastAPI:
    application = FastAPI(title="Stark Portfolio API", version="1.0.0")
    init_db()

    application.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
        allow_origin_regex=r"https://portofolio-.*\.vercel\.app",
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(articles_router.router, prefix="/api")
    application.include_router(projects_router.router, prefix="/api")

    return application
