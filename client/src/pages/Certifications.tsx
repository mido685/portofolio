import { useEffect, useMemo, useState } from "react";
import { Award, BookOpen, CalendarDays, ExternalLink, FileBadge2, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { CertificationPayload, listCertifications } from "@/lib/adminApi";

function formatDate(value: string | null) {
  if (!value) return "Date not specified";
  const parsed = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(parsed.getTime())
    ? value
    : new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(parsed);
}

function CredentialCard({
  item,
  onView,
}: {
  item: CertificationPayload;
  onView: (item: CertificationPayload) => void;
}) {
  const Icon = item.category === "course" ? BookOpen : Award;

  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
          <Icon size={21} />
        </div>
        <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-mono-data uppercase tracking-wider text-primary">
          {item.category === "course" ? "Training & course" : "Certification"}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-foreground">{item.title}</h3>
      <p className="mt-1 text-sm text-primary">{item.issuer}</p>
      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <CalendarDays size={14} />
        {formatDate(item.issue_date)}
      </p>
      {item.credential_id && (
        <p className="mt-2 break-all text-xs text-muted-foreground">
          Credential ID: <span className="font-mono-data">{item.credential_id}</span>
        </p>
      )}
      {item.description && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.description}</p>}

      {(item.file_url || item.credential_url) && (
        <div className="mt-auto pt-6">
          {item.file_url ? (
            <Button type="button" variant="secondary" onClick={() => onView(item)}>
              <FileBadge2 size={16} />
              View {item.category === "course" ? "document" : "certificate"}
            </Button>
          ) : (
            <Button type="button" variant="secondary" asChild>
              <a href={item.credential_url!} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} />
                Verify credential
              </a>
            </Button>
          )}
        </div>
      )}
    </article>
  );
}

export default function Certifications() {
  const [items, setItems] = useState<CertificationPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<CertificationPayload | null>(null);

  useEffect(() => {
    listCertifications()
      .then(setItems)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load credentials."))
      .finally(() => setLoading(false));
  }, []);

  const certifications = useMemo(() => items.filter((item) => item.category === "certification"), [items]);
  const courses = useMemo(() => items.filter((item) => item.category === "course"), [items]);
  const isPdf = selected?.file_url ? /\.pdf(?:$|[?#])/i.test(selected.file_url) : false;

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-foreground">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-4 pb-20 pt-28">
        <header className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
            <Award size={28} />
          </div>
          <p className="mt-6 text-xs font-mono-data uppercase tracking-[0.28em] text-primary">Professional development</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl">Certifications & Training</h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Verified credentials alongside the courses and training that support my work in AI, data, and software engineering.
          </p>
        </header>

        {loading ? (
          <div className="mt-16 flex items-center justify-center gap-3 text-primary">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading credentials…</span>
          </div>
        ) : error ? (
          <div className="mx-auto mt-12 max-w-2xl rounded-lg border border-destructive/40 bg-card p-5 text-sm text-destructive">{error}</div>
        ) : items.length === 0 ? (
          <div className="mx-auto mt-14 max-w-2xl rounded-xl border border-border bg-card/60 p-8 text-center">
            <ShieldCheck className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-4 font-medium">Credentials are being added.</p>
            <p className="mt-2 text-sm text-muted-foreground">Published certifications and training will appear here.</p>
          </div>
        ) : (
          <div className="mt-16 space-y-16">
            {certifications.length > 0 && (
              <section>
                <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <p className="text-xs font-mono-data uppercase tracking-[0.2em] text-primary">Verified credentials</p>
                    <h2 className="mt-2 font-display text-2xl font-bold">Certifications</h2>
                  </div>
                  <span className="text-sm text-muted-foreground">{certifications.length} credential{certifications.length === 1 ? "" : "s"}</span>
                </div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {certifications.map((item) => <CredentialCard key={item.id} item={item} onView={setSelected} />)}
                </div>
              </section>
            )}
            {courses.length > 0 && (
              <section>
                <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <p className="text-xs font-mono-data uppercase tracking-[0.2em] text-primary">Ongoing learning</p>
                    <h2 className="mt-2 font-display text-2xl font-bold">Training & Courses</h2>
                  </div>
                  <span className="text-sm text-muted-foreground">{courses.length} course{courses.length === 1 ? "" : "s"}</span>
                </div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {courses.map((item) => <CredentialCard key={item.id} item={item} onView={setSelected} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
      <Footer />

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] w-[min(1100px,calc(100%-2rem))] max-w-5xl overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>{selected.issuer} · {formatDate(selected.issue_date)}</DialogDescription>
              </DialogHeader>
              {isPdf ? (
                <iframe title={`${selected.title} document`} src={selected.file_url!} className="h-[70vh] w-full rounded-md border border-border" />
              ) : (
                <img src={selected.file_url!} alt={`${selected.title} certificate`} className="mx-auto max-h-[70vh] max-w-full rounded-md object-contain" />
              )}
              {selected.credential_url && (
                <a href={selected.credential_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                  Verify with issuer <ExternalLink size={14} />
                </a>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
