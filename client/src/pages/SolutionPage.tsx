import { CheckCircle2, LucideIcon } from "lucide-react";
import CtaSection from "@/components/CtaSection";

interface ProcessStep {
  title: string;
  description: string;
}

interface HighlightCard {
  icon: LucideIcon;
  heading: string;
  text: string;
}

interface SolutionPageProps {
  tagline?: string;
  title: string;
  description: string;
  stack?: string[];
  features: string[]; // rendered as the "Benefits" checklist
  process?: ProcessStep[];
  highlightCard?: HighlightCard;
  highlights?: { label: string; value: string }[]; // "Highlights" stat bar
}

export default function SolutionPage({
  tagline,
  title,
  description,
  stack,
  features,
  process,
  highlightCard,
  highlights,
}: SolutionPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl text-center">
        {tagline && (
          <span className="inline-block text-xs font-mono-data font-medium tracking-[0.2em] uppercase text-primary bg-secondary border border-border rounded-full px-4 py-1.5">
            {tagline}
          </span>
        )}
        <h1 className="mt-6 font-display text-3xl md:text-5xl font-bold leading-tight text-foreground">
          {title}
        </h1>
        <p className="mt-6 text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>

        {stack && stack.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {stack.map((tech, i) => (
              <span
                key={i}
                className="text-xs font-mono-data px-3 py-1.5 rounded-full border border-border text-muted-foreground bg-card"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Benefits + Process (left) / Highlight card (right) */}
      <div className="container mx-auto px-4 max-w-5xl grid lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
        <div>
          {/* Benefits checklist */}
          <h2 className="font-display text-xl font-bold text-foreground">
            Benefits
          </h2>
          <ul className="mt-5 space-y-3">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-foreground/90">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Work process */}
          {process && process.length > 0 && (
            <>
              <h2 className="mt-12 font-display text-xl font-bold text-foreground">
                How it's built
              </h2>
              <div className="mt-5 grid sm:grid-cols-3 gap-4">
                {process.map((step, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-xl p-5"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center font-mono-data text-sm text-primary">
                      {i + 1}
                    </div>
                    <h3 className="mt-4 font-display font-semibold text-foreground text-sm">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Highlight card */}
        {highlightCard && (
          <div className="relative overflow-hidden bg-card border border-border rounded-2xl p-8 text-center lg:sticky lg:top-24">
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary border border-border flex items-center justify-center">
              <highlightCard.icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-foreground">
              {highlightCard.heading}
            </h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {highlightCard.text}
            </p>
          </div>
        )}
      </div>

      {/* Highlights — real facts, not invented metrics */}
      {highlights && highlights.length > 0 && (
        <div className="container mx-auto px-4 max-w-5xl mt-14">
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="font-display text-xl font-bold text-foreground">
              Highlights
            </h2>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {highlights.map((h, i) => (
                <div key={i}>
                  <div className="font-display text-2xl font-bold text-primary">
                    {h.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {h.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-20">
        <CtaSection />
      </div>
    </div>
  );
}