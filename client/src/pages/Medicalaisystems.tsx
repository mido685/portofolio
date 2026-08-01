import { Stethoscope } from "lucide-react";
import SolutionPage from "./SolutionPage";

export default function MedicalAiSystems() {
  return (
    <SolutionPage
      tagline="Medical NLP & NER"
      title="Medical NLP & NER Systems"
      description="A fine-tuned NLP pipeline for clinical text — extracting medications, dosages, frequencies, and timing from unstructured medical language, backed by a custom domain-specific tokenizer built from scratch."
      stack={["BioBERT", "FastAPI", "PostgreSQL", "HuggingFace Spaces", "Telegram Bot API"]}
      features={[
        "Fine-tuned BioBERT model for medication entity extraction (DRUG, DOSE, FREQ, TIME)",
        "Custom WordPiece tokenizer — the \"Stark Medical Tokenizer\" — trained on medical text across 28 domains with a ~42K token vocabulary",
        "Programmatically generated 25K-row training dataset for the NER model",
        "Deployment stack: FastAPI backend, PostgreSQL, Telegram bot for medication reminders",
        "Deployed and demoable live on HuggingFace Spaces",
      ]}
      process={[
        {
          title: "Dataset generation",
          description:
            "Built a programmatically generated 25K-row dataset covering medication entity patterns.",
        },
        {
          title: "Custom tokenization",
          description:
            "Trained a domain-specific WordPiece tokenizer from scratch on medical text spanning 28 domains.",
        },
        {
          title: "Fine-tuning & deployment",
          description:
            "Fine-tuned BioBERT for medication, dosage, frequency, and timing extraction, then deployed to HuggingFace Spaces.",
        },
      ]}
      highlightCard={{
        icon: Stethoscope,
        heading: "Built from scratch",
        text: "A custom tokenizer and fine-tuned model, not a wrapper around an off-the-shelf API.",
      }}
      highlights={[
        { value: "~42K", label: "Tokenizer vocabulary" },
        { value: "28", label: "Medical text domains" },
        { value: "25K", label: "Training examples generated" },
        { value: "Live", label: "Deployed on HuggingFace Spaces" },
      ]}
    />
  );
}