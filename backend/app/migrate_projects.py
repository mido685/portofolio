import os
import psycopg2
from app.database.connection import get_connection
PROJECTS = [
    {
        "slug": "stark-medical-tokenizer",
        "title": "Stark Medical Tokenizer",
        "description": "A WordPiece tokenizer built from scratch for medical NLP — same algorithm used in BERT and BioBERT. Features a HuggingFace-compatible API, medical text preprocessing pipeline covering 28 clinical domains, subword vocabulary learning, and a live demo powered by FastAPI deployed on HuggingFace Spaces.",
        "image_url": "https://fox6ujdpi5at8xas.public.blob.vercel-storage.com/projects/stark-medical-tokenizer-fda287c069ff4a26ac2f4e747b573fc9.png",
        "github_url": "https://github.com/mido685/stark_tokenizer",
        "demo_url": "https://mido685.github.io/stark_tokenizer/",
        "stars": 5,
        "tech": [
            "Python",
            "FastAPI",
            "WordPiece Algorithm",
            "Medical NLP",
            "HuggingFace Spaces",
            "PyTorch",
        ],
        "problem": "Generic tokenizers split medical terminology poorly, breaking drug names, dosages, and clinical abbreviations into meaningless fragments. This degrades downstream NLP model accuracy on medical text.",
        "solution": "Built a custom WordPiece tokenizer trained specifically on clinical vocabulary across 28 medical domains, preserving the integrity of medical terms and enabling more accurate downstream NLP tasks like NER and classification.",
        "enterprise": [
            "Reduces preprocessing errors in medical NLP pipelines",
            "HuggingFace-compatible",
            "drops into existing BERT/BioBERT workflows",
            "Deployable as a standalone API service for clinical data teams",
        ],
        "images": [
            "https://fox6ujdpi5at8xas.public.blob.vercel-storage.com/projects/stark-medical-tokenizer-fda287c069ff4a26ac2f4e747b573fc9.png"
        ],
    },
    {
        "slug": "stark-medical-assistance-reminder",
        "title": "Stark Medical Assistance Reminder",
        "description": "A production-ready AI-powered medication tracker built with a fine-tuned BERT model for medical Named Entity Recognition (NER). Extracts drug names, doses, frequencies, and times from natural language input. Features a FastAPI backend with PostgreSQL database, scheduled Telegram reminders, rate limiting, and a chat UI.",
        "image_url": "https://fox6ujdpi5at8xas.public.blob.vercel-storage.com/projects/stark-medical-assistance-reminder-fdc2a1c0f346455c8db97c5792755ad5.png",
        "github_url": "https://github.com/mido685/medical_assistance",
        "demo_url": "https://mido685.github.io/medical_assistance/",
        "stars": 5,
        "tech": [
            "Python",
            "FastAPI",
            "BERT",
            "Medical NER",
            "HuggingFace Spaces",
            "PyTorch",
            "PostgreSQL",
            "Telegram Bot API",
            "Docker",
        ],
        "problem": "Patients frequently forget medication schedules, and manually entering structured reminders (drug, dose, time) is tedious and error-prone, especially for elderly or chronically ill patients.",
        "solution": "A fine-tuned BERT NER model extracts medication details directly from natural language input, automatically scheduling Telegram reminders — no rigid forms required, just describe the medication in plain text.",
        "enterprise": [
            "Improves medication adherence for patients and care teams",
            "Scalable PostgreSQL backend supports multi-patient deployments",
            "Dockerized for easy integration into clinics or health-tech platforms",
        ],
        "images": [
            "https://fox6ujdpi5at8xas.public.blob.vercel-storage.com/projects/stark-medical-assistance-reminder-fdc2a1c0f346455c8db97c5792755ad5.png"
        ],
    },
    {
        "slug": "smart-order-inventory",
        "title": "Smart Order — AI Inventory Optimization",
        "description": "A production-ready AI-powered inventory management system that predicts optimal order quantities using a machine learning model trained on consumption patterns and cost data. Features a Next.js frontend with real-time form validation, a FastAPI backend deployed on HuggingFace Spaces, and a secure Next.js API proxy layer.",
        "image_url": "/manus-storage/stark-ai-project3_eb8160c8.png",
        "github_url": "https://github.com/mido685/Stark",
        "demo_url": "https://stark-git-main-starks-projects-09de8919.vercel.app/",
        "stars": 5,
        "tech": [
            "Python",
            "FastAPI",
            "Machine Learning",
            "Next.js",
            "TypeScript",
            "HuggingFace Spaces",
            "Tailwind CSS",
            "REST API",
            "Vercel",
        ],
        "problem": "Businesses often over-order or under-order inventory due to guesswork, leading to wasted capital tied up in excess stock or lost sales from stockouts.",
        "solution": "A machine learning model trained on historical consumption patterns and cost data predicts optimal order quantities, surfaced through a real-time Next.js interface backed by a secure API proxy layer.",
        "enterprise": [
            "Reduces excess inventory costs and stockout risk",
            "Real-time predictions via a production FastAPI + Next.js stack",
            "Deployed on Vercel + HuggingFace Spaces for enterprise scalability",
        ],
        "images": [
            "/manus-storage/stark-ai-project3_eb8160c8.png"
        ],
    },
]


def migrate():
    conn = get_connection()

    try:
        cur = conn.cursor()

        for project in PROJECTS:
            cur.execute(
                """
                INSERT INTO projects (
                    slug,
                    title,
                    description,
                    image_url,
                    github_url,
                    demo_url,
                    stars,
                    tech,
                    problem,
                    solution,
                    enterprise,
                    images
                )
                VALUES (
                    %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s
                )
                ON CONFLICT (slug)
                DO UPDATE SET
                    title = EXCLUDED.title,
                    description = EXCLUDED.description,
                    image_url = EXCLUDED.image_url,
                    github_url = EXCLUDED.github_url,
                    demo_url = EXCLUDED.demo_url,
                    stars = EXCLUDED.stars,
                    tech = EXCLUDED.tech,
                    problem = EXCLUDED.problem,
                    solution = EXCLUDED.solution,
                    enterprise = EXCLUDED.enterprise,
                    images = EXCLUDED.images
                """,
                (
                    project["slug"],
                    project["title"],
                    project["description"],
                    project["image_url"],
                    project["github_url"],
                    project["demo_url"],
                    project["stars"],
                    project["tech"],
                    project["problem"],
                    project["solution"],
                    project["enterprise"],
                    project["images"],
                ),
            )

            print(f"Migrated: {project['slug']}")

        conn.commit()

        cur.execute(
            "SELECT id, slug, title FROM projects ORDER BY id ASC"
        )

        print("\nProjects currently in Railway database:")
        for row in cur.fetchall():
            print(row)

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()


if __name__ == "__main__":
    migrate()