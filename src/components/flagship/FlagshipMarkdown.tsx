import ReactMarkdown from "react-markdown";
import { Mountain, Lightbulb, AlertTriangle, Info, PiggyBank, Quote } from "lucide-react";
import { ReactNode } from "react";

interface ImageItem {
  url: string;
  caption: string;
  source: string;
  descUrl?: string;
}

interface Section {
  id: string;
  heading: string;
  deck: string | null;
  body: string;
}

export interface FlagshipSection {
  id: string;
  label: string;
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

export function parseFlagshipSections(md: string): { sections: Section[]; nav: FlagshipSection[] } {
  const lines = md.split("\n");
  const sections: Section[] = [];
  let current: { heading: string; lines: string[] } | null = null;

  const flush = () => {
    if (!current) return;
    const bodyRaw = current.lines.join("\n").trim();
    // Extract deck: first paragraph if short (<200 chars), strip markdown
    let deck: string | null = null;
    let body = bodyRaw;
    const firstPara = bodyRaw.split(/\n\s*\n/)[0]?.trim();
    if (firstPara && firstPara.length < 220 && !firstPara.startsWith("#") && !firstPara.startsWith("-") && !firstPara.startsWith("|") && !firstPara.startsWith(">")) {
      deck = firstPara.replace(/[*_`]/g, "");
      body = bodyRaw.slice(firstPara.length).trim();
    }
    sections.push({ id: slug(current.heading), heading: current.heading, deck, body });
  };

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    const h1 = line.match(/^#\s+(.+)$/);
    if (h1) continue; // already in hero
    if (h2) {
      flush();
      current = { heading: h2[1].trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    } else {
      // Preamble before any H2 → wrap as "Overview"
      current = { heading: "Overview", lines: [line] };
    }
  }
  flush();

  return {
    sections,
    nav: sections.map(s => ({ id: s.id, label: s.heading })),
  };
}

// COMPONENT: callout (4 types) — detected by emoji/keyword in blockquote
function detectCallout(text: string): { type: "tip" | "warn" | "info" | "save"; body: string } | null {
  const t = text.trim();
  if (/^(💡|tip:|pro tip:)/i.test(t)) return { type: "tip", body: t.replace(/^(💡\s*|tip:\s*|pro tip:\s*)/i, "") };
  if (/^(⚠️|warning:|caution:|watch out)/i.test(t)) return { type: "warn", body: t.replace(/^(⚠️\s*|warning:\s*|caution:\s*|watch out[:\s])/i, "") };
  if (/^(ℹ️|did you know|note:|fact:)/i.test(t)) return { type: "info", body: t.replace(/^(ℹ️\s*|did you know[:\s]*|note:\s*|fact:\s*)/i, "") };
  if (/^(💰|cost-saver|save:|budget tip)/i.test(t)) return { type: "save", body: t.replace(/^(💰\s*|cost-saver[:\s]*|save:\s*|budget tip[:\s]*)/i, "") };
  return null;
}

const calloutStyles = {
  tip:  { border: "border-l-trek-moss",    bg: "bg-trek-moss/8",    text: "text-trek-moss",    icon: Lightbulb,     label: "Tip" },
  warn: { border: "border-l-trek-sunrise", bg: "bg-trek-sunrise/8", text: "text-trek-sunrise", icon: AlertTriangle, label: "Heads up" },
  info: { border: "border-l-trek-sky",     bg: "bg-trek-sky/8",     text: "text-trek-sky",     icon: Info,          label: "Did you know" },
  save: { border: "border-l-purple-400",   bg: "bg-purple-400/8",   text: "text-purple-300",   icon: PiggyBank,     label: "Cost-saver" },
};

// COMPONENT: prose-renderer — custom markdown components
const markdownComponents = {
  h3: ({ children }: any) => (
    <h3 className="font-display text-xl md:text-2xl text-foreground mt-10 mb-3 leading-snug">{children}</h3>
  ),
  h4: ({ children }: any) => (
    <h4 className="font-display text-base font-semibold text-foreground mt-6 mb-2 uppercase tracking-wider">{children}</h4>
  ),
  p: ({ children }: any) => (
    <p className="text-foreground/85 leading-[1.75] text-[17px] mb-5 max-w-[70ch]">{children}</p>
  ),
  strong: ({ children }: any) => <strong className="text-foreground font-semibold">{children}</strong>,
  em: ({ children }: any) => <em className="text-foreground/90 italic">{children}</em>,
  a: ({ children, href }: any) => (
    <a href={href} className="text-trek-moss underline decoration-trek-moss/40 underline-offset-2 hover:decoration-trek-moss" target="_blank" rel="noopener noreferrer">{children}</a>
  ),
  ul: ({ children }: any) => <ul className="space-y-2 mb-6 max-w-[70ch]">{children}</ul>,
  ol: ({ children }: any) => <ol className="space-y-2 mb-6 max-w-[70ch] list-decimal pl-5">{children}</ol>,
  li: ({ children }: any) => (
    <li className="flex gap-2.5 text-foreground/85 leading-relaxed text-[16px]">
      <span className="text-trek-moss mt-2.5 shrink-0 w-1 h-1 rounded-full bg-trek-moss" />
      <span className="flex-1">{children}</span>
    </li>
  ),
  blockquote: ({ children }: any) => {
    // Extract raw text
    const text = extractText(children);
    const callout = detectCallout(text);
    if (callout) {
      const s = calloutStyles[callout.type];
      const Icon = s.icon;
      return (
        <aside className={`my-7 rounded-r-lg ${s.bg} ${s.border} border-l-4 px-5 py-4 max-w-[72ch]`}>
          <div className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] font-semibold ${s.text} mb-1.5`}>
            <Icon className="h-3.5 w-3.5" /> {s.label}
          </div>
          <div className="text-foreground/90 text-[15px] leading-relaxed [&_p]:mb-0 [&_p]:text-foreground/90 [&_p]:text-[15px]">
            {children}
          </div>
        </aside>
      );
    }
    // Default = pull quote
    return (
      <blockquote className="my-10 pl-6 border-l-2 border-trek-moss/50 max-w-[60ch]">
        <Quote className="h-5 w-5 text-trek-moss/50 mb-1" />
        <div className="font-display text-xl md:text-2xl italic text-foreground leading-snug [&_p]:mb-0">
          {children}
        </div>
      </blockquote>
    );
  },
  table: ({ children }: any) => (
    <div className="my-7 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: any) => <thead className="bg-muted/50">{children}</thead>,
  th: ({ children }: any) => <th className="text-left px-4 py-2.5 font-semibold text-foreground text-xs uppercase tracking-wider">{children}</th>,
  td: ({ children }: any) => <td className="px-4 py-2.5 text-foreground/80 border-t border-border">{children}</td>,
  tr: ({ children }: any) => <tr className="even:bg-muted/20">{children}</tr>,
  hr: () => (
    <div className="flex items-center gap-3 my-12 text-trek-moss/40">
      <div className="flex-1 h-px bg-border" />
      <Mountain className="h-4 w-4" />
      <div className="flex-1 h-px bg-border" />
    </div>
  ),
};

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in (node as any)) {
    return extractText((node as any).props.children);
  }
  return "";
}

// COMPONENT: flagship-markdown — section-by-section rendering with decks, dividers, inline images
export default function FlagshipMarkdown({ sections, images }: { sections: Section[]; images: ImageItem[] }) {
  return (
    <article className="space-y-2">
      {sections.map((sec, i) => {
        const img = images[i % Math.max(images.length, 1)];
        const showImage = images.length > 0 && i > 0 && i % 2 === 1;
        return (
          <section key={sec.id} id={sec.id} className="scroll-mt-28 pt-6">
            {/* Section divider — skip on first */}
            {i > 0 && (
              <div className="flex items-center gap-3 mb-10 text-trek-moss/40">
                <div className="flex-1 h-px bg-border" />
                <Mountain className="h-4 w-4" />
                <div className="flex-1 h-px bg-border" />
              </div>
            )}
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3 leading-[1.15]">
              {sec.heading}
            </h2>
            {sec.deck && (
              <p className="text-lg md:text-xl italic text-muted-foreground max-w-[58ch] mb-7 leading-relaxed">
                {sec.deck}
              </p>
            )}
            <ReactMarkdown components={markdownComponents}>{sec.body}</ReactMarkdown>

            {showImage && img && (
              <figure className="my-10 -mx-2 md:mx-0">
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-muted">
                  <img src={img.url} alt={img.caption} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <figcaption className="mt-2 text-xs italic text-muted-foreground px-1">
                  {img.caption}
                  {img.descUrl ? (
                    <> · <a href={img.descUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">{img.source}</a></>
                  ) : (
                    <> · {img.source}</>
                  )}
                </figcaption>
              </figure>
            )}
          </section>
        );
      })}
    </article>
  );
}
