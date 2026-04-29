import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Tag, Share2, User, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import SEOHead, { articleSchema, breadcrumbSchema } from "@/components/SEOHead";

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// Curated cover images for blog posts by topic keyword
const COVER_IMAGES: Record<string, string> = {
  "beginners": "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=600&fit=crop",
  "himalayan": "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=1200&h=600&fit=crop",
  "sandakphu": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
  "kedarkantha": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=600&fit=crop",
  "budget": "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1200&h=600&fit=crop",
  "monsoon": "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1200&h=600&fit=crop",
  "solo": "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=1200&h=600&fit=crop",
  "kolkata": "https://images.unsplash.com/photo-1580289455679-70ddd2a6b13f?w=1200&h=600&fit=crop",
  "goechala": "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200&h=600&fit=crop",
  "winter": "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1200&h=600&fit=crop",
  "altitude": "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&h=600&fit=crop",
  "uttarakhand": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&h=600&fit=crop",
  "gear": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&h=600&fit=crop",
  "himachal": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&h=600&fit=crop",
  "chadar": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=600&fit=crop",
  "sikkim": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
  "fitness": "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1200&h=600&fit=crop",
  "delhi": "https://images.unsplash.com/photo-1455156218388-5e61b526818b?w=1200&h=600&fit=crop",
  "valley": "https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=1200&h=600&fit=crop",
  "kerala": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
};

const DEFAULT_COVER = "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=1200&h=600&fit=crop";

function getCoverImage(slug: string, coverUrl: string | null): string {
  if (coverUrl) return coverUrl;
  for (const [key, url] of Object.entries(COVER_IMAGES)) {
    if (slug.includes(key)) return url;
  }
  return DEFAULT_COVER;
}

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(3, Math.ceil(words / 200));
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) { setLoading(false); setError(true); return; }
    supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).single()
      .then(({ data, error: err }) => {
        if (err || !data) { setError(true); }
        else { setPost(data as BlogPostData); }
        setLoading(false);
      });
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: post?.title, text: post?.excerpt, url: window.location.href }).catch(() => {});
    else { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }
  };

  if (loading) return (
    <main className="pt-24 pb-16 min-h-screen" style={{ background: "#0c1f13" }}>
      <div className="container mx-auto px-4 max-w-3xl animate-pulse space-y-4">
        <div className="h-64 bg-foreground/5 rounded-2xl" />
        <div className="h-8 bg-foreground/5 rounded w-2/3" />
        <div className="h-4 bg-foreground/5 rounded w-full" />
        <div className="h-4 bg-foreground/5 rounded w-3/4" />
      </div>
    </main>
  );

  if (error || !post) return (
    <main className="pt-24 pb-16 min-h-screen text-center" style={{ background: "#0c1f13" }}>
      <h1 className="text-2xl font-display text-foreground mb-4">Article Not Found</h1>
      <p className="text-foreground/50 mb-6">This article may have been removed or doesn't exist.</p>
      <Link to="/blog" className="text-primary hover:underline">← Back to Blog</Link>
    </main>
  );

  const coverImage = getCoverImage(post.slug, post.cover_image_url);
  const readTime = estimateReadTime(post.content);

  return (
    <main className="pt-0 pb-16 min-h-screen" style={{ background: "#0c1f13" }}>
      <SEOHead
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={coverImage}
        type="article"
        publishedTime={post.created_at}
        modifiedTime={post.updated_at}
        tags={post.tags}
        jsonLd={[
          articleSchema({ title: post.title, excerpt: post.excerpt, coverImage: coverImage, createdAt: post.created_at, updatedAt: post.updated_at, slug: post.slug }),
          breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }, { name: post.title, url: `/blog/${post.slug}` }]),
        ]}
      />

      {/* Hero cover image */}
      <div className="relative w-full h-[50vh] min-h-[320px] overflow-hidden">
        <img
          src={coverImage}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1f13] via-[#0c1f13]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground leading-tight">
            {post.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl">
        {/* Meta bar */}
        <div className="flex items-center gap-4 text-xs text-foreground/50 py-6 border-b border-foreground/[0.07] mb-8 flex-wrap">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" /> Aryan Rungta
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> {new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {readTime} min read
          </span>
          <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-foreground transition-colors ml-auto">
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map(tag => (
              <Link key={tag} to={`/blog?tag=${tag}`} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors flex items-center gap-1">
                <Tag className="h-3 w-3" /> {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Article content */}
        <article className="prose prose-lg max-w-none
          prose-headings:font-display prose-headings:text-foreground prose-headings:font-semibold
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-foreground/[0.07] prose-h2:pb-3
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-5
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground prose-strong:font-semibold
          prose-ul:text-foreground/80 prose-ol:text-foreground/80
          prose-li:mb-2 prose-li:leading-relaxed
          prose-blockquote:border-l-primary prose-blockquote:text-foreground/60 prose-blockquote:italic
          prose-img:rounded-xl prose-img:border prose-img:border-foreground/[0.07]
          prose-hr:border-foreground/[0.07]
        ">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>

        {/* Author card */}
        <div className="mt-12 p-6 rounded-2xl border border-foreground/[0.07]" style={{ background: "#111e16" }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display text-xl font-bold">
              AR
            </div>
            <div>
              <p className="text-foreground font-display font-semibold text-lg">Aryan Rungta</p>
              <p className="text-foreground/50 text-sm">Founder, Himalayan Trails — Passionate trekker and mountain storyteller.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-foreground/50 text-sm mb-4">Ready to hit the trails?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/routes" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #2d6a4f, #74c69d)", color: "#0c1f13" }}>
              Explore All Routes →
            </Link>
            <Link to="/sherpas" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-foreground border border-foreground/10 transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}>
              Find a Sherpa
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogPost;
