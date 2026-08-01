import { Brain } from "lucide-react";
import SolutionPage from "./SolutionPage";

export default function NlpTransformers() {
  return (
    <SolutionPage
      tagline="AI Research"
      title="Custom Transformer Architecture"
      description="A transformer encoder built from first principles in PyTorch — embeddings, positional encoding, and multi-head attention implemented step by step — applied to medical and clinical NLP tasks."
      stack={["PyTorch", "Python"]}
      features={[
        "Custom PyTorch transformer encoder, built step-by-step through multi-head attention",
        "Hands-on implementation of positional encoding, token embeddings, and the attention mechanism from scratch",
        "Applied to a BioBERT-style medical/clinical NER task, recognizing DRUG, DOSE, FREQ, and TIME entities",
      ]}
      process={[
        {
          title: "Embeddings & positional encoding",
          description:
            "Implemented token embeddings and positional encoding to give the model a sense of sequence and word meaning.",
        },
        {
          title: "Multi-head attention",
          description:
            "Built the multi-head attention mechanism step by step to understand how the model learns relationships between tokens.",
        },
        {
          title: "Applied to clinical NER",
          description:
            "Directed the resulting encoder toward a medical NER use case — drug, dosage, frequency, and timing entities.",
        },
      ]}
      highlightCard={{
        icon: Brain,
        heading: "From first principles",
        text: "No pretrained transformer wrapper — every component built and understood from scratch.",
      }}
      highlights={[
        { value: "From scratch", label: "No pretrained wrapper" },
        { value: "PyTorch", label: "Core framework" },
        { value: "Clinical NER", label: "Applied use case" },
      ]}
    />
  );
}