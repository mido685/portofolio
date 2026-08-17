from .connection import dict_cursor, get_connection


def get_all_testimonials(include_hidden: bool = False):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        if include_hidden:
            cur.execute("SELECT * FROM testimonials ORDER BY display_order ASC, id ASC")
        else:
            cur.execute(
                """
                SELECT * FROM testimonials
                WHERE approved = TRUE
                ORDER BY display_order ASC, id ASC
                """
            )
        return cur.fetchall()
    finally:
        conn.close()


def insert_testimonial(
    name: str,
    role: str = None,
    quote: str = None,
    rating: int = 5,
    approved: bool = True,
    display_order: int = 0,
):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute(
            """
            INSERT INTO testimonials
                (name, role, quote, rating, approved, display_order)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING *
            """,
            (name, role, quote, rating, approved, display_order),
        )
        row = cur.fetchone()
        conn.commit()
        return row
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def update_testimonial(
    testimonial_id: int,
    name: str,
    role: str = None,
    quote: str = None,
    rating: int = 5,
    approved: bool = True,
    display_order: int = 0,
):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute(
            """
            UPDATE testimonials
            SET name = %s,
                role = %s,
                quote = %s,
                rating = %s,
                approved = %s,
                display_order = %s,
                updated_at = NOW()
            WHERE id = %s
            RETURNING *
            """,
            (name, role, quote, rating, approved, display_order, testimonial_id),
        )
        row = cur.fetchone()
        conn.commit()
        return row
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def delete_testimonial(testimonial_id: int):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute("DELETE FROM testimonials WHERE id = %s RETURNING *", (testimonial_id,))
        row = cur.fetchone()
        conn.commit()
        return row
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
