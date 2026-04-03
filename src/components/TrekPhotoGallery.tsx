import { useState } from "react";
import { Camera, Mountain } from "lucide-react";
import PhotoLightbox from "./PhotoLightbox";

interface TrekPhotoGalleryProps {
  photos: string[];
  trekName: string;
}

export default function TrekPhotoGallery({ photos, trekName }: TrekPhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-[#111e16] to-[#0c1f13] flex items-center justify-center">
        <svg viewBox="0 0 400 200" className="w-full max-w-md opacity-10" fill="currentColor" preserveAspectRatio="none">
          <polygon points="0,200 60,80 120,130 180,50 240,110 300,30 360,90 400,60 400,200" />
          <polygon points="0,200 80,120 160,160 240,100 320,140 400,200" opacity="0.5" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground/30">
          <Mountain className="w-12 h-12 mb-2" />
          <span className="text-sm font-medium">{trekName}</span>
        </div>
      </div>
    );
  }

  const mainPhoto = photos[0];
  const thumbs = photos.slice(1, 3);

  return (
    <>
      <div className="relative w-full rounded-2xl overflow-hidden mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 aspect-[21/9] md:aspect-auto md:h-[360px]">
          {/* Main large image */}
          <button
            onClick={() => setLightboxIndex(0)}
            className="md:col-span-2 relative overflow-hidden group cursor-pointer"
            aria-label={`View ${trekName} photo 1`}
          >
            <img
              src={mainPhoto}
              alt={`${trekName} main view`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="eager"
              width={800}
              height={360}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Right column thumbnails */}
          <div className="hidden md:flex flex-col gap-1.5">
            {thumbs.map((photo, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i + 1)}
                className="relative flex-1 overflow-hidden group cursor-pointer"
                aria-label={`View ${trekName} photo ${i + 2}`}
              >
                <img
                  src={photo}
                  alt={`${trekName} view ${i + 2}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  width={400}
                  height={175}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
            {thumbs.length < 2 && (
              <div className="flex-1 bg-[#111e16] flex items-center justify-center">
                <Mountain className="w-8 h-8 text-foreground/10" />
              </div>
            )}
          </div>
        </div>

        {/* View all photos button */}
        {photos.length > 3 && (
          <button
            onClick={() => setLightboxIndex(0)}
            className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium hover:bg-black/80 transition-colors"
            aria-label="View all photos"
          >
            <Camera className="w-3.5 h-3.5" />
            View all {photos.length} photos
          </button>
        )}
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
