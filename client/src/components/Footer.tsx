import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import { Link } from "wouter";

const footerLinks = {
  caseStudies: [
    { label: "Medical Tokenizer", href: "/projects/stark-medical-tokenizer" },
    { label: "Medical Reminder", href: "/projects/stark-medical-assistance-reminder" },
    { label: "Smart Order AI", href: "/projects/smart-order-inventory" },
  ],
  navigation: [
    { label: "About", href: "#about" },
    { label: "Projects", href: "/projects" },
    { label: "Skills", href: "#technologies" },
    { label: "Certifications", href: "/certifications" },
    { label: "Architecture", href: "#architecture" },
    { label: "Now", href: "#now" },
    { label: "Contact", href: "#contact" },
  ],
  solutions: [
    { label: "NLP & Transformers", href: "/nlp-transformers" },
    { label: "Enterprise SaaS & ERP", href: "/enterprise-saas-erp" },
    { label: "Medical AI Systems", href: "/medical-ai-systems" },
    { label: "Backend Engineering", href: "/backend-engineering" },
    { label: "Model Deployment", href: "/model-deployment" },
    { label: "AI Consulting", href: "/ai-consulting" },
  ],
};

export default function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const year = new Date().getFullYear();

  return (
    <footer className="bg-background text-foreground relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container relative z-10 py-16">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] gap-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9">
                <img src="/new_logo.png" alt="STARK AI logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">
                STARK<span className="text-primary">AI</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              AI engineering portfolio by Mohamed Ibrahim. Built around medical NLP, model APIs,
              backend systems, and production-minded product delivery.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { href: "mailto:mohamedstark874@gmail.com", icon: Mail, label: "Email" },
                { href: "https://github.com/mido685", icon: Github, label: "GitHub" },
                {
                  href: "https://www.linkedin.com/in/mohamed-ibrahim-967831187",
                  icon: Linkedin,
                  label: "LinkedIn",
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={item.label}
                  className="w-9 h-9 rounded-lg border border-border bg-card text-primary flex items-center justify-center hover:border-primary transition-colors"
                >
                  <item.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "Case Studies", links: footerLinks.caseStudies },
            { title: "Solutions", links: footerLinks.solutions },
            { title: "Navigate", links: footerLinks.navigation },
          ].map((group) => (
            <div key={group.title}>
              <h4 className="font-display font-semibold text-[10px] uppercase tracking-[0.25em] mb-4 text-primary">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("/") ? (
                      <Link
                        href={link.href}
                        className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {[
            { label: "Current stack", value: "React, TypeScript, FastAPI, PostgreSQL, PyTorch" },
            { label: "Status", value: "Currently building AI systems" },
            { label: "Location", value: "Cairo, Egypt / Remote" },
          ].map((item) => (
            <div key={item.label} className="bg-card border border-border rounded-lg p-4">
              <p className="text-primary text-[10px] font-mono-data uppercase tracking-wider">
                {item.label}
              </p>
              <p className="text-muted-foreground text-sm mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground/60 text-[11px] font-mono-data">
            Version 2.0 - Last updated August 2026 - Copyright {year} STARK AI.
          </p>
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="inline-flex items-center gap-2 text-muted-foreground/70 text-[11px] hover:text-foreground transition-colors"
          >
            Back to top
            <ArrowUp size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
}
