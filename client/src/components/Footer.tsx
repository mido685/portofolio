/**
 * Footer — STARK AI portfolio footer
 */
import { Mail } from "lucide-react";
import { Link } from "wouter";

const footerLinks = {
  solutions: [
    { label: "NLP & Transformers", href: "/nlp-transformers" },
    { label: "Enterprise SaaS & ERP", href: "/enterprise-saas-erp" },
    { label: "Medical AI Systems", href: "/medical-ai-systems" },
    { label: "Backend Engineering", href: "/backend-engineering" },
    { label: "Model Deployment", href: "/model-deployment" },
    { label: "AI Consulting", href: "/ai-consulting" },
  ],
  company: [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Technologies", href: "#technologies" },
    { label: "Architecture", href: "#architecture" },
    { label: "Blog", href: "#blog" },
    { label: "Careers", href: "/careers" },
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

  return (
    <footer className="bg-background text-foreground relative overflow-hidden">
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container relative z-10 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9">
                <img
                  src="/new_logo.png"
                  alt="STARK AI logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">
                STARK<span className="text-primary">AI</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              NLP/AI engineering practice building custom transformer
              architectures, medical NLP systems, and enterprise SaaS platforms.
            </p>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Mail size={14} className="text-primary" />
              <a
                href="mailto:mohamedstark874@gmail.com"
                className="hover:text-foreground transition-colors"
              >
                mohamedstark874@gmail.com
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-display font-semibold text-[10px] uppercase tracking-[0.25em] mb-4 text-primary">
              Solutions
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.solutions.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-[10px] uppercase tracking-[0.25em] mb-4 text-primary">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
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
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground/60 text-[11px] font-mono-data">
            &copy; {new Date().getFullYear()} STARK AI. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6">
            <a
              href="https://github.com/mido685"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/60 text-[11px] hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://huggingface.co/mohamed1357"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/60 text-[11px] hover:text-foreground transition-colors"
            >
              HuggingFace
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}