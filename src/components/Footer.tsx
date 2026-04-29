import { Mountain } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="relative mt-0" style={{ background: "linear-gradient(to bottom, #0c1f13, #070f0a)" }}>
    {/* Mountain silhouette decoration */}
    <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden pointer-events-none">
      <svg className="w-full h-full text-[#0c1f13]" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <polygon points="0,80 0,60 120,30 240,50 360,20 480,40 600,15 720,35 840,10 960,30 1080,5 1200,25 1320,15 1440,40 1440,80" fill="currentColor" />
      </svg>
    </div>

    <div className="container mx-auto px-4 pt-20 pb-10">
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            {/* Large mountain watermark */}
            <Mountain className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-semibold text-foreground">Himalayan Trails</span>
          </div>
          <p className="text-sm text-foreground/30 max-w-xs leading-relaxed">
            Your complete guide to trekking across India & Nepal.
          </p>
          {/* Large watermark mountain */}
          <Mountain className="h-20 w-20 text-foreground/[0.03] mt-4" />
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-4 uppercase tracking-[0.15em] text-foreground/60">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/routes" className="text-foreground/35 hover:text-primary transition-colors story-link">Trek Routes</Link></li>
            <li><Link to="/routes?difficulty=Easy" className="text-foreground/35 hover:text-primary transition-colors story-link">By Difficulty</Link></li>
            <li><Link to="/routes" className="text-foreground/35 hover:text-primary transition-colors story-link">By Region</Link></li>
            <li><Link to="/recommended" className="text-foreground/35 hover:text-primary transition-colors story-link">Recommended</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-4 uppercase tracking-[0.15em] text-foreground/60">Community</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/experiences" className="text-foreground/35 hover:text-primary transition-colors story-link">Share a Story</Link></li>
            <li><Link to="/guides" className="text-foreground/35 hover:text-primary transition-colors story-link">Find a Sherpa</Link></li>
            <li><Link to="/blog" className="text-foreground/35 hover:text-primary transition-colors story-link">Blog</Link></li>
            <li><Link to="/guesthouses" className="text-foreground/35 hover:text-primary transition-colors story-link">Guesthouses</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-4 uppercase tracking-[0.15em] text-foreground/60">Safety</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/tips" className="text-foreground/35 hover:text-primary transition-colors story-link">Essential Prep</Link></li>
            <li><Link to="/ams" className="text-foreground/35 hover:text-primary transition-colors story-link">AMS Hub & Calculator</Link></li>
            <li><Link to="/blog" className="text-foreground/35 hover:text-primary transition-colors story-link">Safety Guides</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-4 uppercase tracking-[0.15em] text-foreground/60">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="text-foreground/35 hover:text-primary transition-colors story-link">About</Link></li>
            <li><Link to="/methodology" className="text-foreground/35 hover:text-primary transition-colors story-link">Methodology</Link></li>
            <li><Link to="/contact" className="text-foreground/35 hover:text-primary transition-colors story-link">Contact</Link></li>
            <li><Link to="/agencies" className="text-foreground/35 hover:text-primary transition-colors story-link">Advertise</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-foreground/[0.05] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground/20">
        <span>© 2026 Himalayan Trails. Trek responsibly.</span>
        <span>Made with ♥ for trekkers everywhere</span>
      </div>
    </div>
  </footer>
);

export default Footer;
