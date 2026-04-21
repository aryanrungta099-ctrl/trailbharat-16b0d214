import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mountain, Menu, X, LogOut, Award, Shield, ChevronDown, Compass } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";

type NavChild = { to: string; label: string; desc?: string };
type NavGroup = { label: string; children: NavChild[] };

const navGroups: NavGroup[] = [
  {
    label: "Treks",
    children: [
      { to: "/routes", label: "All Routes", desc: "Browse 200+ Himalayan treks" },
      { to: "/recommended", label: "Recommended", desc: "AI-picked for you" },
      { to: "/suggest-trek", label: "Find My Trek", desc: "60-second quiz" },
    ],
  },
  {
    label: "Plan",
    children: [
      { to: "/tips", label: "Safety & Tips", desc: "Gear, fitness, weather" },
      { to: "/ams", label: "AMS Hub", desc: "Altitude sickness guide" },
      { to: "/agencies", label: "Agencies", desc: "Verified trek operators" },
      { to: "/guesthouses", label: "Guesthouses", desc: "Tea houses & lodges" },
    ],
  },
  {
    label: "Community",
    children: [
      { to: "/blog", label: "Blog", desc: "Stories & guides" },
      { to: "/experiences", label: "Trekker Experiences", desc: "Real trail tales" },
      { to: "/sherpas", label: "Sherpa Guides", desc: "Find a guide" },
    ],
  },
  {
    label: "About",
    children: [
      { to: "/about", label: "About Us", desc: "Who we are" },
      { to: "/methodology", label: "Methodology", desc: "How we verify" },
      { to: "/contact", label: "Contact", desc: "Reach the team" },
    ],
  },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const closeTimer = useRef<NodeJS.Timeout>();
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

  // Close menus on route change
  useEffect(() => {
    setOpen(false);
    setActiveGroup(null);
    setMobileExpanded(null);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isGroupActive = (group: NavGroup) =>
    group.children.some((c) => location.pathname === c.to);

  const openGroup = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveGroup(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveGroup(null), 150);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0c1f13]/90 backdrop-blur-lg border-b border-foreground/[0.05]"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <Mountain className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
          <span className="font-display text-lg font-semibold text-foreground tracking-tight">
            Himalayan Trails
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navGroups.map((group) => {
            const active = isGroupActive(group);
            const isOpen = activeGroup === group.label;
            return (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => openGroup(group.label)}
                onMouseLeave={scheduleClose}
              >
                <button
                  onClick={() => setActiveGroup(isOpen ? null : group.label)}
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-md text-sm font-body font-medium transition-colors ${
                    active || isOpen
                      ? "text-primary"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  {group.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 min-w-[260px]"
                    onMouseEnter={() => openGroup(group.label)}
                    onMouseLeave={scheduleClose}
                  >
                    <div className="rounded-xl border border-foreground/[0.08] bg-[#0c1f13]/95 backdrop-blur-xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-1 duration-150">
                      {group.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          onClick={() => setActiveGroup(null)}
                          className={`block px-3 py-2.5 rounded-lg transition-colors ${
                            location.pathname === child.to
                              ? "bg-primary/10 text-primary"
                              : "text-foreground/80 hover:bg-foreground/[0.04] hover:text-foreground"
                          }`}
                        >
                          <div className="text-sm font-medium">{child.label}</div>
                          {child.desc && (
                            <div className="text-xs text-foreground/45 mt-0.5">
                              {child.desc}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Find My Trek prominent CTA */}
          <Link
            to="/suggest-trek"
            className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold trek-gradient text-primary-foreground active:scale-95 transition-transform hover-scale"
          >
            <Compass className="h-3.5 w-3.5" />
            Find My Trek
          </Link>

          <div className="w-px h-5 bg-foreground/[0.07] mx-2" />

          {user ? (
            <div className="flex items-center gap-1">
              <Link
                to="/profile"
                className="text-sm text-foreground/50 flex items-center gap-1.5 hover:text-foreground transition-colors px-2 py-1.5 rounded-md"
              >
                <Award className="h-3.5 w-3.5" /> Profile
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm text-foreground/50 flex items-center gap-1.5 hover:text-foreground transition-colors px-2 py-1.5 rounded-md"
                >
                  <Shield className="h-3.5 w-3.5" /> Admin
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="p-2 rounded-md text-foreground/50 hover:text-foreground transition-colors active:scale-95"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-1.5 rounded-full text-sm font-medium border border-foreground/15 text-foreground/80 hover:text-foreground hover:border-foreground/30 transition-colors"
            >
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

        {/* Mobile: Find My Trek + toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to="/suggest-trek"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold trek-gradient text-primary-foreground"
          >
            <Compass className="h-3 w-3" />
            Find Trek
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md text-foreground/60 hover:text-foreground active:scale-95 transition"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-foreground/[0.05] bg-[#0c1f13]/95 backdrop-blur-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
          <ul className="flex flex-col p-4 gap-1">
            <li>
              <Link
                to="/"
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/"
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-foreground hover:bg-foreground/[0.03]"
                }`}
              >
                Home
              </Link>
            </li>
            {navGroups.map((group) => {
              const expanded = mobileExpanded === group.label;
              return (
                <li key={group.label}>
                  <button
                    onClick={() =>
                      setMobileExpanded(expanded ? null : group.label)
                    }
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/[0.03]"
                  >
                    {group.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expanded && (
                    <ul className="pl-4 mt-1 mb-2 border-l border-foreground/[0.07] ml-4 space-y-0.5">
                      {group.children.map((child) => (
                        <li key={child.to}>
                          <Link
                            to={child.to}
                            className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                              location.pathname === child.to
                                ? "text-primary bg-primary/10"
                                : "text-foreground/60 hover:text-foreground hover:bg-foreground/[0.03]"
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}

            <li className="border-t border-foreground/[0.05] pt-2 mt-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="px-4 py-3 rounded-lg text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/[0.03] flex items-center gap-2"
                  >
                    <Award className="h-4 w-4" /> My Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="px-4 py-3 rounded-lg text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/[0.03] flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4" /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/[0.03] flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="block px-4 py-3 rounded-lg text-sm font-medium trek-gradient text-primary-foreground text-center"
                >
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
