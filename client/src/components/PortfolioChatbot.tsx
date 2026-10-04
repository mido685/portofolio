import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, BriefcaseBusiness, ChevronDown, ExternalLink, FolderKanban, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useLocation } from "wouter";

type ChatMessage = {
  id: number;
  from: "assistant" | "visitor";
  text: string;
  link?: { label: string; href: string };
};

const quickPrompts = [
  { label: "View projects", icon: FolderKanban, text: "What projects has Mohamed built?" },
  { label: "Hire / collaborate", icon: BriefcaseBusiness, text: "How can I hire or collaborate?" },
  { label: "Leave feedback", icon: MessageCircle, text: "I want to leave feedback" },
];

function answerFor(input: string): Omit<ChatMessage, "id" | "from"> {
  const message = input.toLowerCase();
  if (/project|portfolio|case stud|built|work/.test(message)) {
    return { text: "Mohamed builds AI and backend products, including medical NLP tools, inventory systems, and SaaS platforms. Browse the project case studies here.", link: { label: "Explore projects", href: "/projects" } };
  }
  if (/skill|technology|tech stack|language|python|backend|ai engineer/.test(message)) {
    return { text: "His work spans applied AI and NLP, Python backend development, APIs, databases, and production deployment. The project pages include the technologies used in each case study.", link: { label: "View projects", href: "/projects" } };
  }
  if (/feedback|review|testimonial/.test(message)) {
    return { text: "You can share a note on the Feedback page. Submissions are reviewed before they appear publicly.", link: { label: "Leave feedback", href: "/feedback" } };
  }
  if (/hire|contact|collaborat|email|work together|resume/.test(message)) {
    return { text: "For hiring or collaboration, send Mohamed a message by email. Include the project, your timeline, and how to reach you.", link: { label: "Email Mohamed", href: "mailto:mohamedstark874@gmail.com?subject=Portfolio%20inquiry" } };
  }
  if (/certif|course|training/.test(message)) {
    return { text: "Certifications and training are collected on a dedicated page.", link: { label: "View certifications", href: "/certifications" } };
  }
  if (/hello|hi\b|hey\b|good morning|good evening/.test(message)) {
    return { text: "Hi! I can point you to Mohamed’s projects, skills, certifications, or contact details. What would you like to know?" };
  }
  return { text: "I can help you explore Mohamed’s projects, skills, certifications, or how to get in touch. Try one of the suggestions below, or leave a message for him directly.", link: { label: "Contact Mohamed", href: "mailto:mohamedstark874@gmail.com?subject=Portfolio%20inquiry" } };
}

export default function PortfolioChatbot() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, from: "assistant", text: "Hi there! I’m STARK’s portfolio assistant. Ask me about projects, skills, or working together." },
  ]);
  const messageEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open]);

  if (location === "/admin") return null;

  function sendMessage(text: string) {
    const cleaned = text.trim();
    if (!cleaned) return;
    const answer = answerFor(cleaned);
    setMessages((current) => [
      ...current,
      { id: Date.now(), from: "visitor", text: cleaned },
      { id: Date.now() + 1, from: "assistant", ...answer },
    ]);
    setDraft("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(draft);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && <section aria-label="STARK AI portfolio chat" className="flex h-[min(440px,calc(100dvh-6.5rem))] w-[min(340px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#00d4aa]/25 bg-[#0c1320] shadow-[0_20px_70px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.06]">
        <header className="flex items-center justify-between border-b border-white/[0.08] bg-[#101a28] px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#00d4aa]/30 bg-[#00d4aa]/10 text-[#00d4aa]"><Bot size={21} /><span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#101a28] bg-emerald-400" /></div>
            <div className="min-w-0"><h2 className="truncate text-sm font-semibold text-white">STARK AI Assistant</h2><p className="text-[11px] text-slate-400">Portfolio guide · usually replies instantly</p></div>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Minimize chat" className="rounded-md p-1.5 text-slate-400 transition hover:bg-white/[0.06] hover:text-white"><ChevronDown size={19} /></button>
        </header>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3.5 py-4">
          {messages.map((message) => <div key={message.id} className={`flex ${message.from === "visitor" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-5 ${message.from === "visitor" ? "rounded-br-md bg-[#00d4aa] text-[#06111a]" : "rounded-bl-md border border-white/[0.07] bg-[#151f2e] text-slate-200"}`}>
              <p>{message.text}</p>
              {message.link && <a href={message.link.href} className="mt-2 inline-flex items-center gap-1.5 font-semibold text-[#00d4aa] hover:text-[#76f2dc]">{message.link.label}<ExternalLink size={12} /></a>}
            </div>
          </div>)}
          <div ref={messageEnd} />
        </div>

        {messages.length < 3 && <div className="flex flex-wrap gap-2 px-3.5 pb-3">
          {quickPrompts.map(({ label, icon: Icon, text }) => <button key={label} type="button" onClick={() => sendMessage(text)} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-slate-300 transition hover:border-[#00d4aa]/40 hover:text-[#00d4aa]"><Icon size={12} />{label}</button>)}
        </div>}

        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-white/[0.08] bg-[#0a111c] p-3">
          <label className="sr-only" htmlFor="portfolio-chat-input">Ask a question</label>
          <input id="portfolio-chat-input" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask about the portfolio…" maxLength={500} className="h-10 min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-[#111a27] px-3 text-[13px] text-white outline-none placeholder:text-slate-500 focus:border-[#00d4aa]/50" />
          <button type="submit" disabled={!draft.trim()} aria-label="Send message" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00d4aa] text-[#06111a] transition hover:bg-[#45e7c8] disabled:cursor-not-allowed disabled:opacity-40"><Send size={16} /></button>
        </form>
        <p className="bg-[#0a111c] pb-2 text-center text-[10px] text-slate-600"><Sparkles size={10} className="mr-1 inline text-[#00d4aa]/70" />Portfolio info assistant</p>
      </section>}

      <button type="button" onClick={() => setOpen((current) => !current)} aria-label={open ? "Close chat" : "Open chat"} aria-expanded={open} className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-[#00d4aa]/50 bg-[#00d4aa] text-[#06111a] shadow-[0_8px_30px_rgba(0,212,170,0.24)] transition duration-200 hover:scale-105 hover:shadow-[0_8px_36px_rgba(0,212,170,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]">
        {open ? <X size={21} /> : <><MessageCircle size={23} /><span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#0a0e1a] bg-emerald-400" /></>}
        {!open && <span className="pointer-events-none absolute right-[calc(100%+0.7rem)] whitespace-nowrap rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-xs text-slate-200 opacity-0 shadow-lg transition group-hover:opacity-100">Questions? Chat with STARK</span>}
      </button>
    </div>
  );
}
