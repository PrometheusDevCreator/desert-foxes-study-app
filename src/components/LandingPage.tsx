'use client';

import { useState, useEffect } from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--background, #1a1510)' }}
    >
      {/* Animated desert heat shimmer effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Heat shimmer 1 */}
        <div
          className={`absolute w-[400px] h-[400px] rounded-full opacity-[0.3] ${mounted ? 'animate-shimmer-1' : ''}`}
          style={{
            background: 'radial-gradient(circle, rgba(212,165,116,0.6) 0%, rgba(196,90,59,0.3) 30%, transparent 60%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        {/* Heat shimmer 2 */}
        <div
          className={`absolute w-[300px] h-[300px] rounded-full opacity-[0.25] ${mounted ? 'animate-shimmer-2' : ''}`}
          style={{
            background: 'radial-gradient(circle, rgba(244,164,96,0.5) 0%, rgba(212,165,116,0.2) 40%, transparent 65%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        {/* Desert sand texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Afrika Korps Palm Tree Symbol */}
        <button
          onClick={onEnter}
          className="group relative cursor-pointer focus:outline-none"
          aria-label="Enter Desert Foxes Study App"
        >
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full scale-110 group-hover:scale-125 transition-all duration-700"
            style={{
              border: '3px solid rgba(212,165,116,0.3)',
            }}
          />

          {/* Main symbol container - circular with desert gradient */}
          <div
            className="relative w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full shadow-2xl group-hover:shadow-[0_0_50px_rgba(212,165,116,0.4)] transition-all duration-500 flex items-center justify-center"
            style={{
              background: 'linear-gradient(to bottom, var(--accent-sand, #d4a574), var(--accent-rust, #c45a3b))',
            }}
          >
            {/* Palm Tree SVG - Afrika Korps inspired */}
            <svg
              viewBox="0 0 100 100"
              className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28"
              style={{ color: 'var(--background, #1a1510)' }}
            >
              {/* Palm trunk */}
              <path
                d="M50 95 L50 45 Q48 42 46 40 Q52 42 54 40 Q52 42 50 45"
                fill="currentColor"
                strokeWidth="0"
              />
              <rect x="47" y="45" width="6" height="50" fill="currentColor" />

              {/* Palm fronds - left side */}
              <path
                d="M50 40 Q30 35 15 45 Q25 38 35 38 Q42 38 50 40"
                fill="currentColor"
              />
              <path
                d="M50 38 Q25 28 10 35 Q20 30 32 32 Q42 34 50 38"
                fill="currentColor"
              />
              <path
                d="M50 35 Q30 20 20 22 Q28 22 38 28 Q45 32 50 35"
                fill="currentColor"
              />

              {/* Palm fronds - right side */}
              <path
                d="M50 40 Q70 35 85 45 Q75 38 65 38 Q58 38 50 40"
                fill="currentColor"
              />
              <path
                d="M50 38 Q75 28 90 35 Q80 30 68 32 Q58 34 50 38"
                fill="currentColor"
              />
              <path
                d="M50 35 Q70 20 80 22 Q72 22 62 28 Q55 32 50 35"
                fill="currentColor"
              />

              {/* Center top frond */}
              <path
                d="M50 35 Q48 20 50 10 Q52 20 50 35"
                fill="currentColor"
              />
              <path
                d="M50 12 Q45 18 42 25 Q48 20 50 12"
                fill="currentColor"
              />
              <path
                d="M50 12 Q55 18 58 25 Q52 20 50 12"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Outer decorative ring */}
          <div
            className="absolute -inset-6 rounded-full group-hover:border-[var(--accent-sand)]/40 transition-colors duration-500"
            style={{
              border: '1px solid rgba(212,165,116,0.15)',
            }}
          />
        </button>

        {/* Title below symbol */}
        <div className="mt-10 text-center">
          <p
            className="text-sm md:text-base tracking-[0.4em] mb-2"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              color: 'var(--foreground-muted, #a89984)',
              textTransform: 'uppercase'
            }}
          >
            North Africa
          </p>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-widest"
            style={{
              fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
              letterSpacing: '0.2em',
              color: 'var(--foreground, #f5ebe0)',
              textShadow: '2px 2px 8px rgba(0,0,0,0.6)'
            }}
          >
            THE DESERT FOXES
          </h1>
          <p
            className="mt-4 text-sm md:text-base tracking-wider"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              color: 'var(--foreground-muted, #a89984)'
            }}
          >
            Click to Enter
          </p>
        </div>
      </div>

      {/* Copyright footer */}
      <div className="absolute bottom-8 text-center">
        <p
          className="text-xs md:text-sm tracking-wide"
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            letterSpacing: '0.1em',
            color: 'var(--foreground-muted, #a89984)',
            opacity: 0.6
          }}
        >
          &copy; ELAN / Prometheus Education Systems 2025
        </p>
      </div>

      {/* CSS for heat shimmer animations */}
      <style jsx>{`
        @keyframes shimmer-1 {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.4;
          }
        }
        @keyframes shimmer-2 {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.25;
          }
          50% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.35;
          }
        }
        .animate-shimmer-1 {
          animation: shimmer-1 6s ease-in-out infinite;
        }
        .animate-shimmer-2 {
          animation: shimmer-2 8s ease-in-out infinite;
          animation-delay: -3s;
        }
      `}</style>
    </div>
  );
}
