import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Search, Compass, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { HERO_SLIDES } from '../../store/mockData';
import { useAppStore } from '../../store/useAppStore';

interface HeroImageCarouselProps {
  onExploreDistrict?: (districtId: string) => void;
}

export const HeroImageCarousel: React.FC<HeroImageCarouselProps> = ({ onExploreDistrict }) => {
  const { searchQuery, setSearchQuery, setSelectedDistrictId, heroSlides } = useAppStore();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const slides = heroSlides && heroSlides.length > 0 ? heroSlides : HERO_SLIDES;

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentSlideIndex];

  const handleCtaClick = () => {
    setSelectedDistrictId(currentSlide.districtId);
    if (onExploreDistrict) {
      onExploreDistrict(currentSlide.districtId);
    }
  };

  return (
    <div
      className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200/90 group"
      onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStart === null) return;
        const diff = touchStart - e.changedTouches[0].clientX;
        if (diff > 50) handleNext();
        if (diff < -50) handlePrev();
        setTouchStart(null);
      }}
    >
      {/* Background Slides with Cross-Fade */}
      <div className="relative min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] w-full overflow-hidden bg-stone-950 flex items-center">
        {slides.map((slide, index) => {
          const isActive = index === currentSlideIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
              style={{ transition: 'opacity 1s ease-in-out, transform 8s ease-out' }}
            >
              <img
                src={slide.backgroundImage}
                alt={slide.title}
                className="w-full h-full object-cover object-center filter brightness-[0.62] contrast-[1.08]"
              />
              {/* Cinematic Multilayer Gradients for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/30 to-transparent" />
            </div>
          );
        })}

        {/* Foreground Content */}
        <div className="relative z-10 max-w-4xl px-6 sm:px-12 py-10 space-y-4 text-white">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm border border-white/20 backdrop-blur-md"
              style={{
                backgroundColor: `${currentSlide.accentColor}cc`,
                color: '#ffffff',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentSlide.highlightKicker}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/10 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentSlide.badge}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-[1.1] max-w-2xl drop-shadow-md text-white">
            {currentSlide.title}
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-stone-200 max-w-xl leading-relaxed drop-shadow">
            {currentSlide.subtitle}
          </p>

          {/* Quick Action Button & Street Search */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-lg">
            <button
              onClick={handleCtaClick}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-950/40 transition active:scale-95 group/btn"
            >
              <span>{currentSlide.ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>

            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stalls, coffee, stays, crafts..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/95 text-stone-900 placeholder-stone-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-md backdrop-blur-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-stone-400 hover:text-stone-800"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute bottom-5 right-5 sm:right-10 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
        {/* Play / Pause Toggle */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          className="p-1 rounded-full text-stone-300 hover:text-white transition"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {/* Previous Button */}
        <button
          onClick={handlePrev}
          title="Previous slide"
          className="p-1 rounded-full text-stone-300 hover:text-white transition active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Slide Counter / Indicators */}
        <div className="flex items-center gap-1.5 px-1">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlideIndex
                  ? 'w-6 bg-amber-400 shadow-sm'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          title="Next slide"
          className="p-1 rounded-full text-stone-300 hover:text-white transition active:scale-95"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Line Bar on Active Slide */}
      {isPlaying && (
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 overflow-hidden z-20">
          <div
            key={currentSlideIndex}
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 animate-[progress_6s_linear]"
            style={{ width: '100%', animation: 'progressBar 6s linear' }}
          />
        </div>
      )}
    </div>
  );
};
