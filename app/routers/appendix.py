from fastapi import APIRouter, File, UploadFile, Form, Request, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.templating import Jinja2Templates
from pathlib import Path
import os

from app.services.document_service import DocumentService

router = APIRouter()
templates = Jinja2Templates(directory=str(Path(__file__).parent.parent / "templates"))


def cleanup_file(path: str):
    """Delete temporary file after it has been sent."""
    try:
        if os.path.exists(path):
            os.unlink(path)
    except Exception:
        pass


@router.get("/")
async def home(request: Request):
    """Render the home page with the upload form."""
    return templates.TemplateResponse("index.html", {"request": request})


@router.post("/upload")
async def upload(
    background_tasks: BackgroundTasks,
    files: list[UploadFile] = File(...),
    image_width: float = Form(15),
    paper_size: str = Form("A4"),
    output_format: str = Form("docx"),
    caption_position: str = Form("bottom"),
):
    """
    Upload images and generate an appendix document.

    Args:
        background_tasks: FastAPI background tasks for cleanup
        files: List of image files to include in the appendix
        image_width: Width of images in centimeters (8-20)
        paper_size: Paper size ('A4', 'Letter', or 'Legal')
        output_format: Output format ('docx' or 'pdf')
        caption_position: Position of captions ('top' or 'bottom')

    Returns:
        Generated document as a file download
    """
    output_path = DocumentService.create_appendix(
        files, image_width, paper_size, output_format, caption_position
    )

    if output_format == "pdf":
        media_type = "application/pdf"
        filename = "appendix.pdf"
    else:
        media_type = (
            "application/vnd.openxmlformats-officedocument." "wordprocessingml.document"
        )
        filename = "appendix.docx"

    # Schedule file cleanup after response is sent
    background_tasks.add_task(cleanup_file, output_path)

    return FileResponse(
        output_path,
        media_type=media_type,
        filename=filename,
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "healthy"}
