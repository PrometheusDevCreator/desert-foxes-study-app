'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

interface IntroPageProps {
  onComplete: () => void;
}

const introText = [
  "1941.",
  "The vast, unforgiving expanse of the North African desert has become a vital pivot point of WWII.",
  "Under the command of the brilliant and audacious \"Desert Fox,\" Field Marshal Erwin Rommel, the mechanized might of the German Afrika Korps has swept across the sands, pushing the British Eighth Army to the very brink of collapse.",
  "With the strategic prize of the Suez Canal hanging in the balance, the desert war has evolved into a deadly game of armored chess, centered on the besieged deep-water port of Tobruk\u2014a lonely bastion of Allied defiance holding out against overwhelming odds.",
  "As the sun-scorched front stabilizes near the obscure railway halt of El Alamein, the conventional rules of engagement are being rewritten.",
  "While the Great Armies prepare for a climactic confrontation in the dunes, a new breed of soldier emerges from the heat haze.",
  "Led by the visionary David Stirling, a small band of renegades operate deep behind enemy lines.",
  "As \"L\" Detachment, these desert raiders strike like ghosts against Rommel's airfields and supply lines, causing havoc and weakening the enemy's grip.",
  "They were soon to be known by another name:",
  "The SAS.",
  "This is the story of the North African war.",
  "This is the story of the Desert Foxes."
];

// Timing configuration (in milliseconds) - total ~134 seconds to match music
const SECTION_TIMINGS = [
  { start: 0, fadeIn: 1500, display: 2500, fadeOut: 1000 },      // "1941."
  { start: 5000, fadeIn: 2000, display: 5000, fadeOut: 1500 },   // "The vast..."
  { start: 14000, fadeIn: 2000, display: 9000, fadeOut: 1500 },  // "Under the command..."
  { start: 27000, fadeIn: 2000, display: 10000, fadeOut: 1500 }, // "With the strategic..."
  { start: 41000, fadeIn: 2000, display: 6000, fadeOut: 1500 },  // "As the sun-scorched..."
  { start: 51000, fadeIn: 2000, display: 6000, fadeOut: 1500 },  // "While the Great Armies..."
  { start: 61000, fadeIn: 2000, display: 5000, fadeOut: 1500 },  // "Led by the visionary..."
  { start: 70000, fadeIn: 2000, display: 7000, fadeOut: 1500 },  // "As L Detachment..."
  { start: 81000, fadeIn: 1500, display: 3000, fadeOut: 1000 },  // "They were soon..."
  { start: 87000, fadeIn: 2000, display: 4000, fadeOut: 1500 },  // "The SAS."
  { start: 95000, fadeIn: 2000, display: 4000, fadeOut: 1500 },  // "This is the story of..."
  { start: 103000, fadeIn: 2000, display: 5000, fadeOut: 1500 }, // "This is the story of the Desert Foxes."
];

const ROMMEL_FADE_START = 10000;   // Rommel fades in with section 2-3
const ROMMEL_FADE_OUT = 55000;     // Rommel fades out
const SAS_FADE_START = 58000;      // SAS fades in with section 6-7
const SAS_FADE_OUT = 100000;       // SAS fades out
const SHOW_CONTINUE_AT = 999999;   // Disabled - rely on audio 'ended' event instead

export default function IntroPage({ onComplete }: IntroPageProps) {
  const [currentSection, setCurrentSection] = useState(-1);
  const [sectionOpacity, setSectionOpacity] = useState(0);
  const [rommelOpacity, setRommelOpacity] = useState(0);
  const [sasOpacity, setSasOpacity] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const startTimeRef = useRef<number>(0);

  const handleContinue = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onComplete();
  }, [onComplete]);

  // Start the experience
  const startExperience = useCallback(() => {
    if (audioStarted) return;

    setAudioStarted(true);
    startTimeRef.current = Date.now();

    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(console.error);
    }
  }, [audioStarted]);

  useEffect(() => {
    setMounted(true);

    // Auto-start after a brief delay
    const autoStartTimer = setTimeout(() => {
      startExperience();
    }, 1000);

    return () => clearTimeout(autoStartTimer);
  }, [startExperience]);

  // Animation loop
  useEffect(() => {
    if (!audioStarted) return;

    const animationLoop = () => {
      const elapsed = Date.now() - startTimeRef.current;

      // Handle text sections
      for (let i = SECTION_TIMINGS.length - 1; i >= 0; i--) {
        const timing = SECTION_TIMINGS[i];
        const sectionEnd = timing.start + timing.fadeIn + timing.display + timing.fadeOut;

        if (elapsed >= timing.start && elapsed < sectionEnd) {
          if (currentSection !== i) {
            setCurrentSection(i);
          }

          // Calculate opacity for this section
          const sectionElapsed = elapsed - timing.start;
          let opacity = 0;

          if (sectionElapsed < timing.fadeIn) {
            // Fading in
            opacity = sectionElapsed / timing.fadeIn;
          } else if (sectionElapsed < timing.fadeIn + timing.display) {
            // Fully visible
            opacity = 1;
          } else {
            // Fading out
            const fadeOutElapsed = sectionElapsed - timing.fadeIn - timing.display;
            opacity = 1 - (fadeOutElapsed / timing.fadeOut);
          }

          setSectionOpacity(Math.max(0, Math.min(1, opacity)));
          break;
        }
      }

      // Handle Rommel image
      if (elapsed >= ROMMEL_FADE_START && elapsed < ROMMEL_FADE_OUT) {
        const rommelElapsed = elapsed - ROMMEL_FADE_START;
        if (rommelElapsed < 3000) {
          setRommelOpacity(rommelElapsed / 3000 * 0.4);
        } else if (elapsed > ROMMEL_FADE_OUT - 3000) {
          const fadeOutElapsed = ROMMEL_FADE_OUT - elapsed;
          setRommelOpacity(fadeOutElapsed / 3000 * 0.4);
        } else {
          setRommelOpacity(0.4);
        }
      } else {
        setRommelOpacity(0);
      }

      // Handle SAS image
      if (elapsed >= SAS_FADE_START && elapsed < SAS_FADE_OUT) {
        const sasElapsed = elapsed - SAS_FADE_START;
        if (sasElapsed < 3000) {
          setSasOpacity(sasElapsed / 3000 * 0.4);
        } else if (elapsed > SAS_FADE_OUT - 3000) {
          const fadeOutElapsed = SAS_FADE_OUT - elapsed;
          setSasOpacity(fadeOutElapsed / 3000 * 0.4);
        } else {
          setSasOpacity(0.4);
        }
      } else {
        setSasOpacity(0);
      }

      // Show continue prompt
      if (elapsed >= SHOW_CONTINUE_AT && !showContinue) {
        setShowContinue(true);
      }

      // Show skip button after 5 seconds
      if (elapsed >= 5000 && !showSkip) {
        setShowSkip(true);
      }
    };

    const intervalId = setInterval(animationLoop, 50);
    return () => clearInterval(intervalId);
  }, [audioStarted, currentSection, showContinue, showSkip]);

  // Keyboard/click handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!audioStarted) {
        startExperience();
        return;
      }
      if (showContinue && (e.key === 'Enter' || e.key === ' ')) {
        handleContinue();
      }
    };

    const handleClick = () => {
      if (!audioStarted) {
        startExperience();
        return;
      }
      if (showContinue) {
        handleContinue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, [audioStarted, showContinue, handleContinue, startExperience]);

  // Handle audio end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setShowContinue(true);
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#0a0806' }}
    >
      {/* Background audio */}
      <audio
        ref={audioRef}
        preload="auto"
        src="/intro/intro-music.mp3"
      />

      {/* Desert background image */}
      <div className="absolute inset-0">
        <Image
          src="/intro/desert-background.png"
          alt="Desert landscape"
          fill
          className="object-cover"
          style={{
            opacity: mounted ? 0.7 : 0,
            transition: 'opacity 2s ease-in-out'
          }}
          priority
        />
        {/* Dark overlay for better text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%)'
          }}
        />
      </div>

      {/* Rommel image - left side */}
      <div
        className="absolute left-0 bottom-0 w-1/3 h-full pointer-events-none"
        style={{
          opacity: rommelOpacity,
          transition: 'opacity 0.1s linear'
        }}
      >
        <Image
          src="/intro/rommel.png"
          alt="Field Marshal Erwin Rommel"
          fill
          className="object-contain object-bottom"
          style={{
            filter: 'grayscale(30%) sepia(20%)',
            mixBlendMode: 'luminosity'
          }}
        />
      </div>

      {/* SAS image - right side */}
      <div
        className="absolute right-0 bottom-0 w-1/3 h-full pointer-events-none"
        style={{
          opacity: sasOpacity,
          transition: 'opacity 0.1s linear'
        }}
      >
        <Image
          src="/intro/sas.png"
          alt="SAS Soldiers"
          fill
          className="object-contain object-bottom"
          style={{
            filter: 'grayscale(30%) sepia(20%)',
            mixBlendMode: 'luminosity'
          }}
        />
      </div>

      {/* Film grain overlay */}
      <div
        className={`absolute inset-0 pointer-events-none opacity-[0.03] ${mounted ? 'animate-grain' : ''}`}
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 200px 100px rgba(0,0,0,0.8)',
        }}
      />

      {/* Main text content */}
      <div className="relative z-10 max-w-3xl mx-auto px-8 md:px-12 text-center">
        {currentSection >= 0 && currentSection < introText.length && (
          <p
            className="text-xl md:text-2xl lg:text-3xl leading-relaxed md:leading-loose"
            style={{
              fontFamily: "'Palatino Linotype', 'Book Antiqua', 'Crimson Text', Georgia, serif",
              color: '#e8dcc8',
              textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.5)',
              letterSpacing: '0.03em',
              lineHeight: '1.8',
              opacity: sectionOpacity,
              transition: 'opacity 0.1s linear',
            }}
          >
            {introText[currentSection]}
          </p>
        )}
      </div>

      {/* Continue prompt */}
      <div
        className={`absolute bottom-16 left-0 right-0 text-center transition-all duration-1000 ${
          showContinue ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <p
          className="text-sm md:text-base tracking-[0.3em] uppercase animate-pulse cursor-pointer"
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            color: '#c4a878',
            textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
          }}
        >
          Press Enter to Start Your Journey
        </p>
      </div>

      {/* Skip Intro button - bottom right, appears after 5 seconds */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleContinue();
        }}
        className={`absolute bottom-6 right-6 z-30 px-4 py-2 text-sm tracking-wider uppercase transition-all duration-500 ${
          showSkip && audioStarted ? 'opacity-60 hover:opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          color: '#a89060',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(168, 144, 96, 0.3)',
          borderRadius: '4px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
        }}
      >
        Skip Intro
      </button>

      {/* Click/tap prompt before start */}
      {!audioStarted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer z-20">
          <p
            className="text-lg md:text-xl tracking-[0.2em] uppercase animate-pulse"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              color: '#c4a878',
            }}
          >
            Click or Press Any Key to Begin
          </p>
        </div>
      )}

      {/* CSS animations */}
      <style jsx>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(1%, 1%); }
          30% { transform: translate(-1%, 1%); }
          40% { transform: translate(1%, -1%); }
          50% { transform: translate(-1%, 0); }
          60% { transform: translate(1%, 0); }
          70% { transform: translate(0, -1%); }
          80% { transform: translate(0, 1%); }
          90% { transform: translate(-1%, -1%); }
        }
        .animate-grain {
          animation: grain 0.5s steps(10) infinite;
        }
      `}</style>
    </div>
  );
}
