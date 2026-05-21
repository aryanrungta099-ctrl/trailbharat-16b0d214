import { useEffect, useState } from "react";

interface Section {
  id: string;
  label: string;
}

// COMPONENT: sticky-reading-nav — reading progress bar + section chips
export default function StickyReadingNav({ sections }: { sections: Section[] }) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>(sections[0]?.id || "");

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? (h.scrollTop / total) * 100 : 0);

      // find topmost section within viewport
      let current = sections[0]?.id || "";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top < 140) current = s.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="sticky top-16 z-30 -mx-4 px-4 mb-6 backdrop-blur-md bg-background/85 border-y border-border">
      <div
        className="absolute left-0 top-0 h-0.5 bg-trek-moss transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
      <div className="flex gap-1 overflow-x-auto py-2.5 scrollbar-none">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              active === s.id
                ? "bg-trek-moss text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
