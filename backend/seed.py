from app.database.projects import insert_project

projects_data = [
    {
        "slug": "stark-medical-tokenizer",
        "title": "Stark Medical Tokenizer",
        "image_url": "/manus-storage/stark-ai-project1_cc91db65.png",
        "images": ["/manus-storage/stark-ai-project1_cc91db65.png"],
        "stars": 5,
        "description": "A WordPiece tokenizer built from scratch for medical NLP — same algorithm used in BERT and BioBERT. Features a HuggingFace-compatible API, medical text preprocessing pipeline covering 28 clinical domains, subword vocabulary learning, and a live demo powered by FastAPI deployed on HuggingFace Spaces.",
        "tech": ["Python", "FastAPI", "WordPiece Algorithm", "Medical NLP", "HuggingFace Spaces", "PyTorch"],
        "github_url": "https://github.com/mido685/stark_tokenizer",
        "demo_url": "https://mido685.github.io/stark_tokenizer/",
        "problem": "Generic tokenizers split medical terminology poorly, breaking drug names, dosages, and clinical abbreviations into meaningless fragments. This degrades downstream NLP model accuracy on medical text.",
        "solution": "Built a custom WordPiece tokenizer trained specifically on clinical vocabulary across 28 medical domains, preserving the integrity of medical terms and enabling more accurate downstream NLP tasks like NER and classification.",
        "enterprise": [
            "Reduces preprocessing errors in medical NLP pipelines",
            "HuggingFace-compatible, drops into existing BERT/BioBERT workflows",
            "Deployable as a standalone API service for clinical data teams",
        ],
    },
    {
        "slug": "stark-medical-assistance-reminder",
        "title": "Stark Medical Assistance Reminder",
        "image_url": "/manus-storage/stark-ai-project2_9f7c4fac.png",
        "images": ["/manus-storage/stark-ai-project2_9f7c4fac.png"],
        "stars": 5,
        "description": "A production-ready AI-powered medication tracker built with a fine-tuned BERT model for medical Named Entity Recognition (NER). Extracts drug names, doses, frequencies, and times from natural language input. Features a FastAPI backend with PostgreSQL database, scheduled Telegram reminders, rate limiting, and a chat UI.",
        "tech": ["Python", "FastAPI", "BERT", "Medical NER", "HuggingFace Spaces", "PyTorch", "PostgreSQL", "Telegram Bot API", "Docker"],
        "github_url": "https://github.com/mido685/medical_assistance",
        "demo_url": "https://mido685.github.io/medical_assistance/",
        "problem": "Patients frequently forget medication schedules, and manually entering structured reminders (drug, dose, time) is tedious and error-prone, especially for elderly or chronically ill patients.",
        "solution": "A fine-tuned BERT NER model extracts medication details directly from natural language input, automatically scheduling Telegram reminders — no rigid forms required, just describe the medication in plain text.",
        "enterprise": [
            "Improves medication adherence for patients and care teams",
            "Scalable PostgreSQL backend supports multi-patient deployments",
            "Dockerized for easy integration into clinics or health-tech platforms",
        ],
    },
    {
        "slug": "smart-order-inventory",
        "title": "Smart Order — AI Inventory Optimization",
        "image_url": "/manus-storage/stark-ai-project3_eb8160c8.png",
        "images": ["/manus-storage/stark-ai-project3_eb8160c8.png"],
        "stars": 5,
        "description": "A production-ready AI-powered inventory management system that predicts optimal order quantities using a machine learning model trained on consumption patterns and cost data. Features a Next.js frontend with real-time form validation, a FastAPI backend deployed on HuggingFace Spaces, and a secure Next.js API proxy layer.",
        "tech": ["Python", "FastAPI", "Machine Learning", "Next.js", "TypeScript", "HuggingFace Spaces", "Tailwind CSS", "REST API", "Vercel"],
        "github_url": "https://github.com/mido685/Stark",
        "demo_url": "https://stark-git-main-starks-projects-09de8919.vercel.app/",
        "problem": "Businesses often over-order or under-order inventory due to guesswork, leading to wasted capital tied up in excess stock or lost sales from stockouts.",
        "solution": "A machine learning model trained on historical consumption patterns and cost data predicts optimal order quantities, surfaced through a real-time Next.js interface backed by a secure API proxy layer.",
        "enterprise": [
            "Reduces excess inventory costs and stockout risk",
            "Real-time predictions via a production FastAPI + Next.js stack",
            "Deployed on Vercel + HuggingFace Spaces for enterprise scalability",
        ],
    },
]

def seed():
    for p in projects_data:
        result = insert_project(**p)
        if result:
            print(f"✅ Inserted: {p['slug']}")
        else:
            print(f"⏭️  Skipped (already exists): {p['slug']}")

if __name__ == "__main__":
    seed()