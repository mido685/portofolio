from .connection import dict_cursor, get_connection


def get_certifications(include_unpublished: bool = False):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        query = "SELECT * FROM certifications"
        if not include_unpublished:
            query += " WHERE published = TRUE"
        query += " ORDER BY issue_date DESC NULLS LAST, id DESC"
        cur.execute(query)
        return cur.fetchall()
    finally:
        conn.close()


def get_certification(certification_id: int):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute("SELECT * FROM certifications WHERE id = %s", (certification_id,))
        return cur.fetchone()
    finally:
        conn.close()


def insert_certification(**values):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute(
            """
            INSERT INTO certifications
                (category, title, issuer, issue_date, credential_id,
                 credential_url, file_url, description, published)
            VALUES (%(category)s, %(title)s, %(issuer)s, %(issue_date)s,
                    %(credential_id)s, %(credential_url)s, %(file_url)s,
                    %(description)s, %(published)s)
            RETURNING *
            """,
            values,
        )
        row = cur.fetchone()
        conn.commit()
        return row
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def update_certification(certification_id: int, **values):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute(
            """
            UPDATE certifications
            SET category = %(category)s,
                title = %(title)s,
                issuer = %(issuer)s,
                issue_date = %(issue_date)s,
                credential_id = %(credential_id)s,
                credential_url = %(credential_url)s,
                file_url = %(file_url)s,
                description = %(description)s,
                published = %(published)s,
                updated_at = NOW()
            WHERE id = %(id)s
            RETURNING *
            """,
            {**values, "id": certification_id},
        )
        row = cur.fetchone()
        conn.commit()
        return row
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def update_certification_file(certification_id: int, file_url: str):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute(
            "UPDATE certifications SET file_url = %s, updated_at = NOW() WHERE id = %s RETURNING *",
            (file_url, certification_id),
        )
        row = cur.fetchone()
        conn.commit()
        return row
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def delete_certification(certification_id: int):
    conn = get_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute("DELETE FROM certifications WHERE id = %s RETURNING *", (certification_id,))
        row = cur.fetchone()
        conn.commit()
        return row
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
