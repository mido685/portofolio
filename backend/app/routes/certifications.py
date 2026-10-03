import uuid
from datetime import date
from typing import Literal

import vercel_blob
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pydantic import BaseModel, Field

from app.core.auth import require_admin
from app.database.certifications import (
    delete_certification,
    get_certification,
    get_certifications,
    insert_certification,
    update_certification,
    update_certification_file,
)

router = APIRouter(prefix="/certifications", tags=["certifications"])

ALLOWED_FILE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "application/pdf": ".pdf",
}
MAX_FILE_SIZE = 10 * 1024 * 1024


class CertificationPayload(BaseModel):
    category: Literal["certification", "course"] = "certification"
    title: str = Field(min_length=1, max_length=240)
    issuer: str = Field(min_length=1, max_length=240)
    issue_date: date | None = None
    credential_id: str | None = None
    credential_url: str | None = None
    file_url: str | None = None
    description: str | None = None
    published: bool = False


@router.get("")
def list_public_certifications():
    return {"certifications": get_certifications()}


@router.get("/admin", dependencies=[Depends(require_admin)])
def list_admin_certifications():
    return {"certifications": get_certifications(include_unpublished=True)}


@router.post("", dependencies=[Depends(require_admin)])
def create_certification(payload: CertificationPayload):
    return insert_certification(**payload.dict())


@router.put("/{certification_id}", dependencies=[Depends(require_admin)])
def edit_certification(certification_id: int, payload: CertificationPayload):
    record = update_certification(certification_id, **payload.dict())
    if not record:
        raise HTTPException(status_code=404, detail="Certification not found")
    return record


@router.delete("/{certification_id}", dependencies=[Depends(require_admin)])
def remove_certification(certification_id: int):
    record = delete_certification(certification_id)
    if not record:
        raise HTTPException(status_code=404, detail="Certification not found")
    return {"deleted": record}


@router.post("/{certification_id}/file", dependencies=[Depends(require_admin)])
async def upload_certification_file(certification_id: int, file: UploadFile = File(...)):
    record = get_certification(certification_id)
    if not record:
        raise HTTPException(status_code=404, detail="Certification not found")
    extension = ALLOWED_FILE_TYPES.get(file.content_type or "")
    if not extension:
        raise HTTPException(status_code=400, detail="Upload a JPG, PNG, WebP, or PDF file")

    contents = await file.read(MAX_FILE_SIZE + 1)
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File is too large (max 10MB)")

    blob_path = f"certifications/{record['category']}/{certification_id}-{uuid.uuid4().hex}{extension}"
    try:
        blob_result = vercel_blob.put(blob_path, contents, {"access": "public"})
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Certificate upload failed: {str(error)}")

    return update_certification_file(certification_id, blob_result["url"])
