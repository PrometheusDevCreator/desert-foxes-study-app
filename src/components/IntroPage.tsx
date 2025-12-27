'use client';

import { useState, useEffect, useCallback } from 'react';

interface IntroPageProps {
  onComplete: () => void;
}

const introText = [
  {
    paragraph: `The year is 1941. The vast, unforgiving expanse of the North African desert has become the pivot point of the global struggle. Under the command of the brilliant and audacious "Desert Fox," Field Marshal Erwin Rommel, the mechanized might of the German Afrika Korps has swept across the sands, pushing the British Eighth Army to the very brink of collapse.`
  },
  {
    paragraph: `With the strategic prize of the Suez Canal hanging in the balance, the desert war has evolved into a deadly game of armored chess, centered on the besieged deep-water port of Tobruk—a lonely bastion of Allied defiance holding out against overwhelming odds.`
  },
  {
    paragraph: `As the sun-scorched front stabilizes near the obscure railway halt of El Alamein, the conventional rules of engagement are being rewritten. While the Great Armies prepare for a climactic confrontation in the dunes, a new breed of soldier emerges from the heat haze.`
  },
  {
    paragraph: `Led by the visionary David Stirling, a small band of renegades forms the Special Air Service—the SAS. Operating deep behind enemy lines with "L" Detachment, these desert raiders strike like ghosts against Rommel's airfields and supply lines, proving that in this war of shifting sands, courage and initiative can turn the tide of history.`
  }
];

export default function IntroPage({ onComplete }: IntroPageProps) {
  const [visibleParagraphs, setVisibleParagraphs] = useState<number[]>([]);
  const [showContinue, setShowContinue] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Fade in paragraphs one at a time
    const timers: NodeJS.Timeout[] = [];

    introText.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleParagraphs(prev => [...prev, index]);
      }, 2000 + index * 3500); // Start at 2s, then every 3.5s
      timers.push(timer);
    });

    // Show continue prompt after all paragraphs
    const continueTimer = setTimeout(() => {
      setShowContinue(true);
    }, 2000 + introText.length * 3500 + 1000);
    timers.push(continueTimer);

    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const handleContinue = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleContinue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleContinue]);

  const playMusic = () => {
    if (typeof window !== 'undefined' && !audioPlaying) {
      const audio = document.getElementById('intro-music') as HTMLAudioElement;
      if (audio) {
        audio.volume = 0.3;
        audio.play().catch(() => {
          // Autoplay blocked - user will need to interact
        });
        setAudioPlaying(true);
      }
    }
  };

  useEffect(() => {
    // Try to play music after mount
    const timer = setTimeout(playMusic, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden cursor-pointer"
      onClick={handleContinue}
      style={{ backgroundColor: '#0a0806' }}
    >
      {/* Background audio - dramatic orchestral/period music */}
      <audio
        id="intro-music"
        loop
        preload="auto"
        src="https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3"
      />

      {/* Animated desert background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient overlay simulating desert dusk */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, #1a0f05 0%, #2d1810 30%, #3d2415 50%, #4a2d1a 70%, #1a0f05 100%)',
          }}
        />

        {/* Animated sand dune layers */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-[40%] ${mounted ? 'animate-dune-1' : ''}`}
          style={{
            background: 'linear-gradient(to top, #8B7355 0%, #A0896A 40%, transparent 100%)',
            clipPath: 'polygon(0 60%, 15% 40%, 30% 55%, 50% 35%, 70% 50%, 85% 30%, 100% 45%, 100% 100%, 0 100%)',
            opacity: 0.3,
          }}
        />
        <div
          className={`absolute bottom-0 left-0 right-0 h-[35%] ${mounted ? 'animate-dune-2' : ''}`}
          style={{
            background: 'linear-gradient(to top, #6B5344 0%, #8B7355 50%, transparent 100%)',
            clipPath: 'polygon(0 45%, 20% 60%, 40% 40%, 60% 55%, 80% 35%, 100% 50%, 100% 100%, 0 100%)',
            opacity: 0.4,
          }}
        />

        {/* Heat shimmer effect */}
        <div
          className={`absolute inset-0 ${mounted ? 'animate-heat' : ''}`}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,200,150,0.08) 0%, transparent 60%)',
          }}
        />

        {/* Stars in the upper portion (dusk sky) */}
        <div className="absolute inset-0" style={{ opacity: 0.4 }}>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 40}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </div>

        {/* Film grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] animate-grain"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          }}
        />
      </div>

      {/* Main content container */}
      <div className="relative z-10 max-w-4xl mx-auto px-8 md:px-12">
        {/* Text content with fade-in */}
        <div className="space-y-8 md:space-y-10">
          {introText.map((item, index) => (
            <p
              key={index}
              className={`text-base md:text-lg lg:text-xl leading-relaxed md:leading-loose text-center transition-all duration-[2000ms] ${
                visibleParagraphs.includes(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                fontFamily: "'Palatino Linotype', 'Book Antiqua', 'Crimson Text', Georgia, serif",
                color: '#d4c4a8',
                textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
                letterSpacing: '0.02em',
                lineHeight: '1.9',
              }}
            >
              {item.paragraph}
            </p>
          ))}
        </div>

        {/* Continue prompt */}
        <div
          className={`mt-16 text-center transition-all duration-1000 ${
            showContinue ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p
            className="text-sm md:text-base tracking-[0.3em] uppercase animate-pulse"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              color: '#a89070',
            }}
          >
            Press Enter or Click to Continue
          </p>
        </div>
      </div>

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 150px 60px rgba(0,0,0,0.7)',
        }}
      />

      {/* CSS animations */}
      <style jsx>{`
        @keyframes dune-1 {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-10px);
          }
        }
        @keyframes dune-2 {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(8px);
          }
        }
        @keyframes heat {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes grain {
          0%, 100% {
            transform: translate(0, 0);
          }
          10% {
            transform: translate(-1%, -1%);
          }
          20% {
            transform: translate(1%, 1%);
          }
          30% {
            transform: translate(-1%, 1%);
          }
          40% {
            transform: translate(1%, -1%);
          }
          50% {
            transform: translate(-1%, 0);
          }
          60% {
            transform: translate(1%, 0);
          }
          70% {
            transform: translate(0, -1%);
          }
          80% {
            transform: translate(0, 1%);
          }
          90% {
            transform: translate(-1%, -1%);
          }
        }
        .animate-dune-1 {
          animation: dune-1 15s ease-in-out infinite;
        }
        .animate-dune-2 {
          animation: dune-2 12s ease-in-out infinite;
          animation-delay: -5s;
        }
        .animate-heat {
          animation: heat 8s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        .animate-grain {
          animation: grain 0.5s steps(10) infinite;
        }
      `}</style>
    </div>
  );
}
