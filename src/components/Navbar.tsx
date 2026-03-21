import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mountain, Menu, X } from "lucide-react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/routes", label: "Trek Routes" },
  { to: "/tips", label: "Safety Tips" },
  { to: "/experiences", label: "Experiences" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <Mountain className="h-6 w-6 text-primary transition-transform group-hover:scale-110 group-active:scale-95" />
          <span className="font-display text-lg font-semibold text-foreground">TrailBharat</span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.to
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-md hover:bg-muted active:scale-95 transition"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <ul className="flex flex-col p-4 gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.to
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
