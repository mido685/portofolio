import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { listTestimonials, submitFeedback, TestimonialPayload } from "@/lib/adminApi";

function initialsFor(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function StarRow({ rating }: { rating: number }) {
  const value = Math.max(0, Math.min(5, Math.round(rating)));
  return <div className="mt-2 flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} className={i < value ? "fill-[#f5c518] text-[#f5c518]" : "fill-transparent text-gray-600"} />)}
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

  useEffect(() => {
    listTestimonials().then(setTestimonials).catch(() => setTestimonials([]));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await submitFeedback({ name: name.trim(), role: role.trim() || null, quote: quote.trim(), rating });
      setName("");
      setRole("");
      setQuote("");
      setRating(5);
      setMessage("Thanks for sharing your feedback! It will appear here after approval.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not submit your feedback. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="testimonials" className="bg-[#0a0e1a] py-24">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-[#00d4aa] md:text-4xl">Feedback</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">Feedback shared by visitors and collaborators.</p>
        </motion.div>

        {testimonials.length > 0 ? <div className="mb-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => <motion.article key={item.id ?? `${item.name}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="rounded-lg border border-[#00d4aa]/20 bg-[#111827] p-6">
            <p className="text-sm italic leading-relaxed text-gray-300">&ldquo;{item.quote}&rdquo;</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00d4aa]/20 text-sm font-bold text-[#00d4aa]">{initialsFor(item.name)}</div>
              <div><p className="text-sm font-semibold text-[#00d4aa]">{item.name}</p><p className="text-xs text-gray-500">{item.role || ""}</p><StarRow rating={item.rating} /></div>
            </div>
          </motion.article>)}
        </div> : <p className="mb-12 text-center text-sm text-gray-500">No feedback has been approved yet. You can be the first to share yours.</p>}

        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl rounded-lg border border-[#00d4aa]/20 bg-[#111827] p-6 md:p-8">
          <h3 className="text-xl font-semibold text-white">Share your feedback</h3>
          <p className="mt-2 text-sm text-gray-400">Your feedback will be reviewed before it appears publicly.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-gray-200">Name<input required maxLength={120} value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-white/10 bg-[#0a0e1a] px-3 py-2 text-white outline-none focus:border-[#00d4aa]" /></label>
            <label className="space-y-2 text-sm text-gray-200">Role or company <span className="text-gray-500">(optional)</span><input maxLength={160} value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-md border border-white/10 bg-[#0a0e1a] px-3 py-2 text-white outline-none focus:border-[#00d4aa]" /></label>
          </div>
          <label className="mt-4 block space-y-2 text-sm text-gray-200">Your feedback<textarea required maxLength={2000} rows={4} value={quote} onChange={(e) => setQuote(e.target.value)} className="w-full resize-y rounded-md border border-white/10 bg-[#0a0e1a] px-3 py-2 text-white outline-none focus:border-[#00d4aa]" /></label>
          <label className="mt-4 flex items-center gap-3 text-sm text-gray-200">Rating<select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="rounded-md border border-white/10 bg-[#0a0e1a] px-3 py-2 text-white">{[5, 4, 3, 2, 1, 0].map((value) => <option key={value} value={value}>{value ? `${value} stars` : "No rating"}</option>)}</select></label>
          <div className="mt-5 flex flex-wrap items-center gap-4"><button type="submit" disabled={busy} className="rounded-md bg-[#00d4aa] px-5 py-2.5 text-sm font-semibold text-[#06111a] disabled:cursor-not-allowed disabled:opacity-60">{busy ? "Submitting…" : "Submit feedback"}</button>{message && <p role="status" className="text-sm text-gray-300">{message}</p>}</div>
        </form>
      </div>
    </section>
  );
}
