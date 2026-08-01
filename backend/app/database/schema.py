from .connection import get_connection, dict_cursor
DB_INIT_LOCK_ID = 918273645

def init_db() -> None:
    conn = None
    cur = None
    try:
        conn = get_connection()
        cur = dict_cursor(conn)
        cur.execute("SELECT pg_advisory_lock(%s)", (DB_INIT_LOCK_ID,))
        # ── 1. Projects ──────────────────────────────────────────────────────
        cur.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id SERIAL PRIMARY KEY,
                slug VARCHAR(255) UNIQUE NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                image_url TEXT,
                github_url TEXT,
                demo_url TEXT,
                stars INTEGER DEFAULT 0,
                tech TEXT[],  -- e.g. '{"React","TypeScript","FastAPI"}'
                created_at TIMESTAMP DEFAULT NOW()
            );
      
        """)
        cur.execute("ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url TEXT;")
        # app/database/schema.py — add this inside init_db(), after the ALTER TABLE line you already have
        cur.execute("ALTER TABLE projects ADD COLUMN IF NOT EXISTS problem TEXT;")
        cur.execute("ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution TEXT;")
        cur.execute("ALTER TABLE projects ADD COLUMN IF NOT EXISTS enterprise TEXT[];")
        cur.execute("ALTER TABLE projects ADD COLUMN IF NOT EXISTS images TEXT[];")
        conn.commit()
        print("✅ Database initialized successfully.")

    except Exception as e:
        if conn:
            conn.rollback()
        print("❌ Error initializing database:", e)
        raise

    finally:
        if cur:
            try:
                cur.execute("SELECT pg_advisory_unlock(%s)", (DB_INIT_LOCK_ID,))
            except Exception:
                pass  # connection may already be broken; don't mask the original error
            cur.close()
        if conn:
            conn.close()
init_db()