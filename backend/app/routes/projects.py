import uuid
from pathlib import Path
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from pydantic import BaseModel, Field
import vercel_blob

from app.core.auth import require_admin
from app.database.projects import (
    delete_project,
    get_all_projects,
    get_project_by_slug,
    insert_project,
    update_project,
    update_project_image,
    update_project_video,
)

router = APIRouter(prefix="/projects", tags=["projects"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_GALLERY_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE = 5 * 1024 * 1024  # 5MB
MAX_GALLERY_IMAGES = 10
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/quicktime"}
MAX_VIDEO_SIZE = 50 * 1024 * 1024


class ProjectPayload(BaseModel):
    slug: str = Field(min_length=1)
    title: str = Field(min_length=1)
    description: str | None = None
    github_url: str | None = None
    demo_url: str | None = None
    stars: int = Field(default=0, ge=0, le=5)
    tech: list[str] = Field(default_factory=list)
    problem: str | None = None
    solution: str | None = None
    enterprise: list[str] = Field(default_factory=list)
    images: list[str] = Field(default_factory=list)
    image_url: str | None = None
    video_url: str | None = None


@router.get("")
def list_projects():
    return {"projects": get_all_projects()}


@router.post("", dependencies=[Depends(require_admin)])
def create_project(payload: ProjectPayload):
    project = insert_project(**payload.dict())
    if not project:
        raise HTTPException(status_code=409, detail="Project slug already exists")
    return project


@router.get("/{slug}")
def get_project(slug: str):
    project = get_project_by_slug(slug)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.put("/{slug}", dependencies=[Depends(require_admin)])
def edit_project(slug: str, payload: ProjectPayload):
    data = payload.dict()
    data.pop("slug", None)
    project = update_project(slug, **data)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.delete("/{slug}", dependencies=[Depends(require_admin)])
def remove_project(slug: str):
    project = delete_project(slug)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"deleted": project}


@router.post("/{slug}/image", dependencies=[Depends(require_admin)])
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

    try:
        blob_result = vercel_blob.put(blob_path, contents, {"access": "public"})
        image_url = blob_result["url"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blob upload failed: {str(e)}")

    updated = update_project_image(slug, image_url)

    return {"imageUrl": image_url, "project": updated}


@router.post("/{slug}/images", dependencies=[Depends(require_admin)])
async def upload_project_gallery(slug: str, images: list[UploadFile] = File(...)):
    if not get_project_by_slug(slug):
        raise HTTPException(status_code=404, detail="Project not found")
    if not images:
        raise HTTPException(status_code=400, detail="Choose at least one image")
    if len(images) > MAX_GALLERY_IMAGES:
        raise HTTPException(
            status_code=400,
            detail=f"Upload no more than {MAX_GALLERY_IMAGES} images at a time",
        )

    image_contents = []
    for image in images:
        if image.content_type not in ALLOWED_GALLERY_TYPES:
            raise HTTPException(
                status_code=400,
                detail="Gallery images must be JPG, PNG, or WebP files",
            )

        contents = await image.read(MAX_SIZE + 1)
        if len(contents) > MAX_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"{image.filename or 'Image'} is larger than 5MB",
            )

        image_contents.append((image, contents))

    uploaded_urls = []
    for image, contents in image_contents:
        ext = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}[image.content_type]
        blob_path = f"projects/{slug}/gallery-{uuid.uuid4().hex}{ext}"
        try:
            blob_result = vercel_blob.put(blob_path, contents, {"access": "public"})
            uploaded_urls.append(blob_result["url"])
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Gallery upload failed: {str(e)}")

    return {"images": uploaded_urls}


@router.post("/{slug}/video", dependencies=[Depends(require_admin)])
async def upload_project_video(slug: str, video: UploadFile = File(...)):
    if not get_project_by_slug(slug):
        raise HTTPException(status_code=404, detail="Project not found")
    if video.content_type not in ALLOWED_VIDEO_TYPES:
        raise HTTPException(status_code=400, detail="Choose an MP4, WebM, or MOV video")
    contents = await video.read(MAX_VIDEO_SIZE + 1)
    if len(contents) > MAX_VIDEO_SIZE:
        raise HTTPException(status_code=400, detail="Video file too large (max 50MB)")
    ext = {"video/mp4": ".mp4", "video/webm": ".webm", "video/quicktime": ".mov"}[video.content_type]
    try:
        blob_result = vercel_blob.put(f"projects/{slug}/demo-{uuid.uuid4().hex}{ext}", contents, {"access": "public"})
        video_url = blob_result["url"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video upload failed: {str(e)}")
    updated = update_project_video(slug, video_url)
    return {"videoUrl": video_url, "project": updated}


@router.delete("/{slug}/video", dependencies=[Depends(require_admin)])
def delete_project_video(slug: str):
    if not get_project_by_slug(slug):
        raise HTTPException(status_code=404, detail="Project not found")
    updated = update_project_video(slug, None)
    return {"project": updated}
