from .connection import dict_cursor, get_connection

DB_INIT_LOCK_ID = 918273645


def init_db() -> None:
    conn = None
    cur = None
    try:
        conn = get_connection()
        cur = dict_cursor(conn)
        cur.execute("SELECT pg_advisory_lock(%s)", (DB_INIT_LOCK_ID,))

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
                tech TEXT[],
                created_at TIMESTAMP DEFAULT NOW()
            );
        """)
        cur.execute("ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url TEXT;")
        cur.execute("ALTER TABLE projects ADD COLUMN IF NOT EXISTS problem TEXT;")
        cur.execute("ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution TEXT;")
        cur.execute("ALTER TABLE projects ADD COLUMN IF NOT EXISTS enterprise TEXT[];")
        cur.execute("ALTER TABLE projects ADD COLUMN IF NOT EXISTS images TEXT[];")

        cur.execute("""
            CREATE TABLE IF NOT EXISTS articles (
                id SERIAL PRIMARY KEY,
                slug VARCHAR(255) UNIQUE NOT NULL,
                title TEXT NOT NULL,
                category TEXT NOT NULL DEFAULT 'Engineering',
                excerpt TEXT,
                content TEXT,
                cover_image_url TEXT,
                published BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        """)
        cur.execute("ALTER TABLE articles ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Engineering';")
        cur.execute("ALTER TABLE articles ADD COLUMN IF NOT EXISTS excerpt TEXT;")
        cur.execute("ALTER TABLE articles ADD COLUMN IF NOT EXISTS content TEXT;")
        cur.execute("ALTER TABLE articles ADD COLUMN IF NOT EXISTS cover_image_url TEXT;")
        cur.execute("ALTER TABLE articles ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT FALSE;")
        cur.execute("ALTER TABLE articles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();")

        cur.execute("""
            CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                article_slug VARCHAR(255) NOT NULL REFERENCES articles(slug) ON DELETE CASCADE,
                author_name TEXT NOT NULL,
                author_email TEXT,
                body TEXT NOT NULL,
                rating INTEGER NOT NULL DEFAULT 0,
                approved BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT NOW()
            );
        """)
        cur.execute("ALTER TABLE comments ADD COLUMN IF NOT EXISTS author_email TEXT;")
        cur.execute("ALTER TABLE comments ADD COLUMN IF NOT EXISTS rating INTEGER NOT NULL DEFAULT 0;")
        cur.execute("ALTER TABLE comments ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT FALSE;")

        cur.execute("""
            CREATE TABLE IF NOT EXISTS testimonials (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                role TEXT,
                quote TEXT NOT NULL,
                rating INTEGER NOT NULL DEFAULT 0,
                approved BOOLEAN NOT NULL DEFAULT TRUE,
                display_order INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        """)
        cur.execute("ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS role TEXT;")
        cur.execute("ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS rating INTEGER NOT NULL DEFAULT 0;")
        cur.execute("ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT TRUE;")
        cur.execute("ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0;")
        cur.execute("ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();")

        conn.commit()
        print("Database initialized successfully.")

    except Exception as e:
        if conn:
            conn.rollback()
        print("Error initializing database:", e)
        raise

    finally:
        if cur:
            try:
                cur.execute("SELECT pg_advisory_unlock(%s)", (DB_INIT_LOCK_ID,))
            except Exception:
                pass
            cur.close()
        if conn:
            conn.close()
