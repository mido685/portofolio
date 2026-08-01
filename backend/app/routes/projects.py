import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
import vercel_blob

from app.database.projects import get_all_projects, get_project_by_slug, update_project_image

router = APIRouter(prefix="/projects", tags=["projects"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE = 5 * 1024 * 1024  # 5MB


@router.get("")
def list_projects():
    return {"projects": get_all_projects()}


@router.get("/{slug}")
def get_project(slug: str):
    project = get_project_by_slug(slug)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("/{slug}/image")
async def upload_project_image(slug: str, image: UploadFile = File(...)):
    if not get_project_by_slug(slug):
        raise HTTPException(status_code=404, detail="Project not found")

    if image.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only image files are allowed")

    contents = await image.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")

    ext = Path(image.filename).suffix
    blob_path = f"projects/{slug}-{uuid.uuid4().hex}{ext}"

    blob_result = vercel_blob.put(blob_path, contents, {"access": "public"})
    image_url = blob_result["url"]

    updated = update_project_image(slug, image_url)

    return {"imageUrl": image_url, "project": updated}