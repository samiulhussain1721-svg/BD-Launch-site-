import React, { useEffect, useRef, useState } from 'react';

/**
 * BRACELET SCROLL ENGINE CONFIGURATION
 * Pure scroll-bound cinematic diamond bracelet animation.
 * Strictly clamped between 0:00 and 0:08 (8.0 seconds total).
 * All-intra keyframe video for 60fps instant seek with zero decoder latency.
 */
export interface BraceletConfig {
  videoSrc: string;
  videoDuration: number; // 8.0 seconds strict scroll timeline
}

const BASE_URL = import.meta.env.BASE_URL || '/';
const cleanBase = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;

export const DEFAULT_BRACELET_CONFIG: BraceletConfig = {
  videoSrc: `${cleanBase}videos/Ultra_detailed_cinematic_still.mp4`,
  videoDuration: 8.0,
};

// Editorial scroll milestones mapped to page progress (0.00 to 1.00)
export const SCROLL_MILESTONES = [
  {
    id: 'hero',
    name: 'Floating Entry',
    time: '0:00',
    progress: 0.0,
    sectionId: 'hero-section',
    description: 'Cinematic bracelet enters diagonally, weightlessly rotating in deep obsidian space as gold and diamonds shimmer.',
  },
  {
    id: 'philosophy',
    name: 'Prismatic S-Curve',
    time: '0:02.0',
    progress: 0.25,
    sectionId: 'about',
    description: 'Curves behind bespoke philosophy cards, catching glancing light across brilliant-cut diamonds.',
  },
  {
    id: 'macro-clasp',
    name: 'Macro Pavé & Clasp',
    time: '0:04.5',
    progress: 0.50,
    sectionId: 'rings',
    description: 'Macro focal zoom highlighting four-prong basket setting, safety catch, and articulated links.',
  },
  {
    id: 'wrist-drape',
    name: 'Articulated Drape',
    time: '0:06.5',
    progress: 0.75,
    sectionId: 'sizing',
    description: 'Organic drape contour, demonstrating link flexibility and gravity drape around the wrist.',
  },
  {
    id: 'eternity-loop',
    name: 'Eternity Resting Loop',
    time: '0:08.0',
    progress: 1.0,
    sectionId: 'hub',
    description: 'Closes into a majestic radiant circle framing the bespoke consultation commission CTA.',
  },
];

interface ScrollDiamondBraceletProps {
  onMilestoneChange?: (milestoneIndex: number) => void;
}

export const ScrollDiamondBracelet: React.FC<ScrollDiamondBraceletProps> = ({
  onMilestoneChange,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const targetTimeRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Check video ready state on mount and attach listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markReady = () => {
      setIsVideoReady(true);
      if (video.currentTime === 0) {
        try {
          video.currentTime = 0.001;
        } catch {
          // ignore seek restriction
        }
      }
    };

    if (video.readyState >= 1) {
      markReady();
    }

    video.addEventListener('loadedmetadata', markReady);
    video.addEventListener('loadeddata', markReady);
    video.addEventListener('canplay', markReady);

    return () => {
      video.removeEventListener('loadedmetadata', markReady);
      video.removeEventListener('loadeddata', markReady);
      video.removeEventListener('canplay', markReady);
    };
  }, []);

  // Synchronize target video timestamp strictly with user scroll position
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollElement = document.scrollingElement || document.documentElement || document.body;
          const totalHeight = Math.max(1, scrollElement.scrollHeight - window.innerHeight);
          const scrollY = window.scrollY || window.pageYOffset || scrollElement.scrollTop || 0;
          const current = Math.max(0, Math.min(1, scrollY / totalHeight));

          // Clamp target time strictly between 0.0s and 8.0s
          targetTimeRef.current = Math.max(0, Math.min(DEFAULT_BRACELET_CONFIG.videoDuration, current * DEFAULT_BRACELET_CONFIG.videoDuration));

          // Calculate current milestone
          let activeIndex = 0;
          for (let i = SCROLL_MILESTONES.length - 1; i >= 0; i--) {
            if (current >= SCROLL_MILESTONES[i].progress - 0.08) {
              activeIndex = i;
              break;
            }
          }

          if (onMilestoneChange) {
            onMilestoneChange(activeIndex);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [onMilestoneChange]);

  // High-performance RAF scroll-scrub loop: seeks smoothly without decoder stutter
  useEffect(() => {
    let isRunning = true;

    const updateVideoFrame = () => {
      if (!isRunning) return;

      const video = videoRef.current;
      if (video && isVideoReady) {
        const target = targetTimeRef.current;
        const diff = target - video.currentTime;

        if (Math.abs(diff) > 0.003) {
          if (Math.abs(diff) > 0.6) {
            // Rapid fast scroll: jump directly to stay in sync with user
            video.currentTime = target;
          } else if (!video.seeking) {
            // Smooth progressive tracking
            video.currentTime += diff * 0.4;
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(updateVideoFrame);
    };

    animFrameIdRef.current = requestAnimationFrame(updateVideoFrame);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isVideoReady]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 bg-[#080C0E]"
    >
      {/* 1. Deep Obsidian Studio Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#080C0E]/30 to-[#080C0E]/90 pointer-events-none" />

      {/* 2. Subtle Luxury Atelier Geometric Micro-grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(236,229,218,0.5) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* 3. Pure Scroll-Bound Cinematic Video Viewport */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          src={DEFAULT_BRACELET_CONFIG.videoSrc}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onLoadedMetadata={(e) => {
            setIsVideoReady(true);
            try {
              e.currentTarget.currentTime = 0.001;
            } catch {
              // ignore initial seek restriction
            }
          }}
          onLoadedData={() => setIsVideoReady(true)}
          onCanPlay={() => setIsVideoReady(true)}
          className="w-full h-full object-cover object-center filter brightness-95 contrast-110 saturate-105"
        >
          <source src={DEFAULT_BRACELET_CONFIG.videoSrc} type="video/mp4" />
          <source src={`${cleanBase}videos/bracelet_scroll_all_intra.mp4`} type="video/mp4" />
        </video>
        {/* Soft luxury atelier overlay blend for maximum typography contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080C0E]/75 via-[#080C0E]/45 to-[#080C0E]/80 mix-blend-multiply pointer-events-none" />
      </div>
    </div>
  );
};
