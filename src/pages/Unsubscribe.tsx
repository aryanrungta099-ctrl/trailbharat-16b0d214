import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle, Mountain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<"loading" | "valid" | "already" | "invalid" | "done" | "error">("loading");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) { setState("invalid"); return; }
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`;
    fetch(url, { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } })
      .then(r => r.json())
      .then(data => {
        if (data.valid) setState("valid");
        else if (data.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      })
      .catch(() => setState("error"));
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", { body: { token } });
    setSubmitting(false);
    if (error) setState("error");
    else if (data?.success) setState("done");
    else if (data?.reason === "already_unsubscribed") setState("already");
    else setState("error");
  };

  return (
    <>
      <SEOHead title="Unsubscribe" description="Manage your email preferences" path="/unsubscribe" noIndex />
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-8 shadow-lg text-center">
          <Mountain className="h-10 w-10 text-primary mx-auto mb-3" />
          {state === "loading" && (<><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /><p className="mt-3 text-sm text-muted-foreground">Checking your link…</p></>)}
          {state === "valid" && (
            <>
              <h1 className="font-display text-2xl font-bold mb-2">Unsubscribe?</h1>
              <p className="text-sm text-muted-foreground mb-6">You'll stop receiving emails from Himalayan Trails.</p>
              <button onClick={confirm} disabled={submitting} className="w-full px-5 py-3 rounded-full bg-destructive text-destructive-foreground font-medium hover:opacity-90 disabled:opacity-50 transition">
                {submitting ? "Processing…" : "Confirm Unsubscribe"}
              </button>
            </>
          )}
          {state === "done" && (<><CheckCircle2 className="h-10 w-10 text-trek-moss mx-auto mb-3" /><h1 className="font-display text-xl font-bold mb-2">You're unsubscribed</h1><p className="text-sm text-muted-foreground">We won't email you again. Safe travels!</p></>)}
          {state === "already" && (<><CheckCircle2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" /><h1 className="font-display text-xl font-bold mb-2">Already unsubscribed</h1><p className="text-sm text-muted-foreground">This email is already off our list.</p></>)}
          {state === "invalid" && (<><XCircle className="h-10 w-10 text-destructive mx-auto mb-3" /><h1 className="font-display text-xl font-bold mb-2">Invalid link</h1><p className="text-sm text-muted-foreground">This unsubscribe link isn't valid or has expired.</p></>)}
          {state === "error" && (<><XCircle className="h-10 w-10 text-destructive mx-auto mb-3" /><h1 className="font-display text-xl font-bold mb-2">Something went wrong</h1><p className="text-sm text-muted-foreground">Please try again later.</p></>)}
          <Link to="/" className="inline-block mt-6 text-xs text-primary hover:underline">← Back to Himalayan Trails</Link>
        </div>
      </main>
    </>
  );
};

export default Unsubscribe;
