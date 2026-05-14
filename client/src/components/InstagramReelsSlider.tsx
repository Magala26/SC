import { Instagram } from 'lucide-react';
import { homepageSliderImages } from '@/data/sneakercareImages';

export default function InstagramReelsSlider() {
  return (
    <div className="w-full">
      <div
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pt-4 hide-scrollbar px-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {homepageSliderImages.map((image, index) => (
          <article
            key={image.id}
            className="flex-none snap-center w-[286px] sm:w-[326px] group"
          >
            <div className="relative overflow-hidden rounded-[1.75rem] bg-white border border-blue-100 shadow-[0_24px_60px_rgba(15,23,42,0.14)] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_34px_70px_rgba(37,99,235,0.20)]">
              <div className="absolute inset-x-0 top-0 z-10 h-1.5 bg-gradient-to-r from-blue-600 via-[#bf616a] to-[#0b0d12]" />
              <div className="relative aspect-[9/16] overflow-hidden bg-blue-50">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading={index < 3 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute left-4 right-4 bottom-4 text-white">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur-md">
                    <Instagram size={13} />
                    Sneaker Care
                  </div>
                  <h3 className="text-xl font-black leading-tight text-white drop-shadow-sm">
                    {image.caption}
                  </h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
                    Studio Work #{String(index + 1).padStart(2, '0')}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
