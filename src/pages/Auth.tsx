import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Mountain } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
      else navigate("/");
    } else {
      if (!displayName.trim()) {
        setError("Please enter your name");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, displayName.trim());
      if (error) setError(error.message);
      else setSignupSuccess(true);
    }
    setLoading(false);
  };

  if (signupSuccess) {
    return (
      <main className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <ScrollReveal>
          <div className="bg-card rounded-xl border border-border p-8 max-w-md text-center shadow-sm">
            <Mountain className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="mb-3">Check Your Email</h2>
            <p className="text-muted-foreground text-sm">
              We've sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
            </p>
            <button onClick={() => { setSignupSuccess(false); setMode("login"); }} className="mt-6 text-sm text-primary font-medium hover:underline">
              Back to login
            </button>
          </div>
        </ScrollReveal>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 min-h-screen flex items-center justify-center">
      <ScrollReveal>
        <div className="bg-card rounded-xl border border-border p-8 w-full max-w-md shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Mountain className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-semibold">TrailBharat</span>
          </div>

          <div className="flex mb-6 bg-muted rounded-lg p-1">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === "login" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode("signup"); setError(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === "signup" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={100}
                required
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              required
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg trek-gradient text-primary-foreground font-medium text-sm shadow hover:shadow-md active:scale-[0.97] transition disabled:opacity-50"
            >
              {loading ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}
            </button>
          </form>
        </div>
      </ScrollReveal>
    </main>
  );
};

export default Auth;
