import { useState, useEffect } from "react";
import { Send, User, MapPin, Calendar, LogIn, Upload, Image, X } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import ScrollReveal from "@/components/ScrollReveal";
import { moderateContent } from "@/lib/moderation";
import SEOHead, { breadcrumbSchema } from "@/components/SEOHead";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

interface Experience {
  id: string;
  user_id: string;
  trek_name: string;
  story: string;
  rating: number;
  photo_urls: string[];
  approved: boolean;
  created_at: string;
  display_name?: string;
}

const Experiences = () => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [trek, setTrek] = useState("");
  const [story, setStory] = useState("");
  const [rating, setRating] = useState(5);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchExperiences = async () => {
    const { data } = await supabase
      .from("experiences")
      .select("*, profiles(display_name)")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (data) {
      setExperiences(
        (data as any[]).map((e: any) => ({
          ...e,
          photo_urls: e.photo_urls || [],
          display_name: e.profiles?.display_name || "Anonymous Trekker",
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => { fetchExperiences(); }, []);

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photoFiles.length + files.length > 5) {
      toast.error("Maximum 5 photos allowed");
      return;
    }
    setPhotoFiles(prev => [...prev, ...files]);
    setPhotoPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removePhoto = (idx: number) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== idx));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !trek.trim() || !story.trim()) return;
    setSubmitting(true);

    // Upload photos
    const uploadedUrls: string[] = [];
    for (const file of photoFiles) {
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("experience-photos").upload(path, file);
      if (!error) {
        uploadedUrls.push(`${SUPABASE_URL}/storage/v1/object/public/experience-photos/${path}`);
      }
    }

    const { data: inserted, error } = await supabase.from("experiences").insert({
      user_id: user.id,
      trek_name: trek.trim(),
      story: story.trim(),
      rating,
      photo_urls: uploadedUrls,
      approved: false,
    } as any).select().single();

    if (!error) {
      const textToCheck = `Trek: ${trek.trim()}\nStory: ${story.trim()}`;
      const modResult = await moderateContent({ table: "experiences", recordId: (inserted as any).id, textContent: textToCheck, imageUrls: uploadedUrls });
      if (modResult.approved) {
        toast.success("Experience published! ✅");
      } else {
        toast.success("Experience submitted for review.");
      }
      setTrek(""); setStory(""); setRating(5);
      setPhotoFiles([]); setPhotoPreviews([]);
      await fetchExperiences();
    } else {
      toast.error("Failed to submit");
    }
    setSubmitting(false);
  };

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h1 className="text-balance mb-2">Trekker Experiences</h1>
          <p className="text-muted-foreground text-lg mb-12 max-w-xl">
            Real stories from the trails. Share yours and inspire others.
          </p>
        </ScrollReveal>

        {/* Submit form - login required */}
        <ScrollReveal delay={100}>
          {user ? (
            <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm mb-12">
              <h3 className="mb-5">Share Your Story</h3>
              <input
                type="text" placeholder="Trek name & location" value={trek}
                onChange={(e) => setTrek(e.target.value)} maxLength={100} required
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition mb-4"
              />
              <textarea
                placeholder="Tell us about your experience…" value={story}
                onChange={(e) => setStory(e.target.value)} maxLength={2000} required rows={4}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition resize-none mb-4"
              />

              {/* Photo uploads */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Photos (up to 5)</label>
                <div className="flex flex-wrap gap-3">
                  {photoPreviews.map((url, i) => (
                    <div key={i} className="relative h-20 w-20 rounded-lg overflow-hidden border border-border">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => removePhoto(i)} className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-destructive text-destructive-foreground">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {photoFiles.length < 5 && (
                    <label className="h-20 w-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                      <Image className="h-5 w-5 text-muted-foreground" />
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoAdd} />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rating:</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setRating(star)} className={`text-lg transition-colors ${star <= rating ? "text-trek-sunrise" : "text-border"}`}>★</button>
                    ))}
                  </div>
                </div>
                <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg trek-gradient text-primary-foreground font-medium text-sm shadow hover:shadow-md active:scale-[0.97] transition disabled:opacity-50">
                  <Send className="h-4 w-4" /> {submitting ? "Sharing…" : "Share"}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">⚠️ Your experience will be reviewed by admin before appearing publicly.</p>
            </form>
          ) : (
            <div className="bg-card rounded-xl border border-border p-8 shadow-sm mb-12 text-center">
              <LogIn className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="mb-2">Log in to share your story</h3>
              <p className="text-muted-foreground text-sm mb-4">Create an account or log in to share your trekking experiences.</p>
              <Link to="/auth" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg trek-gradient text-primary-foreground font-medium text-sm shadow hover:shadow-md active:scale-[0.97] transition">
                Log In / Sign Up
              </Link>
            </div>
          )}
        </ScrollReveal>

        {/* Experience list */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading experiences…</div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No experiences shared yet. Be the first!</div>
        ) : (
          <div className="space-y-6">
            {experiences.map((exp, i) => (
              <ScrollReveal key={exp.id} delay={Math.min(i * 60, 300)}>
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                      <User className="h-4 w-4 text-primary" /> {exp.display_name}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {exp.trek_name}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" /> {new Date(exp.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                    </span>
                    <span className="text-trek-sunrise text-sm">{"★".repeat(exp.rating)}{"☆".repeat(5 - exp.rating)}</span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-3">{exp.story}</p>
                  {exp.photo_urls && exp.photo_urls.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.photo_urls.map((url, j) => (
                        <img key={j} src={url} alt={`Experience photo ${j + 1}`} className="h-24 w-32 rounded-lg object-cover border border-border" loading="lazy" />
                      ))}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Experiences;
