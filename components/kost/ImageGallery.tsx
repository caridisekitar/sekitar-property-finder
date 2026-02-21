import { useState, useMemo } from "react";
import { X, Play, ChevronLeft, ChevronRight } from "lucide-react";

type ImageGalleryProps = {
  images: string[];
  videoPoster?: string;
  videoURL?: string;
};

export default function ImageGallery({
  images,
  videoPoster,
  videoURL
}: ImageGalleryProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);


  // ✅ safe images
  const galleryImages = useMemo(
    () => (images && images.length > 0 ? images : []),
    [images]
  );

  if (galleryImages.length === 0) return null;

  const nextSlide = () => {
  setImageLoading(true);
  setActiveIndex((prev) => (prev + 1) % galleryImages.length);
};

const prevSlide = () => {
  setImageLoading(true);
  setActiveIndex(
    (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
  );
};

  return (
    <>
      {/* Gallery Wrapper */}
      <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden h-[350px]">
        {/* VIDEO POSTER */}
        <div
          className="relative col-span-1 cursor-pointer group h-[350px]"
          onClick={() => setShowVideo(true)}
        >
          <img
            src={videoPoster ?? "/images/video-poster.webp"}
            className="object-cover h-full w-full"
            alt="Video preview"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition">
            <Play className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* IMAGE CAROUSEL */}
        <div className="relative col-span-2 h-[350px]">
          {/* Loading Spinner */}
            {imageLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}

            <img
              src={galleryImages[activeIndex]}
              className={`object-cover h-full w-full cursor-pointer transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              alt={`Gallery ${activeIndex + 1}`}
              onLoad={() => setImageLoading(false)}   // ✅ SAFE
              onError={() => setImageLoading(false)}  // ✅ SAFE
              onClick={() => setShowImage(true)}
            />

          {/* Controls */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-2 rounded-full text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-2 rounded-full text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {galleryImages.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === activeIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* VIDEO MODAL */}
      {showVideo && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="relative bg-black rounded-xl w-full max-w-sm aspect-[9/16]">
            <button
              className="absolute top-2 right-2 text-white bg-black/50 p-2 rounded-full"
              onClick={() => setShowVideo(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <iframe
              className="w-full h-full rounded-xl"
              src={videoURL}
              title="Kos Video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* IMAGE MODAL */}
      {showImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowImage(false)}
        >
          <div className="relative">
            <button
              className="absolute top-3 right-3 text-white bg-black/50 p-2 rounded-full"
              onClick={() => setShowImage(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={galleryImages[activeIndex]}
              alt="Preview"
              className="h-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
