import React, { useState } from 'react';
import fireflyLogo from '../assets/firefly.png';
import logoImg from '../assets/logo.png';

interface LogoProps {
  variant?: 'light' | 'dark' | 'gold';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  height?: number;
  showText?: boolean;
  imageUrl?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'gold',
  className = '',
  size = 'md',
  height,
  showText = false,
  imageUrl,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Determine height
  const computedHeight = height
    ? height
    : size === 'sm'
    ? 38
    : size === 'md'
    ? 50
    : size === 'lg'
    ? 68
    : 92;

  const baseUrl = import.meta.env.BASE_URL || '/';
  const imgSrc = imageUrl || fireflyLogo || `${baseUrl}firefly.png` || logoImg;

  const textColor =
    variant === 'light'
      ? 'text-[#172227]'
      : variant === 'dark'
      ? 'text-[#E2E8F0]'
      : 'text-[#ECE5DA]';

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      {!imageFailed ? (
        <img
          src={imgSrc}
          alt="Brindley Diamonds"
          style={{
            height: `${computedHeight}px`,
            width: `${computedHeight}px`,
          }}
          className="object-contain block shrink-0 drop-shadow-[0_2px_12px_rgba(236,229,218,0.15)] transition-transform duration-300 group-hover:scale-105"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
        />
      ) : (
        /* Bulletproof Vector SVG Crest in Champagne Gold */
        <svg
          viewBox="0 0 512 512"
          style={{ height: `${computedHeight}px`, width: `${computedHeight}px` }}
          className="block shrink-0"
          aria-label="Brindley Diamonds Monogram"
        >
          <defs>
            <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#ECE5DA" />
              <stop offset="70%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#997A25" />
            </linearGradient>
            <linearGradient id="logoShine" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C5A059" />
              <stop offset="50%" stopColor="#F3ECE2" />
              <stop offset="100%" stopColor="#B38F43" />
            </linearGradient>
          </defs>

          {/* Outer Facet Octagonal Ring */}
          <polygon
            points="256,24 396,82 454,222 454,290 396,430 256,488 116,430 58,290 58,222 116,82"
            fill="none"
            stroke="url(#logoGold)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
          <polygon
            points="256,42 382,94 434,220 434,292 382,418 256,470 130,418 78,292 78,220 130,94"
            fill="none"
            stroke="url(#logoGold)"
            strokeWidth="2"
            opacity="0.45"
          />

          {/* Brilliant Cut Diamond Top Profile */}
          <g transform="translate(0, -10)">
            <polygon
              points="176,140 336,140 396,195 256,195 116,195"
              fill="none"
              stroke="url(#logoShine)"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <line x1="216" y1="140" x2="196" y2="195" stroke="url(#logoShine)" strokeWidth="3.5" />
            <line x1="296" y1="140" x2="316" y2="195" stroke="url(#logoShine)" strokeWidth="3.5" />
            <line x1="256" y1="140" x2="256" y2="195" stroke="url(#logoShine)" strokeWidth="3.5" />

            <polygon points="256,140 216,140 256,195" fill="url(#logoGold)" opacity="0.18" />
            <polygon points="256,140 296,140 256,195" fill="url(#logoGold)" opacity="0.28" />

            {/* Pavilion to Culet */}
            <polygon
              points="116,195 396,195 256,335"
              fill="none"
              stroke="url(#logoShine)"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <line x1="196" y1="195" x2="256" y2="335" stroke="url(#logoShine)" strokeWidth="3.5" />
            <line x1="256" y1="195" x2="256" y2="335" stroke="url(#logoShine)" strokeWidth="3.5" />
            <line x1="316" y1="195" x2="256" y2="335" stroke="url(#logoShine)" strokeWidth="3.5" />
          </g>

          {/* Stylized BD Monogram Crest */}
          <g transform="translate(0, 50)" stroke="url(#logoGold)" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M 196,310 L 196,390 M 196,310 L 230,310 C 248,310 258,322 258,334 C 258,346 248,350 232,350 L 196,350 M 232,350 C 252,350 264,360 264,374 C 264,388 250,390 230,390 L 196,390"
              strokeWidth="5.5"
            />
            <path
              d="M 252,310 L 282,310 C 312,310 328,326 328,350 C 328,374 312,390 282,390 L 252,390 L 252,310"
              strokeWidth="5.5"
            />
          </g>

          {/* Scintillation Sparkle Accent */}
          <g transform="translate(396, 120)">
            <line x1="0" y1="-18" x2="0" y2="18" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="-18" y1="0" x2="18" y2="0" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="-8" y1="-8" x2="8" y2="8" stroke="#ECE5DA" strokeWidth="2" strokeLinecap="round" />
            <line x1="-8" y1="8" x2="8" y2="-8" stroke="#ECE5DA" strokeWidth="2" strokeLinecap="round" />
            <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
          </g>
        </svg>
      )}

      {showText && (
        <span
          className={`font-mono uppercase tracking-[0.28em] font-normal text-center mt-2.5 ${textColor} ${
            size === 'sm' ? 'text-[9px]' : size === 'md' ? 'text-[11px]' : size === 'lg' ? 'text-[13px]' : 'text-[16px]'
          }`}
        >
          BRINDLEY DIAMONDS
        </span>
      )}
    </div>
  );
};

export default Logo;
