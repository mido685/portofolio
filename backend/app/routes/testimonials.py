from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.core.auth import require_admin
from app.database.testimonials import (
    delete_testimonial,
    get_all_testimonials,
    insert_testimonial,
    update_testimonial,
)

router = APIRouter(prefix="/testimonials", tags=["testimonials"])


class TestimonialPayload(BaseModel):
    name: str = Field(min_length=1)
    role: str | None = None
    quote: str = Field(min_length=1)
    rating: int = Field(default=5, ge=0, le=5)
    approved: bool = True
    display_order: int = 0


@router.get("")
def list_testimonials():
    return {"testimonials": get_all_testimonials(include_hidden=False)}


@router.get("/admin", dependencies=[Depends(require_admin)])
def list_admin_testimonials():
    return {"testimonials": get_all_testimonials(include_hidden=True)}


@router.post("", dependencies=[Depends(require_admin)])
def create_testimonial(payload: TestimonialPayload):
    return insert_testimonial(**payload.dict())


@router.put("/{testimonial_id}", dependencies=[Depends(require_admin)])
def edit_testimonial(testimonial_id: int, payload: TestimonialPayload):
    testimonial = update_testimonial(testimonial_id, **payload.dict())
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return testimonial


@router.delete("/{testimonial_id}", dependencies=[Depends(require_admin)])
def remove_testimonial(testimonial_id: int):
    testimonial = delete_testimonial(testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"deleted": testimonial}
