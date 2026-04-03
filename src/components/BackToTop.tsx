import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 lg:bottom-6 right-4 z-40 w-10 h-10 rounded-full bg-[#111e16] border border-primary/30 flex items-center justify-center text-primary hover:bg-[#172518] transition-all shadow-lg animate-in slide-in-from-bottom-4 fade-in"
      aria-label="Back to top"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}
