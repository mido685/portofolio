import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, MessageSquare, Send } from "lucide-react";
import { Link, useParams } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArticlePayload,
  CommentPayload,
  getArticle,
  listArticleComments,
  submitArticleComment,
} from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticlePayload | null>(null);
  const [comments, setComments] = useState<CommentPayload[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    getArticle(slug)
      .then(setArticle)
      .catch(() => setArticle(null));
    listArticleComments(slug)
      .then(setComments)
      .catch(() => setComments([]));
  }, [slug]);

  async function submitComment(event: FormEvent) {
    event.preventDefault();
    if (!slug) return;
    setError("");
    setStatus("");
    try {
      await submitArticleComment(slug, {
        author_name: name.trim(),
        author_email: email.trim() || null,
        body: body.trim(),
      });
      setName("");
      setEmail("");
      setBody("");
      setStatus("Comment submitted for review.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit comment.");
    }
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="container mx-auto max-w-3xl px-4 py-24">
          <Link href="/#blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} />
            Back to articles
          </Link>
          <h1 className="mt-8 text-2xl font-bold">Article not found</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 pt-24 pb-16">
        <Link href="/#blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} />
          Back to articles
        </Link>

        <article className="mt-8">
          <span className="text-xs font-mono-data uppercase tracking-wider text-primary">
            {article.category}
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold md:text-5xl">{article.title}</h1>
          {article.excerpt && (
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{article.excerpt}</p>
          )}
          {article.cover_image_url && (
            <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card aspect-video">
              <img src={article.cover_image_url} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="prose prose-invert prose-neutral mt-10 max-w-none whitespace-pre-wrap leading-8 text-muted-foreground">
            {article.content || "This article is being drafted."}
          </div>
        </article>

        <section className="mt-14 border-t border-border pt-8">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-primary" />
            <h2 className="text-xl font-bold">Comments</h2>
          </div>

          <div className="mt-5 space-y-3">
            {comments.length === 0 && (
              <p className="text-sm text-muted-foreground">No approved comments yet.</p>
            )}
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-lg border border-border bg-card p-4">
                <p className="font-medium">{comment.author_name}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {comment.body}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={submitComment} className="mt-8 rounded-lg border border-border bg-card p-5">
            <h3 className="text-base font-semibold">Leave a comment</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" required />
              <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email optional" />
            </div>
            <Textarea
              className="mt-4"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Your comment"
              rows={5}
              required
            />
            {(status || error) && (
              <p className={`mt-3 text-sm ${error ? "text-destructive" : "text-primary"}`}>
                {error || status}
              </p>
            )}
            <Button type="submit" className="mt-4">
              <Send size={16} />
              Submit for Review
            </Button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
