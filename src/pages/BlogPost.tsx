import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Tag, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import ScrollReveal from "@/components/ScrollReveal";
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

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("blog_posts" as any).select("*").eq("slug", slug).eq("published", true).single()
      .then(({ data }) => { setPost(data as any); setLoading(false); });
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: post?.title, text: post?.excerpt, url: window.location.href }).catch(() => {});
    else { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }
  };

  if (loading) return (
    <main className="pt-24 pb-16 container mx-auto px-4">
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-2/3" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-3/4" />
      </div>
    </main>
  );

  if (!post) return (
    <main className="pt-24 pb-16 container mx-auto px-4 text-center">
      <h1>Article Not Found</h1>
      <Link to="/blog" className="text-primary hover:underline mt-4 inline-block">← Back to Blog</Link>
    </main>
  );

  return (
    <main className="pt-24 pb-16 min-h-screen">
      {/* SEO: JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: post.cover_image_url,
        datePublished: post.created_at,
        dateModified: post.updated_at,
        url: window.location.href,
        publisher: { "@type": "Organization", name: "Himalayan Trails" },
      }) }} />

      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <ScrollReveal>
          <article>
            {post.cover_image_url && (
              <img src={post.cover_image_url} alt={post.title} className="w-full rounded-2xl mb-8 max-h-[400px] object-cover border border-border" />
            )}

            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4 flex-wrap">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              <button onClick={handleShare} className="flex items-center gap-1 hover:text-foreground transition-colors"><Share2 className="h-3 w-3" /> Share</button>
            </div>

            <h1 className="text-3xl md:text-4xl mb-4">{post.title}</h1>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map(tag => (
                  <Link key={tag} to={`/blog?tag=${tag}`} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors flex items-center gap-1">
                    <Tag className="h-3 w-3" /> {tag}
                  </Link>
                ))}
              </div>
            )}

            <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-display prose-a:text-primary prose-img:rounded-xl">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </article>
        </ScrollReveal>
      </div>
    </main>
  );
};

export default BlogPost;
