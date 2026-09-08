import React, { useEffect, useRef, useState } from 'react';

export const BackgroundVideo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Attempt playback when mounted
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setVideoLoaded(true);
      }).catch(() => {
        // Fallback gracefully to procedural canvas animation
      });
    }

    // High-performance Canvas particle & light refraction sparkle animation
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Diamond refraction sparkles, light beams & optical flares
    const particleCount = Math.min(45, Math.floor(window.innerWidth / 30));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35 - 0.15,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * 0.025 + 0.01,
      maxAlpha: Math.random() * 0.65 + 0.35,
      color: Math.random() > 0.35 ? 'rgba(236, 229, 218,' : 'rgba(195, 230, 245,',
      isStar: Math.random() > 0.6,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    }));

    // Ambient light caustic beams
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      // Draw subtle moving diagonal light caustic waves
      const grad = ctx.createRadialGradient(
        width * 0.5 + Math.sin(time * 0.7) * 150,
        height * 0.3 + Math.cos(time * 0.5) * 100,
        50,
        width * 0.5,
        height * 0.4,
        width * 0.8
      );
      grad.addColorStop(0, 'rgba(236, 229, 218, 0.04)');
      grad.addColorStop(0.5, 'rgba(180, 220, 240, 0.02)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Wrap around screen
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Pulse alpha
        p.alpha += p.pulse;
        if (p.alpha > p.maxAlpha || p.alpha < 0.12) {
          p.pulse = -p.pulse;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = `${p.color} ${Math.max(0, p.alpha)})`;
        ctx.shadowColor = 'rgba(236, 229, 218, 0.8)';
        ctx.shadowBlur = p.size * 4;

        if (p.isStar) {
          // Draw brilliant 8-point diamond facet sparkle
          const r = p.size * 2;
          ctx.beginPath();
          ctx.moveTo(0, -r * 2);
          ctx.lineTo(r * 0.3, -r * 0.3);
          ctx.lineTo(r * 2, 0);
          ctx.lineTo(r * 0.3, r * 0.3);
          ctx.lineTo(0, r * 2);
          ctx.lineTo(-r * 0.3, r * 0.3);
          ctx.lineTo(-r * 2, 0);
          ctx.lineTo(-r * 0.3, -r * 0.3);
          ctx.closePath();
          ctx.fill();

          // Inner bright core
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, p.alpha * 1.5)})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Base Gradient Canvas */}
      <div className="absolute inset-0 bg-[#10191D]" />

      {/* 2. Abstract Dark Metallic / Diamond Light Refraction Video Loop */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onCanPlay={() => setVideoLoaded(true)}
        className={`w-full h-full object-cover object-center scale-105 filter brightness-90 contrast-125 saturate-80 transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-45' : 'opacity-25'
        }`}
      >
        {/* Multiple rock-solid direct video sources */}
        <source
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          type="video/mp4"
        />
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-glittering-glamour-particles-in-the-dark-42417-large.mp4"
          type="video/mp4"
        />
      </video>

      {/* 3. Ambient Diamond Caustic & Refraction Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full mix-blend-screen opacity-85 pointer-events-none"
      />

      {/* 4. Semi-Translucent Dark Slate Tint Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#10191D]/80 via-[#10191D]/55 to-[#10191D]/90 mix-blend-multiply" />

      {/* 5. Radial Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#10191D]/30 to-[#10191D]/90 pointer-events-none" />

      {/* 6. Atelier Micro-Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};
