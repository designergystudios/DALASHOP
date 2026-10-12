import React, { useState, useEffect, useRef } from 'react';
import { ImageOff, Sparkles, Eye } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string; // e.g., 'aspect-[4/3]' or 'aspect-video'
  priority?: boolean;
  categoryBadge?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-[4/3]',
  priority = false,
  categoryBadge,
}) => {
  const { isLowDataMode } = useAppStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [inView, setInView] = useState(priority);
  const [forceLoadInLowData, setForceLoadInLowData] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || inView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '150px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority, inView]);

  // If low data mode is active and user hasn't explicitly tapped to reveal, show lightweight vector preview
  const showLowDataPlaceholder = isLowDataMode && !forceLoadInLowData && !priority;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-slate-900 ${aspectRatio} ${className}`}
    >
      {/* Low-data mode vector visual placeholder */}
      {showLowDataPlaceholder ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-800/80">
          <div className="w-9 h-9 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-2">
            <Sparkles className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-xs font-semibold text-slate-200 line-clamp-1 max-w-[85%]">{alt}</p>
          <p className="text-[10px] text-amber-400/90 mt-0.5">Low-Data Saver Active</p>
          <button
            onClick={() => setForceLoadInLowData(true)}
            className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-md border border-slate-700 transition active:scale-95"
          >
            <Eye className="w-3 h-3 text-orange-400" />
            <span>Load Media (~120KB)</span>
          </button>
        </div>
      ) : (
        <>
          {/* Skeleton Shimmer while loading */}
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 bg-slate-800/80 animate-pulse">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-slate-700/30 to-transparent animate-shimmer" />
            </div>
          )}

          {/* Actual Image when inView */}
          {inView && !hasError && (
            <img
              src={src}
              alt={alt}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              className={`h-full w-full object-cover transition-opacity duration-500 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Graceful Fallback on Offline/Network Failure */}
          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-slate-900 text-slate-400">
              <ImageOff className="w-6 h-6 text-slate-500 mb-1" />
              <span className="text-[11px] font-medium text-slate-400 line-clamp-1">{alt}</span>
              <span className="text-[10px] text-slate-500">Asset cached locally</span>
            </div>
          )}
        </>
      )}

      {/* Subtle Category Watermark */}
      {categoryBadge && (
        <span className="absolute top-2 left-2 z-10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md rounded border border-white/10">
          {categoryBadge}
        </span>
      )}
    </div>
  );
};
