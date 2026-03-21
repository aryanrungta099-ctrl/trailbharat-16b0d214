import { useState } from "react";
import { Send, User, MapPin, Calendar } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

interface Experience {
  id: number;
  name: string;
  trek: string;
  date: string;
  story: string;
  rating: number;
}

const initialExperiences: Experience[] = [
  {
    id: 1,
    name: "Priya Sharma",
    trek: "Kedarkantha, Uttarakhand",
    date: "Feb 2026",
    story: "Waking up at the summit to see a 360-degree view of snow-capped peaks was the most humbling moment of my life. The pine forests on the way up were magical — every step felt like walking through a painting. Our guide shared local folklore that made the trail come alive.",
    rating: 5,
  },
  {
    id: 2,
    name: "Arjun Nair",
    trek: "Hampta Pass, Himachal Pradesh",
    date: "Sep 2025",
    story: "The drastic change from green Kullu valley to the barren Spiti landscape within a single trek blew my mind. Crossing the river at Balu Ka Ghera was nerve-wracking but thrilling. The side trip to Chandratal Lake was absolutely worth the extra effort.",
    rating: 5,
  },
  {
    id: 3,
    name: "Meera Iyer",
    trek: "Valley of Flowers, Uttarakhand",
    date: "Aug 2025",
    story: "I counted over 40 different wildflower species in a single meadow. The monsoon mist parting to reveal fields of blue poppies and pink geraniums was surreal. Hemkund Sahib at dawn, with the lake perfectly still, was an experience I'll carry forever.",
    rating: 4,
  },
  {
    id: 4,
    name: "Rahul Deshpande",
    trek: "Chadar Trek, Ladakh",
    date: "Jan 2026",
    story: "Walking on the frozen Zanskar River at -25°C tested every limit I thought I had. The ice cracking beneath echoed through the gorge like thunder. Seeing the frozen Nerak waterfall made every shivering night in the tent worth it. Not for the faint-hearted, but absolutely transformative.",
    rating: 5,
  },
];

const Experiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [name, setName] = useState("");
  const [trek, setTrek] = useState("");
  const [story, setStory] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !trek.trim() || !story.trim()) return;
    const newExp: Experience = {
      id: Date.now(),
      name: name.trim(),
      trek: trek.trim(),
      date: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      story: story.trim(),
      rating,
    };
    setExperiences([newExp, ...experiences]);
    setName("");
    setTrek("");
    setStory("");
    setRating(5);
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

        {/* Submit form */}
        <ScrollReveal delay={100}>
          <form
            onSubmit={handleSubmit}
            className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm mb-12"
          >
            <h3 className="mb-5">Share Your Story</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
                className="px-4 py-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
              <input
                type="text"
                placeholder="Trek name & location"
                value={trek}
                onChange={(e) => setTrek(e.target.value)}
                maxLength={100}
                required
                className="px-4 py-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>
            <textarea
              placeholder="Tell us about your experience…"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              maxLength={1000}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition resize-none mb-4"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rating:</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-lg transition-colors ${star <= rating ? "text-trek-sunrise" : "text-border"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg trek-gradient text-primary-foreground font-medium text-sm shadow hover:shadow-md active:scale-[0.97] transition"
              >
                <Send className="h-4 w-4" /> Share
              </button>
            </div>
          </form>
        </ScrollReveal>

        {/* Experience list */}
        <div className="space-y-6">
          {experiences.map((exp, i) => (
            <ScrollReveal key={exp.id} delay={i * 80}>
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                    <User className="h-4 w-4 text-primary" /> {exp.name}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {exp.trek}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" /> {exp.date}
                  </span>
                  <span className="text-trek-sunrise text-sm">
                    {"★".repeat(exp.rating)}{"☆".repeat(5 - exp.rating)}
                  </span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{exp.story}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Experiences;
