from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pathlib import Path

from app.routers import appendix


def create_app() -> FastAPI:
    app = FastAPI(
        title="Auto Appendix API",
        description="Create appendix documents with one figure per page",
        version="1.0.0",
    )

    # Mount static files
    static_path = Path(__file__).parent / "static"
    app.mount("/static", StaticFiles(directory=str(static_path)), name="static")

    # Health check endpoint
    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "service": "appendix-creator"}

    # Include routers
    app.include_router(appendix.router)

    return app
