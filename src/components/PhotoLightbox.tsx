import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoLightboxProps {
  photos: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function PhotoLightbox({ photos, currentIndex, onClose, onNavigate }: PhotoLightboxProps) {
  const goNext = useCallback(() => {
    onNavigate((currentIndex + 1) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  const goPrev = useCallback(() => {
    onNavigate((currentIndex - 1 + photos.length) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-in fade-in duration-200" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-white hover:bg-foreground/20 transition-colors" aria-label="Close lightbox">
        <X className="w-5 h-5" />
      </button>

      <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute left-4 z-10 w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center text-white hover:bg-foreground/20 transition-colors" aria-label="Previous photo">
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute right-4 z-10 w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center text-white hover:bg-foreground/20 transition-colors" aria-label="Next photo">
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="max-w-5xl max-h-[85vh] w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <img
          src={photos[currentIndex]}
          alt={`Photo ${currentIndex + 1} of ${photos.length}`}
          className="w-full h-full object-contain rounded-lg animate-in fade-in duration-300"
          key={currentIndex}
        />
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-foreground/10 backdrop-blur-sm text-white text-sm font-medium">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  );
}
