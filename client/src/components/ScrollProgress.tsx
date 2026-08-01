/**
 * Scroll Progress Bar — Thin horizontal bar at top showing page position
 */
import { useState, useEffect } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const pct = totalHeight > 0 ? (scrolled / totalHeight) * 100 : 0;
      setProgress(pct);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-[oklch(0.65_0.12_60)]/0">
      <div
        className="h-full bg-[oklch(0.65_0.12_60)] transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
