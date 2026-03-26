import { useState } from "react";
import { Mountain, Briefcase } from "lucide-react";
import Sherpas from "@/pages/Sherpas";
import Agencies from "@/pages/Agencies";
import SEOHead, { breadcrumbSchema } from "@/components/SEOHead";

const SherpasAgencies = () => {
  const [tab, setTab] = useState<"sherpas" | "agencies">("sherpas");

  return (
    <main className="pt-24 pb-16 container mx-auto px-4 min-h-screen">
      <SEOHead
        title="Sherpas & Agencies"
        description="Find experienced mountain guides and professional trekking agencies across India & Nepal for your next Himalayan trek."
        path="/guides"
        jsonLd={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Sherpas & Agencies", url: "/guides" }])}
      />
      <div className="mb-8">
        <h1 className="text-balance">Find a Sherpa or Agency</h1>
        <p className="text-muted-foreground mt-2 max-w-lg">
          Connect with experienced mountain guides or professional trekking agencies across India & Nepal.
        </p>
      </div>

      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab("sherpas")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-[0.97] ${
            tab === "sherpas"
              ? "bg-primary text-primary-foreground shadow"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <Mountain className="h-4 w-4" /> Sherpa Guides
        </button>
        <button
          onClick={() => setTab("agencies")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-[0.97] ${
            tab === "agencies"
              ? "bg-primary text-primary-foreground shadow"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <Briefcase className="h-4 w-4" /> Travel Agencies
        </button>
      </div>

      {tab === "sherpas" ? <Sherpas embedded /> : <Agencies embedded />}
    </main>
  );
};

export default SherpasAgencies;
