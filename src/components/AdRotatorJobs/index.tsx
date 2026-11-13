import React, { useEffect, useRef, useState } from "react";
import { ContentModel } from "@/core/models/content/contentModel";
import { mediaUrl } from "@/core/services/apiConfig";

type AdRotatorProps = {
  items: ContentModel[];
  intervalMs?: number;
  className?: string;
  pauseOnHover?: boolean;
  showDescription?: boolean;
};

const AdRotator: React.FC<AdRotatorProps> = ({
  items,
  intervalMs = 3000,
  className = "",
  pauseOnHover = true,
  showDescription = false
}) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  const len = items?.length ?? 0;
  const hasMultiple = len > 1;

  const clampIndex = (i: number) => ((i % len) + len) % len;

  const next = () => hasMultiple && setIndex((i) => clampIndex(i + 1));
  const prev = () => hasMultiple && setIndex((i) => clampIndex(i - 1));

  useEffect(() => {
    if (!hasMultiple || paused) return;
    timerRef.current && window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(next, intervalMs) as unknown as number;
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [intervalMs, index, paused, hasMultiple]);

  if (!len) {
    return (
      <div className={`w-80 rounded-xl border border-white/10 bg-neutral-900/50 p-4 text-sm text-gray-400 ${className}`}>
        Gösterilecek içerik bulunamadı.
      </div>
    );
  }

  const item = items[index];

  const shortHost = (() => {
    try { return new URL(item.link).host.replace(/^www\./, ""); } catch { return item.link; }
  })();

  return (
    <div
      className={[
        "relative w-75 select-none overflow-hidden rounded-xl border border-white/10",
        "bg-neutral-900/60 shadow-lg backdrop-blur",
        className
      ].join(" ")}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
      role="region"
      aria-label="Reklam rotator"
    >
      <div className="relative h-44 w-full bg-black/20">
        <img
          src={mediaUrl(item.imageURL)}
          alt={item.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />

        {hasMultiple && (
          <>
            {/* Sol ok (Önceki) */}
            <button
              aria-label="Önceki"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60 transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                {/* chevron_left */}
                <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>

            {/* Sağ ok (Sonraki) */}
            <button
              aria-label="Sonraki"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60 transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                {/* chevron_right */}
                <path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" />
              </svg>
            </button>
          </>
        )}


        {hasMultiple && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={[
                  "h-1.5 w-1.5 rounded-full transition",
                  i === index ? "bg-white" : "bg-white/40 hover:bg-white/70"
                ].join(" ")}
              />
            ))}
          </div>
        )}
      </div>
      <div className="space-y-1 p-3 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-b-xl">
        <div className="truncate text-sm font-semibold text-white">{item.title}</div>

        {showDescription && (
          <p className="line-clamp-2 text-xs text-gray-200">{item.description}</p>
        )}

        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs 
               text-indigo-300 hover:text-purple-300 hover:underline 
               transition-colors"
        >
          {shortHost}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            className="inline-block"
          >
            <path
              fill="currentColor"
              d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14z"
            />
            <path
              fill="currentColor"
              d="M5 5h5V3H3v7h2z"
            />
          </svg>
        </a>
      </div>

    </div>
  );
};

export default AdRotator;
