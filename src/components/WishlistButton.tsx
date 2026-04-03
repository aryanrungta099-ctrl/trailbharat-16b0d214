import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  isWishlisted: boolean;
  onClick: () => void;
  className?: string;
  size?: "sm" | "md";
}

export default function WishlistButton({ isWishlisted, onClick, className, size = "sm" }: WishlistButtonProps) {
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const btnSize = size === "sm" ? "w-8 h-8" : "w-10 h-10";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        btnSize,
        "rounded-full flex items-center justify-center transition-all active:scale-90",
        isWishlisted
          ? "bg-accent/20 text-accent"
          : "bg-foreground/5 text-foreground/30 hover:text-accent hover:bg-accent/10",
        className
      )}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={cn(iconSize, isWishlisted && "fill-current")} />
    </button>
  );
}
