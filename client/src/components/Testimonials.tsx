import { motion } from "framer-motion";
import { MessageSquareQuote, Send, ShieldCheck, Star } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { listTestimonials, submitFeedback, TestimonialPayload } from "@/lib/adminApi";

function initialsFor(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function StarRow({ rating }: { rating: number }) {
  const value = Math.max(0, Math.min(5, Math.round(rating)));
  return <div className="mt-3 flex items-center gap-1" aria-label={value ? `${value} out of 5 stars` : "No rating"}>
    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className={i < value ? "fill-amber-400 text-amber-400" : "fill-transparent text-slate-600"} />)}
  </div>;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialPayload[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);

  useEffect(() => {
    listTestimonials().then(setTestimonials).catch(() => setTestimonials([]));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setMessageIsError(false);
    try {
      await submitFeedback({ name: name.trim(), role: role.trim() || null, quote: quote.trim(), rating });
      setName("");
      setRole("");
      setQuote("");
      setRating(5);
      setMessage("Thanks for sharing. Your feedback is now awaiting review.");
    } catch (error) {
      setMessageIsError(true);
      setMessage(error instanceof Error ? error.message : "Could not submit your feedback. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="feedback" className="relative overflow-hidden bg-[#0a0e1a] px-4 py-20 sm:px-6 lg:py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-[#00d4aa]/[0.06] blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mb-10 border-b border-white/[0.08] pb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#00d4aa]">STARK AI · COMMUNITY</p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Feedback</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">Read what visitors and collaborators have shared, or leave a note about your experience.</p>
        </motion.header>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
          <section aria-labelledby="published-feedback-title" className="min-w-0">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 id="published-feedback-title" className="text-xl font-semibold text-white">Community feedback</h2>
                <p className="mt-1 text-sm text-slate-500">Only approved feedback is published.</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-400">{testimonials.length} {testimonials.length === 1 ? "post" : "posts"}</span>
            </div>

            {testimonials.length > 0 ? <div className="space-y-4">
              {testimonials.map((item, i) => <motion.article key={item.id ?? `${item.name}-${i}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.3) }} className="rounded-xl border border-white/[0.08] bg-[#111827]/90 p-5 shadow-lg shadow-black/10 sm:p-6">
                <MessageSquareQuote size={19} className="mb-4 text-[#00d4aa]" />
                <p className="whitespace-pre-wrap break-words text-[15px] leading-7 text-slate-200">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3 border-t border-white/[0.07] pt-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#00d4aa]/20 bg-[#00d4aa]/10 text-sm font-semibold text-[#00d4aa]">{initialsFor(item.name)}</div>
                  <div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{item.name}</p><p className="truncate text-xs text-slate-500">{item.role || "Visitor"}</p></div>
                  <div className="ml-auto shrink-0"><StarRow rating={item.rating} /></div>
                </div>
              </motion.article>)}
            </div> : <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]"><MessageSquareQuote size={20} className="text-slate-500" /></div>
              <h3 className="mt-4 font-medium text-slate-200">No published feedback yet</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">When feedback is approved, it will be shared here. You can be the first to leave a note.</p>
            </div>}
          </section>

          <form onSubmit={handleSubmit} className="rounded-xl border border-[#00d4aa]/20 bg-gradient-to-b from-[#111b29] to-[#0e1522] p-5 shadow-xl shadow-black/20 sm:p-7">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#00d4aa]/20 bg-[#00d4aa]/10 text-[#00d4aa]"><Send size={17} /></div>
              <div><h2 className="text-xl font-semibold text-white">Leave feedback</h2><p className="mt-1 text-sm leading-5 text-slate-400">Your note is reviewed before it appears publicly.</p></div>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-slate-200">Name
                <input required maxLength={120} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-[#090f19] px-3.5 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-[#00d4aa]/60 focus:ring-2 focus:ring-[#00d4aa]/10" />
              </label>
              <label className="block text-sm font-medium text-slate-200">Role or company <span className="font-normal text-slate-500">· optional</span>
                <input maxLength={160} autoComplete="organization-title" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Project collaborator" className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-[#090f19] px-3.5 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-[#00d4aa]/60 focus:ring-2 focus:ring-[#00d4aa]/10" />
              </label>
              <label className="block text-sm font-medium text-slate-200">Your message
                <textarea required maxLength={2000} rows={5} value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Share a few words about your experience…" className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-[#090f19] px-3.5 py-3 text-sm leading-6 text-white placeholder:text-slate-600 outline-none transition focus:border-[#00d4aa]/60 focus:ring-2 focus:ring-[#00d4aa]/10" />
                <span className="mt-1 block text-right text-xs text-slate-600">{quote.length}/2000</span>
              </label>

              <fieldset>
                <legend className="text-sm font-medium text-slate-200">Rating <span className="font-normal text-slate-500">· optional</span></legend>
                <div className="mt-2 flex items-center gap-1" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" role="radio" aria-checked={rating === value} aria-label={`${value} star${value === 1 ? "" : "s"}`} onClick={() => setRating(value)} className="rounded p-1 transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa]"><Star size={22} className={value <= rating ? "fill-amber-400 text-amber-400" : "text-slate-600"} /></button>)}
                  <button type="button" onClick={() => setRating(0)} className="ml-2 rounded px-2 py-1 text-xs text-slate-500 transition hover:text-white">Clear</button>
                </div>
              </fieldset>
            </div>

            <div className="mt-6 border-t border-white/[0.08] pt-5">
              <div className="mb-4 flex items-start gap-2 text-xs leading-5 text-slate-500"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#00d4aa]/80" /><p>Feedback is reviewed before publication. Please don’t include private or sensitive information.</p></div>
              <button type="submit" disabled={busy} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#00d4aa] px-5 text-sm font-semibold text-[#06111a] transition hover:bg-[#20e2bb] disabled:cursor-not-allowed disabled:opacity-60">{busy ? "Submitting…" : <><Send size={15} /> Submit feedback</>}</button>
              {message && <p role="status" className={`mt-3 rounded-lg border px-3 py-2.5 text-sm ${messageIsError ? "border-red-400/20 bg-red-400/5 text-red-300" : "border-[#00d4aa]/20 bg-[#00d4aa]/5 text-[#80ead5]"}`}>{message}</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
