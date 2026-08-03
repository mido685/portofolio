import hmac
import os

from fastapi import Header, HTTPException, status


def require_admin(x_admin_secret: str | None = Header(default=None)) -> None:
    admin_secret = os.getenv("ADMIN_SECRET")

    if not admin_secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="ADMIN_SECRET is not configured",
        )

    if not x_admin_secret or not hmac.compare_digest(x_admin_secret, admin_secret):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin secret",
        )
