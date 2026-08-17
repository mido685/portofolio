from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from app.core.auth import require_admin
from app.database.articles import (
    delete_article,
    delete_comment,
    get_all_articles,
    get_article_by_slug,
    get_comments,
    insert_article,
    insert_comment,
    update_article,
    update_comment_status,
)

router = APIRouter(tags=["articles"])


class ArticlePayload(BaseModel):
    slug: str = Field(min_length=1)
    title: str = Field(min_length=1)
    category: str = "Engineering"
    excerpt: str | None = None
    content: str | None = None
    cover_image_url: str | None = None
    published: bool = False


class CommentPayload(BaseModel):
    author_name: str = Field(min_length=1, max_length=120)
    author_email: str | None = None
    body: str = Field(min_length=1, max_length=2000)


class CommentStatusPayload(BaseModel):
    approved: bool


@router.get("/articles")
def list_articles(include_unpublished: bool = Query(default=False)):
    return {"articles": get_all_articles(include_unpublished=include_unpublished)}


@router.post("/articles", dependencies=[Depends(require_admin)])
def create_article(payload: ArticlePayload):
    article = insert_article(**payload.dict())
    if not article:
        raise HTTPException(status_code=409, detail="Article slug already exists")
    return article


@router.get("/articles/{slug}")
def get_article(slug: str, include_unpublished: bool = Query(default=False)):
    article = get_article_by_slug(slug, include_unpublished=include_unpublished)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.put("/articles/{slug}", dependencies=[Depends(require_admin)])
def edit_article(slug: str, payload: ArticlePayload):
    data = payload.dict()
    data.pop("slug", None)
    article = update_article(slug, **data)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.delete("/articles/{slug}", dependencies=[Depends(require_admin)])
def remove_article(slug: str):
    article = delete_article(slug)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"deleted": article}


@router.get("/admin/session", dependencies=[Depends(require_admin)])
def verify_admin_session():
    return {"ok": True}


@router.get("/articles/{slug}/comments")
def list_article_comments(slug: str):
    return {"comments": get_comments(article_slug=slug, approved_only=True)}


@router.post("/articles/{slug}/comments")
def create_article_comment(slug: str, payload: CommentPayload):
    if not get_article_by_slug(slug, include_unpublished=True):
        raise HTTPException(status_code=404, detail="Article not found")
    return insert_comment(slug, **payload.dict())


@router.get("/comments", dependencies=[Depends(require_admin)])
def list_comments():
    return {"comments": get_comments(approved_only=False)}


@router.put("/comments/{comment_id}", dependencies=[Depends(require_admin)])
def edit_comment_status(comment_id: int, payload: CommentStatusPayload):
    comment = update_comment_status(comment_id, payload.approved)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    return comment


@router.delete("/comments/{comment_id}", dependencies=[Depends(require_admin)])
def remove_comment(comment_id: int):
    comment = delete_comment(comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    return {"deleted": comment}
