import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Sparkles, MessageCircle, Eye, RefreshCw, Volume2, VolumeX, Maximize2, Gem } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

interface VideoReel {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  videoSrc: string;
  poster: string;
  description: string;
  tag: string;
}

const CINEMATIC_REELS: VideoReel[] = [
  {
    id: 'dispersion',
    title: '4K Diamond Light Fire',
    subtitle: 'Optical Caustic Dispersion',
    duration: '0:18 Loop',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    poster: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    description: 'Ultra-HD macro refraction capturing 57-facet rainbow light return and optical scintillation under studio spot illumination.',
    tag: 'Optical Scintillation',
  },
  {
    id: 'benchwork',
    title: 'Jewellery Quarter Atelier',
    subtitle: 'Hand Claw Mounting & Setting',
    duration: '0:15 Loop',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    poster: 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&w=1200&q=85',
    description: 'Master goldsmiths precision-seating bespoke IGI diamonds in solid 950 Platinum and 18k Fairmined Gold.',
    tag: 'Hand Craftsmanship',
  },
  {
    id: 'loupe',
    title: '40x Gemmological Loupe',
    subtitle: 'IGI Symmetry & Hearts & Arrows',
    duration: '0:12 Loop',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    poster: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
    description: 'Microscopic inspection verifying flawless table ratios, laser inscriptions, and clean clarity grades.',
    tag: 'IGI Authenticated',
  },
];

export const CinematicDiamondShowcase: React.FC = () => {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [viewMode, setViewMode] = useState<'video' | 'interactive-3d'>('video');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [caratSize, setCaratSize] = useState(2.0);
  const [isHovered, setIsHovered] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const currentReel = CINEMATIC_REELS[activeReelIndex];

  // Handle Reel Switch
  const handleSelectReel = (index: number) => {
    setActiveReelIndex(index);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Interactive 3D Canvas Diamond Raymarching Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const scale = (caratSize / 2.0) * 85;

      angle += 0.015;
      setRotationAngle(Math.round(((angle % (Math.PI * 2)) / (Math.PI * 2)) * 360));

      // Draw glowing radial caustic halo
      const grad = ctx.createRadialGradient(cx, cy, scale * 0.2, cx, cy, scale * 1.8);
      grad.addColorStop(0, 'rgba(236, 229, 218, 0.25)');
      grad.addColorStop(0.4, 'rgba(180, 225, 245, 0.12)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // 3D Diamond Facet Vertices
      const topY = cy - scale * 0.7;
      const girdleY = cy - scale * 0.1;
      const culetY = cy + scale * 0.9;
      const numFacets = 8;

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(236, 229, 218, 0.85)';

      const tableRadius = scale * 0.55;
      const girdleRadius = scale * 0.95;

      // Draw Top Table Facet
      ctx.beginPath();
      for (let i = 0; i < numFacets; i++) {
        const theta = angle + (i * Math.PI * 2) / numFacets;
        const px = cx + Math.cos(theta) * tableRadius;
        const py = topY + Math.sin(theta) * (tableRadius * 0.35);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fill();
      ctx.stroke();

      // Draw Crown & Pavilion Facets
      for (let i = 0; i < numFacets; i++) {
        const theta = angle + (i * Math.PI * 2) / numFacets;
        const nextTheta = angle + ((i + 1) * Math.PI * 2) / numFacets;

        const tx1 = cx + Math.cos(theta) * tableRadius;
        const ty1 = topY + Math.sin(theta) * (tableRadius * 0.35);

        const gx1 = cx + Math.cos(theta) * girdleRadius;
        const gy1 = girdleY + Math.sin(theta) * (girdleRadius * 0.35);

        const gx2 = cx + Math.cos(nextTheta) * girdleRadius;
        const gy2 = girdleY + Math.sin(nextTheta) * (girdleRadius * 0.35);

        // Crown triangles
        ctx.beginPath();
        ctx.moveTo(tx1, ty1);
        ctx.lineTo(gx1, gy1);
        ctx.lineTo(gx2, gy2);
        ctx.closePath();
        ctx.fillStyle = i % 2 === 0 ? 'rgba(236, 229, 218, 0.08)' : 'rgba(200, 235, 255, 0.12)';
        ctx.fill();
        ctx.stroke();

        // Pavilion lines to Culet
        ctx.beginPath();
        ctx.moveTo(gx1, gy1);
        ctx.lineTo(cx, culetY);
        ctx.stroke();
      }

      // Sparkle flashes on corners
      const sparkleIndex = Math.floor(Math.sin(angle * 3) * 4 + 4) % numFacets;
      const sparkTheta = angle + (sparkleIndex * Math.PI * 2) / numFacets;
      const sx = cx + Math.cos(sparkTheta) * girdleRadius;
      const sy = girdleY + Math.sin(sparkTheta) * (girdleRadius * 0.35);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.shadowColor = 'rgba(236, 229, 218, 1)';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(sx, sy, 4, 0, Math.PI * 2);
      ctx.fill();

      // Prismatic cross flare
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.moveTo(sx - 14, sy);
      ctx.lineTo(sx + 14, sy);
      ctx.moveTo(sx, sy - 14);
      ctx.lineTo(sx, sy + 14);
      ctx.stroke();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [caratSize]);

  return (
    <div className="w-full my-12 relative z-20">
      <div className="max-w-5xl mx-auto rounded-xs border border-white/15 bg-[#10191D]/85 backdrop-blur-xl shadow-2xl overflow-hidden">
        
        {/* Top Control Ribbon */}
        <div className="px-5 py-3.5 border-b border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ECE5DA] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#ECE5DA] font-semibold">
              Cinematic Atelier Film &bull; 4K Scintillation
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2">
            <div className="inline-flex p-0.5 rounded-xs bg-[#172227] border border-white/10 text-[10px] font-mono uppercase">
              <button
                onClick={() => setViewMode('video')}
                className={`px-3 py-1 rounded-xs transition-all cursor-pointer ${
                  viewMode === 'video'
                    ? 'bg-[#ECE5DA] text-[#10191D] font-medium'
                    : 'text-[#E2E8F0]/70 hover:text-white'
                }`}
              >
                Cinema Reel
              </button>
              <button
                onClick={() => setViewMode('interactive-3d')}
                className={`px-3 py-1 rounded-xs transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'interactive-3d'
                    ? 'bg-[#ECE5DA] text-[#10191D] font-medium'
                    : 'text-[#E2E8F0]/70 hover:text-white'
                }`}
              >
                <Gem className="w-3 h-3" />
                <span>3D Ray Facets</span>
              </button>
            </div>
          </div>
        </div>

        {/* Video / 3D Canvas Centre Stage */}
        <div
          className="relative aspect-video sm:aspect-21/9 max-h-[480px] w-full bg-black overflow-hidden group cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={viewMode === 'video' ? togglePlay : undefined}
        >
          {viewMode === 'video' ? (
            <>
              {/* High-Definition HTML5 Video */}
              <video
                ref={videoRef}
                key={currentReel.videoSrc}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                poster={currentReel.poster}
                className="w-full h-full object-cover object-center filter brightness-95 contrast-110"
              >
                <source src={currentReel.videoSrc} type="video/mp4" />
              </video>

              {/* Cinematic Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#10191D] via-transparent to-black/30 pointer-events-none" />

              {/* Reel Info Overlays */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 pointer-events-none max-w-md">
                <span className="px-2.5 py-1 bg-[#10191D]/85 backdrop-blur-xs border border-[#ECE5DA]/40 text-[9px] font-mono text-[#ECE5DA] uppercase tracking-widest rounded-xs mb-2 inline-block">
                  {currentReel.tag}
                </span>
                <h4 className="text-lg sm:text-2xl font-serif-luxury text-white font-light tracking-wide leading-tight">
                  {currentReel.title}
                </h4>
                <p className="text-xs text-[#E2E8F0]/80 font-light mt-1 hidden sm:block">
                  {currentReel.description}
                </p>
              </div>

              {/* Play / Pause Overlay Icon */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
                  isHovered || !isPlaying ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#10191D]/75 backdrop-blur-md border border-[#ECE5DA]/50 flex items-center justify-center text-[#ECE5DA] shadow-2xl transform group-hover:scale-110 transition-transform">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1 text-[#ECE5DA]" />}
                </div>
              </div>

              {/* Bottom Right Controls */}
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10 flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="p-2.5 rounded-xs bg-[#10191D]/80 backdrop-blur-xs border border-white/20 text-[#ECE5DA] hover:border-[#ECE5DA] transition-all cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </>
          ) : (
            /* 3D Interactive Ray Facet Canvas */
            <div className="w-full h-full flex flex-col items-center justify-center relative bg-[#0d1417]">
              <canvas
                ref={canvasRef}
                width={500}
                height={350}
                className="max-w-full max-h-full object-contain"
              />

              <div className="absolute top-4 left-4 text-left font-mono text-[10px] text-[#ECE5DA]/80">
                <div>ROTATION: {rotationAngle}&deg; SYMMETRY</div>
                <div className="text-white/40">57 BRILLIANT FACET RAYS</div>
              </div>

              {/* Carat Interactive Slider */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex items-center justify-between bg-[#10191D]/90 p-3 rounded-xs border border-white/10">
                <span className="text-[10px] font-mono uppercase text-[#ECE5DA] tracking-widest">
                  Scale: {caratSize.toFixed(2)} Carats
                </span>
                <input
                  type="range"
                  min="0.75"
                  max="4.50"
                  step="0.25"
                  value={caratSize}
                  onChange={(e) => setCaratSize(parseFloat(e.target.value))}
                  className="w-48 accent-[#ECE5DA] cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Film Reel Selector Thumbnails */}
        <div className="p-4 sm:p-5 bg-[#172227]/95 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CINEMATIC_REELS.map((reel, idx) => (
            <button
              key={reel.id}
              onClick={() => handleSelectReel(idx)}
              className={`p-3 rounded-xs border text-left transition-all flex items-center gap-3 cursor-pointer ${
                activeReelIndex === idx
                  ? 'bg-white/[0.06] border-[#ECE5DA] shadow-lg'
                  : 'bg-white/[0.01] border-white/10 hover:border-[#ECE5DA]/40 hover:bg-white/[0.03]'
              }`}
            >
              <div className="w-12 h-12 rounded-xs overflow-hidden shrink-0 relative bg-black">
                <img
                  src={reel.poster}
                  alt={reel.title}
                  className="w-full h-full object-cover"
                />
                {activeReelIndex === idx && isPlaying && (
                  <div className="absolute inset-0 bg-[#ECE5DA]/30 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <div className="text-[9px] font-mono uppercase tracking-widest text-[#ECE5DA] truncate">
                  {reel.subtitle}
                </div>
                <div className="text-xs font-serif-luxury text-white font-medium truncate">
                  {reel.title}
                </div>
                <div className="text-[9px] font-mono text-[#E2E8F0]/40 mt-0.5">
                  {reel.duration}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Direct WhatsApp Video Request Callout */}
        <div className="px-5 py-3 bg-[#10191D] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span className="text-[10px] font-mono text-[#E2E8F0]/70 uppercase tracking-widest">
            Want 4K macro video comparisons of 3 specific loose stones side-by-side?
          </span>
          <a
            href="https://wa.me/447721391972?text=Hello%20Brindley%20Diamonds,%20could%20you%20send%204K%20macro%20videos%20of%20available%20certified%20diamonds?"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-solid btn-glow py-1.5 px-4 text-[9px] font-mono uppercase tracking-[0.18em] flex items-center gap-1.5 shrink-0"
          >
            <MessageCircle className="w-3 h-3 text-[#10191D]" />
            <span>Request 4K Stone Clips</span>
          </a>
        </div>

      </div>
    </div>
  );
};
