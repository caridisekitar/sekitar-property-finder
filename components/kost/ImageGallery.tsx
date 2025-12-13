import { useState } from "react";
import { X, Play, ChevronLeft, ChevronRight } from "lucide-react";

const galleryImages = [
  `https://picsum.photos/seed/1/400/300`,
  `https://picsum.photos/seed/2/400/300`,
  `https://picsum.photos/seed/3/400/300`,
  `https://picsum.photos/seed/4/400/300`,
];

export default function ImageGallery() {
  const [showVideo, setShowVideo] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () =>
    setActiveIndex((prev) => (prev + 1) % galleryImages.length);

  const prevSlide = () =>
    setActiveIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );

  return (
    <>
      {/* Gallery Wrapper */}
      <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden">
        {/* video image poster, clickable into modal popup show youtube video link */}
        <div
          className="relative col-span-1 cursor-pointer group"
          onClick={() => setShowVideo(true)}
        >
          <img
            src="/images/video-poster.webp"
            className="object-cover h-full w-full"
            alt="Video preview"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition">
            <Play className="w-12 h-12 text-white" />
          </div>
        </div>
        {/* end of video image */}

        {/* start gallery carousel */}
        <div className="relative col-span-2">
          <img
            src={galleryImages[activeIndex]}
            className="object-cover h-full w-full cursor-pointer"
            alt="Gallery"
            onClick={() => setShowImage(true)}
          />

          {/* Controls */}
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
        {/* end gallery carousel */}
      </div>

      {/* VIDEO MODAL */}
      {showVideo && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="relative bg-black rounded-xl w-full max-w-3xl aspect-video">
            <button
              className="absolute -top-10 right-0 text-white"
              onClick={() => setShowVideo(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <iframe
              className="w-full h-full rounded-xl"
              src="https://www.youtube.com/embed/6yhkkaGdkpg?autoplay=1"
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
          <div className="relative max-w-5xl w-full">
            <button
              className="absolute -top-10 right-0 text-white"
              onClick={() => setShowImage(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={galleryImages[activeIndex]}
              alt="Preview"
              className="w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
