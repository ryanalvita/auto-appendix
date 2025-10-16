import os
from app import create_app

app = create_app()

if __name__ == "__main__":
    import uvicorn

    # Use environment variables with sensible defaults
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("RELOAD", "false").lower() == "true"

    uvicorn.run(
        app, host=host, port=port, reload=reload  # Enable reload for local development
    )
