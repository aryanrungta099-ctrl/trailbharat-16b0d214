import { Link, useLocation } from "react-router-dom";
import { Home, Compass, MessageSquare, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/routes", icon: Compass, label: "Routes" },
  { to: "/experiences", icon: MessageSquare, label: "Stories" },
  { to: "/guides", icon: Users, label: "Sherpas" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#0c1f13]/95 backdrop-blur-lg border-t border-foreground/[0.07]" aria-label="Mobile navigation">
      <div className="flex items-center justify-around h-14">
        {items.map((item) => {
          const active = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 transition-colors",
                active ? "text-primary" : "text-foreground/40"
              )}
              aria-label={item.label}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {active && <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
