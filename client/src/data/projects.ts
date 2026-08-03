export interface Project {
  slug: string;
  title: string;
  image: string;
  images?: string[];
  stars: number;
  description: string;
  tech: string[];
  github: string;
  demo: string;
  problem: string;
  solution: string;
  enterprise: string[];
}

export const projects: Project[] = [
  {
    slug: "stark-medical-tokenizer",
    title: "Stark Medical Tokenizer",
    image: "/manus-storage/stark-ai-project1_cc91db65.png",
    images: ["/manus-storage/stark-ai-project1_cc91db65.png"],
    stars: 5,
    description:
      "A WordPiece tokenizer built from scratch for medical NLP - the same algorithm family used in BERT and BioBERT. Features a HuggingFace-compatible API, medical text preprocessing across 28 clinical domains, subword vocabulary learning, and a live FastAPI demo.",
    tech: ["Python", "FastAPI", "WordPiece", "Medical NLP", "HuggingFace Spaces", "PyTorch"],
    github: "https://github.com/mido685/stark_tokenizer",
    demo: "https://mido685.github.io/stark_tokenizer/",
    problem:
      "Generic tokenizers split medical terminology poorly, breaking drug names, dosages, and clinical abbreviations into meaningless fragments. That weakens downstream NLP accuracy on medical text.",
    solution:
      "Built a domain-specific WordPiece tokenizer trained on clinical vocabulary across 28 medical domains, preserving medical terms and supporting NER/classification workflows.",
    enterprise: [
      "Reduces preprocessing errors in medical NLP pipelines",
      "HuggingFace-compatible API fits existing BERT/BioBERT workflows",
      "Deployable as a standalone tokenizer service for clinical data teams",
    ],
  },
  {
    slug: "stark-medical-assistance-reminder",
    title: "Stark Medical Assistance Reminder",
    image: "/manus-storage/stark-ai-project2_9f7c4fac.png",
    images: ["/manus-storage/stark-ai-project2_9f7c4fac.png"],
    stars: 5,
    description:
      "A production-ready AI medication tracker built with a fine-tuned BERT model for medical Named Entity Recognition. It extracts drug names, doses, frequencies, and times from natural language, then schedules Telegram reminders.",
    tech: [
      "Python",
      "FastAPI",
      "BERT",
      "Medical NER",
      "PostgreSQL",
      "Telegram Bot API",
      "Docker",
    ],
    github: "https://github.com/mido685/medical_assistance",
    demo: "https://mido685.github.io/medical_assistance/",
    problem:
      "Patients often forget medication schedules, and manually entering structured reminders is slow and error-prone, especially for elderly or chronically ill patients.",
    solution:
      "A fine-tuned BERT NER model extracts medication details directly from plain language and schedules reminders without forcing users through rigid forms.",
    enterprise: [
      "Improves medication adherence for patients and care teams",
      "PostgreSQL backend supports multi-patient deployments",
      "Dockerized and API-driven for health-tech integration",
    ],
  },
  {
    slug: "smart-order-inventory",
    title: "Smart Order - AI Inventory Optimization",
    image: "/manus-storage/stark-ai-project3_eb8160c8.png",
    images: ["/manus-storage/stark-ai-project3_eb8160c8.png"],
    stars: 5,
    description:
      "An AI inventory management system that predicts optimal order quantities from consumption patterns and cost data. It pairs a FastAPI model backend with a TypeScript frontend and secure API proxy layer.",
    tech: ["Python", "FastAPI", "Machine Learning", "Next.js", "TypeScript", "REST API", "Vercel"],
    github: "https://github.com/mido685/Stark",
    demo: "https://stark-git-main-starks-projects-09de8919.vercel.app/",
    problem:
      "Businesses over-order or under-order inventory because purchasing decisions are often based on guesswork, creating excess stock costs or stockout risk.",
    solution:
      "A machine learning model predicts optimal order quantities from historical consumption and cost signals, exposed through a real-time web interface and API layer.",
    enterprise: [
      "Reduces excess inventory costs and stockout risk",
      "Real-time predictions via FastAPI and a production frontend",
      "Designed for Vercel + HuggingFace deployment scalability",
    ],
  },
];
