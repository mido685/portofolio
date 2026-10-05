from .connection import get_connection, dict_cursor


def get_all_projects():
    """Fetch all projects, ordered by id."""
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute("SELECT * FROM projects ORDER BY id ASC")
        return cur.fetchall()
    finally:
        conn.close()


def get_project_by_slug(slug: str):
    """Fetch a single project by slug."""
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute("SELECT * FROM projects WHERE slug = %s", (slug,))
        return cur.fetchone()
    finally:
        conn.close()


def update_project_image(slug: str, image_url: str):
    """Update a project's cover and keep it first in the gallery."""
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute(
            """
            UPDATE projects
            SET image_url = %s,
                images = array_prepend(
                    %s,
                    array_remove(COALESCE(images, ARRAY[]::TEXT[]), %s)
                )
            WHERE slug = %s
            RETURNING *
            """,
            (image_url, image_url, image_url, slug),
        )
        updated = cur.fetchone()
        conn.commit()
        return updated
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def update_project_video(slug: str, video_url: str):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute("UPDATE projects SET video_url = %s WHERE slug = %s RETURNING *", (video_url, slug))
        row = cur.fetchone()
        conn.commit()
        return row
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def update_project(
    slug: str,
    title: str,
    description: str = None,
    github_url: str = None,
    demo_url: str = None,
    stars: int = 0,
    tech: list = None,
    problem: str = None,
    solution: str = None,
    enterprise: list = None,
    images: list = None,
    image_url: str = None,
    video_url: str = None,
):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute(
            """
            UPDATE projects
            SET title = %s,
                description = %s,
                github_url = %s,
                demo_url = %s,
                stars = %s,
                tech = %s,
                problem = %s,
                solution = %s,
                enterprise = %s,
                images = %s,
                image_url = %s,
                video_url = %s
            WHERE slug = %s
            RETURNING *
            """,
            (
                title,
                description,
                github_url,
                demo_url,
                stars,
                tech,
                problem,
                solution,
                enterprise,
                images,
                image_url,
                video_url,
                slug,
            ),
        )
        row = cur.fetchone()
        conn.commit()
        return row
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def delete_project(slug: str):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute("DELETE FROM projects WHERE slug = %s RETURNING *", (slug,))
        row = cur.fetchone()
        conn.commit()
        return row
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def insert_project(
    slug: str,
    title: str,
    description: str = None,
    github_url: str = None,
    demo_url: str = None,
    stars: int = 0,
    tech: list = None,
    problem: str = None,
    solution: str = None,
    enterprise: list = None,
    images: list = None,
    image_url: str = None,
    video_url: str = None,
):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute(
            """
            INSERT INTO projects
                (slug, title, description, github_url, demo_url, stars, tech,
                 problem, solution, enterprise, images, image_url, video_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (slug) DO NOTHING
            RETURNING *
            """,
            (slug, title, description, github_url, demo_url, stars, tech,
             problem, solution, enterprise, images, image_url, video_url),
        )
        row = cur.fetchone()
        conn.commit()
        return row
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
