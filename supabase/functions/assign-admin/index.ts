import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" } });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const { email } = await req.json();
  
  // Find user by email
  const { data: userData } = await supabase.auth.admin.listUsers();
  const targetUser = userData?.users?.find((u: any) => u.email === email);
  
  if (!targetUser) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  }

  const { error } = await supabase.from("user_roles").upsert({ user_id: targetUser.id, role: "admin" }, { onConflict: "user_id,role" });

  return new Response(JSON.stringify({ success: !error, user_id: targetUser.id }), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
});
