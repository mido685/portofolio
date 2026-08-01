import SolutionPage from "./SolutionPage";

export default function AiConsulting() {
  return (
    <SolutionPage
      title="AI & NLP Consulting"
      description="Guidance on applied AI/NLP system design — from transformer architecture decisions to production deployment strategy — for teams building domain-specific language models or enterprise data systems."
      features={[
        "Architecture reviews for custom NLP and transformer-based systems",
        "Guidance on multi-tenant SaaS and ERP system design",
        "Deployment strategy for moving models and backends into production",
        "Hands-on support for teams building domain-specific AI applications",
      ]}
    />
  );
}