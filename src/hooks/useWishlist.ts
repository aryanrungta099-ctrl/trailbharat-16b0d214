import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useWishlist() {
  const { user } = useAuth();
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setWishlistedIds(new Set());
      return;
    }
    setLoading(true);
    supabase
      .from("wishlisted_treks")
      .select("trek_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setWishlistedIds(new Set(data.map((d) => d.trek_id)));
        setLoading(false);
      });
  }, [user]);

  const toggleWishlist = useCallback(
    async (trekId: string) => {
      if (!user) {
        toast("Sign in to save treks to your wishlist", {
          action: { label: "Sign In", onClick: () => window.location.assign("/auth") },
        });
        return;
      }

      const isWishlisted = wishlistedIds.has(trekId);

      // Optimistic update
      setWishlistedIds((prev) => {
        const next = new Set(prev);
        if (isWishlisted) next.delete(trekId);
        else next.add(trekId);
        return next;
      });

      if (isWishlisted) {
        const { error } = await supabase
          .from("wishlisted_treks")
          .delete()
          .eq("user_id", user.id)
          .eq("trek_id", trekId);
        if (error) {
          // Revert
          setWishlistedIds((prev) => new Set([...prev, trekId]));
          toast.error("Failed to remove from wishlist");
        }
      } else {
        const { error } = await supabase
          .from("wishlisted_treks")
          .insert({ user_id: user.id, trek_id: trekId });
        if (error) {
          // Revert
          setWishlistedIds((prev) => {
            const next = new Set(prev);
            next.delete(trekId);
            return next;
          });
          toast.error("Failed to add to wishlist");
        } else {
          toast.success("Trek saved to wishlist!");
        }
      }
    },
    [user, wishlistedIds]
  );

  return { wishlistedIds, toggleWishlist, loading };
}
