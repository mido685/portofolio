import { MessagesSquare } from "lucide-react";
import SolutionPage from "./SolutionPage";

export default function AiConsulting() {
  return (
    <SolutionPage
      tagline="AI Consulting"
      title="AI & NLP Consulting"
      description="Applied AI/NLP system design for teams that need more than a prototype: architecture reviews, model-serving strategy, backend decisions, and practical guidance for domain-specific language systems."
      stack={["NLP", "FastAPI", "Model Deployment", "System Design", "Product Discovery"]}
      features={[
        "Architecture reviews for custom NLP and transformer-based systems",
        "Guidance on multi-tenant SaaS, ERP workflows, and backend data boundaries",
        "Deployment strategy for moving models, APIs, and frontends into production",
        "Hands-on support for teams building domain-specific AI applications",
        "Clear recommendations on what should use AI, what should stay deterministic, and what needs measurement first",
      ]}
      process={[
        {
          title: "Diagnose",
          description:
            "Clarify the business workflow, current bottleneck, available data, user roles, and failure cost.",
        },
        {
          title: "Design",
          description:
            "Choose the right model/API/backend shape and define evaluation criteria before implementation.",
        },
        {
          title: "Ship",
          description:
            "Turn the plan into a working service, demo, or technical roadmap with concrete next steps.",
        },
      ]}
      highlightCard={{
        icon: MessagesSquare,
        heading: "Practical AI guidance",
        text: "The goal is not to add AI everywhere. The goal is to use it where it creates measurable leverage.",
      }}
      highlights={[
        { value: "NLP", label: "Primary focus" },
        { value: "API-first", label: "Delivery style" },
        { value: "Product", label: "Decision lens" },
        { value: "Remote", label: "Collaboration" },
      ]}
    />
  );
}
