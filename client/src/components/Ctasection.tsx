import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-background">
      <div className="container mx-auto px-4 py-20 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
        {/* Text + buttons */}
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Ready to build something{" "}
            <span className="text-primary">real</span>?
          </h2>
          <p className="mt-5 text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl">
            Every project here is live and demoable — reach out to talk through
            what you're building, or take a look at the rest of the work.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="mailto:mohamedstark874@gmail.com"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
            >
              Get in touch
              <ArrowRight size={16} />
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 border border-border text-foreground font-medium px-6 py-3 rounded-md hover:bg-secondary transition-colors"
            >
              Back to projects
            </Link>
          </div>
        </div>

        {/* Decorative abstract chart accent — visual only, no claimed data */}
        <div className="relative h-48 md:h-56">
          <svg
            viewBox="0 0 320 200"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* baseline grid */}
            <line x1="0" y1="170" x2="320" y2="170" stroke="var(--border)" strokeWidth="1" />
            <line x1="0" y1="120" x2="320" y2="120" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
            <line x1="0" y1="70" x2="320" y2="70" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

            {/* bars */}
            <rect x="20" y="130" width="24" height="40" rx="3" fill="var(--primary)" opacity="0.35" />
            <rect x="60" y="100" width="24" height="70" rx="3" fill="var(--primary)" opacity="0.5" />
            <rect x="100" y="60" width="24" height="110" rx="3" fill="var(--primary)" opacity="0.7" />
            <rect x="140" y="90" width="24" height="80" rx="3" fill="var(--primary)" opacity="0.5" />
            <rect x="180" y="40" width="24" height="130" rx="3" fill="var(--primary)" opacity="0.85" />
            <rect x="220" y="75" width="24" height="95" rx="3" fill="var(--primary)" opacity="0.55" />
            <rect x="260" y="25" width="24" height="145" rx="3" fill="var(--primary)" opacity="1" />

            {/* trend line over the bars */}
            <polyline
              points="32,150 72,110 112,80 152,105 192,60 232,95 272,45"
              stroke="var(--foreground)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
            {[
              [32, 150], [72, 110], [112, 80], [152, 105],
              [192, 60], [232, 95], [272, 45],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="3.5" fill="var(--foreground)" opacity="0.8" />
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}