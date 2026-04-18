import { useState } from "react";
import { z } from "zod";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  trekName: z.string().trim().min(1, "Please select a trek").max(200),
  budget: z.string().trim().min(1, "Please enter your budget").max(50),
  message: z.string().trim().max(1000).optional(),
});

interface EnquiryFormProps {
  defaultTrekName?: string;
  defaultName?: string;
  defaultEmail?: string;
  trekOptions?: string[];
  compact?: boolean;
}

const EnquiryForm = ({ defaultTrekName, defaultName, defaultEmail, trekOptions, compact }: EnquiryFormProps) => {
  const [name, setName] = useState(defaultName || "");
  const [email, setEmail] = useState(defaultEmail || "");
  const [trekName, setTrekName] = useState(defaultTrekName || "");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = enquirySchema.safeParse({ name, email, trekName, budget, message });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Please check your inputs");
      return;
    }
    setSubmitting(true);
    try {
      const id = crypto.randomUUID();
      // Confirmation to user
      const userPromise = supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "trek-enquiry",
          recipientEmail: parsed.data.email,
          idempotencyKey: `enquiry-user-${id}`,
          templateData: { name: parsed.data.name, trekName: parsed.data.trekName, budget: parsed.data.budget },
        },
      });
      // Notification to admin
      const adminPromise = supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "trek-enquiry-admin",
          recipientEmail: "aryan099@gmail.com",
          idempotencyKey: `enquiry-admin-${id}`,
          templateData: {
            name: parsed.data.name,
            email: parsed.data.email,
            trekName: parsed.data.trekName,
            budget: parsed.data.budget,
            message: parsed.data.message || "",
          },
        },
      });
      const [userRes, adminRes] = await Promise.all([userPromise, adminPromise]);
      if (adminRes.error) throw adminRes.error;
      setDone(true);
      toast.success("Enquiry sent! We'll be in touch soon. 🏔️");
    } catch (err: any) {
      console.error("Enquiry failed", err);
      toast.error("Could not send enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-trek-moss/30 bg-trek-moss/5 p-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-trek-moss mx-auto mb-3" />
        <h3 className="font-display text-lg font-semibold mb-1">Enquiry sent!</h3>
        <p className="text-sm text-muted-foreground">Our team will reply within 24 hours. Check your inbox for confirmation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${compact ? "" : "rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-sm"}`}>
      {!compact && (
        <div className="mb-2">
          <h3 className="font-display text-lg font-semibold">Enquire about this trek</h3>
          <p className="text-xs text-muted-foreground">Get a personalised itinerary in 24 hours.</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={100}
          className="px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm" />
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" maxLength={255}
          className="px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm" />
      </div>
      {trekOptions ? (
        <select required value={trekName} onChange={(e) => setTrekName(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm">
          <option value="">Select a trek…</option>
          {trekOptions.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      ) : (
        <input type="text" required value={trekName} onChange={(e) => setTrekName(e.target.value)} placeholder="Trek name" maxLength={200}
          className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm" />
      )}
      <input type="text" required value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Your budget (e.g. ₹50,000)" maxLength={50}
        className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm" />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Any questions or special requests? (optional)" maxLength={1000} rows={3}
        className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm resize-none" />
      <button type="submit" disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full trek-gradient text-primary-foreground text-sm font-medium shadow hover:shadow-md active:scale-[0.98] disabled:opacity-50 transition-all">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {submitting ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
};

export default EnquiryForm;
