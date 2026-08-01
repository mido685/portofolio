import { Rocket } from "lucide-react";
import SolutionPage from "./SolutionPage";

export default function ModelDeployment() {
  return (
    <SolutionPage
      tagline="Model Deployment"
      title="Taking Models from Notebook to Production"
      description="Deploying trained models as real, usable services — not just notebooks. From a demand-forecasting ML API to a full medical NLP pipeline, each project ships with a live endpoint people can actually call."
      stack={["FastAPI", "HuggingFace Spaces", "PostgreSQL", "Vercel"]}
      features={[
        "Smart Ordering — a linear regression demand-forecasting model deployed as an API on HuggingFace Spaces, with a Vercel-hosted frontend",
        "Medical NER system — fine-tuned BioBERT model deployed on HuggingFace Spaces with a FastAPI backend and PostgreSQL",
        "Custom-trained tokenizer (Stark Medical Tokenizer) packaged and deployed alongside its model",
      ]}
      process={[
        {
          title: "Train and validate",
          description:
            "Models are trained and evaluated locally before being wrapped in a serving layer.",
        },
        {
          title: "Wrap in an API",
          description:
            "Every model gets a FastAPI service in front of it, callable like any other production endpoint.",
        },
        {
          title: "Ship a live demo",
          description:
            "Deployed to HuggingFace Spaces (and Vercel for frontends) so it's something a visitor can actually try.",
        },
      ]}
      highlightCard={{
        icon: Rocket,
        heading: "Shipped, not just trained",
        text: "Every model here has a live endpoint — nothing stays stuck in a notebook.",
      }}
      highlights={[
        { value: "2", label: "Models live on HuggingFace Spaces" },
        { value: "FastAPI", label: "Serving layer for every model" },
        { value: "Live demos", label: "Not just notebooks" },
      ]}
    />
  );
}