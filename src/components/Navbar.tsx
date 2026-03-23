import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mountain, Menu, X, LogOut, User, Award, Shield, Briefcase, Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/routes", label: "Trek Routes" },
  { to: "/tips", label: "Safety Tips" },
  { to: "/experiences", label: "Experiences" },
  { to: "/sherpas", label: "Sherpas" },
  { to: "/agencies", label: "Agencies" },
  { to: "/start-trekking", label: "Start Trekking", icon: Play, highlight: true },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <Mountain className="h-6 w-6 text-primary transition-transform group-hover:scale-110 group-active:scale-95" />
          <span className="font-display text-lg font-semibold text-foreground">Himalayan Trails</span>
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                (item as any).highlight
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : location.pathname === item.to
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {(item as any).icon && <Play className="h-3.5 w-3.5" />}
              {item.label}
            </Link>
          ))}
          <div className="w-px h-6 bg-border mx-1.5" />
          {user ? (
            <div className="flex items-center gap-1">
              <Link to="/profile" className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted">
                <Award className="h-3.5 w-3.5" /> Profile
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted">
                  <Shield className="h-3.5 w-3.5" /> Admin
                </Link>
              )}
              <button onClick={handleSignOut} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:scale-95" title="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="px-4 py-2 rounded-md text-sm font-medium trek-gradient text-primary-foreground active:scale-95 transition-transform">
              Log In
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-md hover:bg-muted active:scale-95 transition" aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <ul className="flex flex-col p-4 gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link onClick={() => setOpen(false)} to={item.to} className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${location.pathname === item.to ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-border pt-2 mt-2">
              {user ? (
                <>
                  <Link onClick={() => setOpen(false)} to="/profile" className="block px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2">
                    <Award className="h-4 w-4" /> My Profile
                  </Link>
                  {isAdmin && (
                    <Link onClick={() => setOpen(false)} to="/admin" className="block px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2">
                      <Shield className="h-4 w-4" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={() => { handleSignOut(); setOpen(false); }} className="w-full text-left px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2">
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </>
              ) : (
                <Link onClick={() => setOpen(false)} to="/auth" className="block px-4 py-3 rounded-md text-sm font-medium trek-gradient text-primary-foreground text-center">
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
