import { Mountain } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground py-12 mt-24">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Mountain className="h-5 w-5" />
            <span className="font-display text-lg font-semibold">Himalayan Trails</span>
          </div>
          <p className="text-sm opacity-80 max-w-xs">
            Your trusted companion for exploring India's most breathtaking trekking trails.
          </p>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/routes" className="hover:opacity-100 transition-opacity">Trek Routes</Link></li>
            <li><Link to="/tips" className="hover:opacity-100 transition-opacity">Safety Tips</Link></li>
            <li><Link to="/experiences" className="hover:opacity-100 transition-opacity">Experiences</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold mb-3">Stay Safe</h4>
          <p className="text-sm opacity-80">
            Always inform someone about your trek plan. Carry essentials and respect nature.
          </p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm opacity-60">
        © 2026 Himalayan Trails. Trek responsibly.
      </div>
    </div>
  </footer>
);

export default Footer;
