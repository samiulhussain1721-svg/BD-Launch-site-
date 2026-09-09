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

  // Initialise video in paused state: animation ONLY moves as the user scrolls
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markReady = () => {
      video.pause();
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

  // Synchronise target video timestamp strictly with user scroll position, looping continuously across cycles
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollElement = document.scrollingElement || document.documentElement || document.body;
          // Responsive track height per complete loop cycle (e.g. 1.6x viewport height)
          const responsiveTrackHeight = Math.max(window.innerHeight * 1.6, 900);
          const scrollY = window.scrollY || window.pageYOffset || scrollElement.scrollTop || 0;
          
          // Modulo wrap so scrolling through the page continuously re-loops the animation seamlessly
          const cycleProgress = ((scrollY / responsiveTrackHeight) % 1.0 + 1.0) % 1.0;
          const totalDuration = DEFAULT_BRACELET_CONFIG.videoDuration;

          // Target time is strictly tied to scroll progress; clamps slightly before EOF to ensure smooth loop
          targetTimeRef.current = cycleProgress * (totalDuration - 0.02);

          // Calculate current milestone across continuous loops
          let activeIndex = 0;
          for (let i = SCROLL_MILESTONES.length - 1; i >= 0; i--) {
            if (cycleProgress >= SCROLL_MILESTONES[i].progress - 0.08) {
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

  // High-performance RAF scroll-scrub loop: strictly advances only when user scrolls, looping continuously
  useEffect(() => {
    let isRunning = true;
    const LERP_FACTOR = 0.28; // Snappy, responsive tracking of user scroll
    const totalDuration = DEFAULT_BRACELET_CONFIG.videoDuration;

    const updateVideoFrame = () => {
      if (!isRunning) return;

      const video = videoRef.current;
      if (video && isVideoReady) {
        // Ensure video is never auto-playing; it only advances through explicit scrub
        if (!video.paused) {
          video.pause();
        }

        const target = targetTimeRef.current;
        let diff = target - video.currentTime;

        // Seamless periodic boundary wrapping across 0s <-> 8s loop
        if (diff > totalDuration / 2) diff -= totalDuration;
        if (diff < -totalDuration / 2) diff += totalDuration;

        // Only update frame position when user has scrolled and there is a difference
        if (Math.abs(diff) > 0.003) {
          if (Math.abs(diff) > 1.5) {
            // Large jump (rapid swipe, anchor link jump): seek directly to stay in sync
            video.currentTime = Math.max(0.001, Math.min(totalDuration - 0.02, target));
          } else if (!video.seeking) {
            // Smooth progressive tracking with boundary wrap
            let nextTime = video.currentTime + diff * LERP_FACTOR;
            if (nextTime >= totalDuration) nextTime -= totalDuration;
            if (nextTime < 0) nextTime += totalDuration;
            video.currentTime = Math.max(0.001, Math.min(totalDuration - 0.02, nextTime));
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

      {/* 3. Pure Cinematic Scroll-Driven Video Viewport */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          src={DEFAULT_BRACELET_CONFIG.videoSrc}
          muted
          playsInline
          {...{ 'webkit-playsinline': 'true' }}
          preload="auto"
          disablePictureInPicture
          onLoadedMetadata={(e) => {
            setIsVideoReady(true);
            try {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0.001;
            } catch {
              // ignore initial restriction
            }
          }}
          onLoadedData={(e) => {
            setIsVideoReady(true);
            e.currentTarget.pause();
          }}
          onCanPlay={(e) => {
            setIsVideoReady(true);
            e.currentTarget.pause();
          }}
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
