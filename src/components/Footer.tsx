import { Mountain } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-[#0d1a12] text-[#e8e4da] py-14 mt-24">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Mountain className="h-5 w-5" />
            <span className="font-display text-lg font-semibold">Himalayan Trails</span>
          </div>
          <p className="text-sm opacity-70 max-w-xs leading-relaxed">
            Your complete guide to trekking across India & Nepal.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-3 uppercase tracking-wider opacity-90">Explore</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li><Link to="/routes" className="hover:opacity-100 transition-opacity">Trek Routes</Link></li>
            <li><Link to="/routes?difficulty=Easy" className="hover:opacity-100 transition-opacity">By Difficulty</Link></li>
            <li><Link to="/routes" className="hover:opacity-100 transition-opacity">By Region</Link></li>
            <li><Link to="/recommended" className="hover:opacity-100 transition-opacity">Recommended</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-3 uppercase tracking-wider opacity-90">Community</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li><Link to="/experiences" className="hover:opacity-100 transition-opacity">Share a Story</Link></li>
            <li><Link to="/guides" className="hover:opacity-100 transition-opacity">Find a Sherpa</Link></li>
            <li><Link to="/blog" className="hover:opacity-100 transition-opacity">Blog</Link></li>
            <li><Link to="/guesthouses" className="hover:opacity-100 transition-opacity">Guesthouses</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-3 uppercase tracking-wider opacity-90">Safety</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li><Link to="/tips" className="hover:opacity-100 transition-opacity">Essential Prep</Link></li>
            <li><Link to="/blog" className="hover:opacity-100 transition-opacity">Safety Guides</Link></li>
            <li><Link to="/blog" className="hover:opacity-100 transition-opacity">AMS Info</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-3 uppercase tracking-wider opacity-90">Company</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li><Link to="/" className="hover:opacity-100 transition-opacity">About</Link></li>
            <li><Link to="/agencies" className="hover:opacity-100 transition-opacity">Advertise</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-50">
        <span>© 2026 Himalayan Trails. Trek responsibly.</span>
        <span>Made with ♥ for trekkers everywhere</span>
      </div>
    </div>
  </footer>
);

export default Footer;
