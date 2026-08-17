from .connection import dict_cursor, get_connection


def get_all_articles(include_unpublished: bool = False):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        if include_unpublished:
            cur.execute("SELECT * FROM articles ORDER BY created_at DESC, id DESC")
        else:
            cur.execute(
                "SELECT * FROM articles WHERE published = TRUE ORDER BY created_at DESC, id DESC"
            )
        return cur.fetchall()
    finally:
        conn.close()


def get_article_by_slug(slug: str, include_unpublished: bool = False):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        if include_unpublished:
            cur.execute("SELECT * FROM articles WHERE slug = %s", (slug,))
        else:
            cur.execute(
                "SELECT * FROM articles WHERE slug = %s AND published = TRUE",
                (slug,),
            )
        return cur.fetchone()
    finally:
        conn.close()


def insert_article(
    slug: str,
    title: str,
    category: str = "Engineering",
    excerpt: str = None,
    content: str = None,
    cover_image_url: str = None,
    published: bool = False,
):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute(
            """
            INSERT INTO articles
                (slug, title, category, excerpt, content, cover_image_url, published)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (slug) DO NOTHING
            RETURNING *
            """,
            (slug, title, category, excerpt, content, cover_image_url, published),
        )
        row = cur.fetchone()
        conn.commit()
        return row
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def update_article(
    slug: str,
    title: str,
    category: str = "Engineering",
    excerpt: str = None,
    content: str = None,
    cover_image_url: str = None,
    published: bool = False,
):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute(
            """
            UPDATE articles
            SET title = %s,
                category = %s,
                excerpt = %s,
                content = %s,
                cover_image_url = %s,
                published = %s,
                updated_at = NOW()
            WHERE slug = %s
            RETURNING *
            """,
            (title, category, excerpt, content, cover_image_url, published, slug),
        )
        row = cur.fetchone()
        conn.commit()
        return row
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def delete_article(slug: str):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute("DELETE FROM articles WHERE slug = %s RETURNING *", (slug,))
        row = cur.fetchone()
        conn.commit()
        return row
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def get_comments(article_slug: str | None = None, approved_only: bool = True):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        filters = []
        params = []
        if article_slug:
            filters.append("article_slug = %s")
            params.append(article_slug)
        if approved_only:
            filters.append("approved = TRUE")

        where = f"WHERE {' AND '.join(filters)}" if filters else ""
        cur.execute(
            f"SELECT * FROM comments {where} ORDER BY created_at DESC, id DESC",
            tuple(params),
        )
        return cur.fetchall()
    finally:
        conn.close()


def insert_comment(article_slug: str, author_name: str, author_email: str = None, body: str = None):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute(
            """
            INSERT INTO comments (article_slug, author_name, author_email, body)
            VALUES (%s, %s, %s, %s)
            RETURNING *
            """,
            (article_slug, author_name, author_email, body),
        )
        row = cur.fetchone()
        conn.commit()
        return row
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def update_comment_status(comment_id: int, approved: bool):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute(
            "UPDATE comments SET approved = %s WHERE id = %s RETURNING *",
            (approved, comment_id),
        )
        row = cur.fetchone()
        conn.commit()
        return row
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def delete_comment(comment_id: int):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute("DELETE FROM comments WHERE id = %s RETURNING *", (comment_id,))
        row = cur.fetchone()
        conn.commit()
        return row
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
