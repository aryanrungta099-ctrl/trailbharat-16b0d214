import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mountain, Menu, X, LogOut, User, Award, Shield, Briefcase } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/routes", label: "Trek Routes" },
  { to: "/guides", label: "Sherpas & Agencies" },
  { to: "/experiences", label: "Experiences" },
  { to: "/blog", label: "Blog" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-[#0c1f13]/90 backdrop-blur-lg border-b border-foreground/[0.05]"
        : "bg-transparent"
    }`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo with SVG mountain */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <Mountain className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
          <span className="font-display text-lg font-semibold text-foreground tracking-tight">Himalayan Trails</span>
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`relative px-3.5 py-2 rounded-md text-sm font-body font-medium transition-colors ${
                location.pathname === item.to
                  ? "text-primary"
                  : "text-foreground/50 hover:text-foreground"
              }`}
            >
              {item.label}
              {/* Active dot indicator */}
              {location.pathname === item.to && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          ))}
          <div className="w-px h-5 bg-foreground/[0.07] mx-2" />
          {user ? (
            <div className="flex items-center gap-1">
              <Link to="/profile" className="text-sm text-foreground/50 flex items-center gap-1.5 hover:text-foreground transition-colors px-2 py-1.5 rounded-md">
                <Award className="h-3.5 w-3.5" /> Profile
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-sm text-foreground/50 flex items-center gap-1.5 hover:text-foreground transition-colors px-2 py-1.5 rounded-md">
                  <Shield className="h-3.5 w-3.5" /> Admin
                </Link>
              )}
              <button onClick={handleSignOut} className="p-2 rounded-md text-foreground/50 hover:text-foreground transition-colors active:scale-95" title="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="px-5 py-2 rounded-full text-sm font-medium trek-gradient text-primary-foreground active:scale-95 transition-transform hover-scale">
              Log In
            </Link>
          )}
          {/* HikerAI pill */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-hiker-ai"))}
            className="relative ml-2 px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-medium hover:border-primary/60 transition-all"
          >
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse-ring" />
            HikerAI
          </button>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-md text-foreground/60 hover:text-foreground active:scale-95 transition" aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-foreground/[0.05] bg-[#0c1f13]/95 backdrop-blur-lg">
          <ul className="flex flex-col p-4 gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link onClick={() => setOpen(false)} to={item.to} className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.to ? "text-primary bg-primary/10" : "text-foreground/50 hover:text-foreground hover:bg-foreground/[0.03]"}`}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-foreground/[0.05] pt-2 mt-2">
              {user ? (
                <>
                  <Link onClick={() => setOpen(false)} to="/profile" className="block px-4 py-3 rounded-lg text-sm font-medium text-foreground/50 hover:text-foreground hover:bg-foreground/[0.03] flex items-center gap-2">
                    <Award className="h-4 w-4" /> My Profile
                  </Link>
                  {isAdmin && (
                    <Link onClick={() => setOpen(false)} to="/admin" className="block px-4 py-3 rounded-lg text-sm font-medium text-foreground/50 hover:text-foreground hover:bg-foreground/[0.03] flex items-center gap-2">
                      <Shield className="h-4 w-4" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={() => { handleSignOut(); setOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-foreground/50 hover:text-foreground hover:bg-foreground/[0.03] flex items-center gap-2">
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </>
              ) : (
                <Link onClick={() => setOpen(false)} to="/auth" className="block px-4 py-3 rounded-lg text-sm font-medium trek-gradient text-primary-foreground text-center">
                  Log In / Sign Up
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
