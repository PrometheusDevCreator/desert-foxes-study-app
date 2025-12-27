# Study App Code Templates
## Reusable Component Patterns

**Version:** 1.0
**Date:** 2025-12-27

---

## 1. AppWrapper Component

Orchestrates the entry flow: loading → landing → intro → login → main app.

```typescript
// src/components/AppWrapper.tsx
'use client';

import { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import LandingPage from './LandingPage';
import IntroPage from './IntroPage';
import LoginPage from './LoginPage';

interface AppWrapperProps {
  children: ReactNode;
}

type AppStage = 'loading' | 'landing' | 'intro' | 'login' | 'app';

// CUSTOMIZE: Change prefix for each app
const APP_PREFIX = 'your-app-name';

interface UserContextType {
  username: string | null;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({ username: null, logout: () => {} });

export function useUser() {
  return useContext(UserContext);
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const [stage, setStage] = useState<AppStage>('loading');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const hasEntered = sessionStorage.getItem(`${APP_PREFIX}-entered`);
    const savedUser = sessionStorage.getItem(`${APP_PREFIX}-current-user`);

    if (hasEntered === 'true' && savedUser) {
      setCurrentUser(savedUser);
      setStage('app');
    } else {
      setStage('landing');
    }
  }, []);

  const handleLandingEnter = () => setStage('intro');
  const handleIntroComplete = () => setStage('login');

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    sessionStorage.setItem(`${APP_PREFIX}-entered`, 'true');
    sessionStorage.setItem(`${APP_PREFIX}-current-user`, username);
    setStage('app');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem(`${APP_PREFIX}-entered`);
    sessionStorage.removeItem(`${APP_PREFIX}-current-user`);
    setStage('login');
  };

  if (stage === 'loading') {
    return <div className="fixed inset-0 z-[100]" style={{ backgroundColor: 'var(--bg-primary)' }} />;
  }

  if (stage === 'landing') return <LandingPage onEnter={handleLandingEnter} />;
  if (stage === 'intro') return <IntroPage onComplete={handleIntroComplete} />;
  if (stage === 'login') return <LoginPage onLogin={handleLogin} />;

  return (
    <UserContext.Provider value={{ username: currentUser, logout: handleLogout }}>
      {children}
    </UserContext.Provider>
  );
}
```

---

## 2. Landing Page Component

Atmospheric entry point with animated elements.

```typescript
// src/components/LandingPage.tsx
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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden cursor-pointer"
      onClick={onEnter}
      style={{ backgroundColor: 'var(--bg-primary, #0a0806)' }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
        }}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 200px 100px rgba(0,0,0,0.6)' }}
      />

      {/* Main content */}
      <div
        className={`relative z-10 text-center transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* CUSTOMIZE: App title */}
        <h1
          className="text-4xl md:text-6xl font-bold mb-4"
          style={{
            fontFamily: "'Palatino Linotype', Georgia, serif",
            color: 'var(--text-accent, #d4a574)',
            textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
          }}
        >
          Your App Title
        </h1>

        {/* CUSTOMIZE: Subtitle */}
        <p
          className="text-lg md:text-xl tracking-widest uppercase mb-12"
          style={{ color: 'var(--text-secondary, #8b7355)' }}
        >
          Subtitle or Tagline
        </p>

        {/* Enter prompt */}
        <p
          className="text-sm tracking-[0.3em] uppercase animate-pulse"
          style={{ color: 'var(--text-secondary, #8b7355)' }}
        >
          Click Anywhere to Enter
        </p>
      </div>

      {/* Keyboard listener */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') window.dispatchEvent(new Event('landing-enter'));
          });`,
        }}
      />
    </div>
  );
}
```

---

## 3. Intro Page Component (Cinematic Sequence)

Timed text reveals with background audio and images.

```typescript
// src/components/IntroPage.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

interface IntroPageProps {
  onComplete: () => void;
}

// CUSTOMIZE: Your narrative text
const introText = [
  "Opening line...",
  "Second paragraph...",
  "Third paragraph...",
  // Add more sections as needed
  "Final dramatic line."
];

// CUSTOMIZE: Timing for each section (milliseconds)
// { start: when to start, fadeIn: fade in duration, display: hold time, fadeOut: fade out duration }
const SECTION_TIMINGS = [
  { start: 0, fadeIn: 1500, display: 2500, fadeOut: 1000 },
  { start: 5000, fadeIn: 2000, display: 5000, fadeOut: 1500 },
  // Add timing for each text section
];

// CUSTOMIZE: Image timing
const IMAGE_1_FADE_START = 10000;
const IMAGE_1_FADE_OUT = 55000;

export default function IntroPage({ onComplete }: IntroPageProps) {
  const [currentSection, setCurrentSection] = useState(-1);
  const [sectionOpacity, setSectionOpacity] = useState(0);
  const [imageOpacity, setImageOpacity] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const startTimeRef = useRef<number>(0);

  const handleContinue = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
    onComplete();
  }, [onComplete]);

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
    const autoStartTimer = setTimeout(() => startExperience(), 1000);
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
          if (currentSection !== i) setCurrentSection(i);

          const sectionElapsed = elapsed - timing.start;
          let opacity = 0;

          if (sectionElapsed < timing.fadeIn) {
            opacity = sectionElapsed / timing.fadeIn;
          } else if (sectionElapsed < timing.fadeIn + timing.display) {
            opacity = 1;
          } else {
            opacity = 1 - ((sectionElapsed - timing.fadeIn - timing.display) / timing.fadeOut);
          }

          setSectionOpacity(Math.max(0, Math.min(1, opacity)));
          break;
        }
      }

      // Show skip button after 5 seconds
      if (elapsed >= 5000 && !showSkip) setShowSkip(true);
    };

    const intervalId = setInterval(animationLoop, 50);
    return () => clearInterval(intervalId);
  }, [audioStarted, currentSection, showSkip]);

  // Handle audio end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setShowContinue(true);
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary, #0a0806)' }}
    >
      {/* CUSTOMIZE: Audio file path */}
      <audio ref={audioRef} preload="auto" src="/intro/intro-music.mp3" />

      {/* CUSTOMIZE: Background image */}
      <div className="absolute inset-0">
        <Image
          src="/intro/background.png"
          alt="Background"
          fill
          className="object-cover"
          style={{ opacity: mounted ? 0.7 : 0, transition: 'opacity 2s ease-in-out' }}
          priority
        />
      </div>

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 200px 100px rgba(0,0,0,0.8)' }}
      />

      {/* Text content */}
      <div className="relative z-10 max-w-3xl mx-auto px-8 text-center">
        {currentSection >= 0 && currentSection < introText.length && (
          <p
            className="text-xl md:text-2xl lg:text-3xl leading-relaxed"
            style={{
              fontFamily: "'Palatino Linotype', Georgia, serif",
              color: 'var(--text-primary, #e8dcc8)',
              textShadow: '2px 2px 8px rgba(0,0,0,0.9)',
              opacity: sectionOpacity,
            }}
          >
            {introText[currentSection]}
          </p>
        )}
      </div>

      {/* Continue prompt */}
      <div className={`absolute bottom-16 text-center transition-all duration-1000 ${showContinue ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-sm tracking-[0.3em] uppercase animate-pulse cursor-pointer"
           style={{ color: 'var(--text-accent, #c4a878)' }}
           onClick={handleContinue}>
          Press Enter to Continue
        </p>
      </div>

      {/* Skip button */}
      <button
        onClick={(e) => { e.stopPropagation(); handleContinue(); }}
        className={`absolute bottom-6 right-6 z-30 px-4 py-2 text-sm tracking-wider uppercase transition-all duration-500 ${
          showSkip && audioStarted ? 'opacity-60 hover:opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          color: 'var(--text-secondary, #a89060)',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '4px',
        }}
      >
        Skip Intro
      </button>
    </div>
  );
}
```

---

## 4. Login Page Component

User profile selection with local storage persistence.

```typescript
// src/components/LoginPage.tsx
'use client';

import { useState, useEffect } from 'react';

// CUSTOMIZE: App prefix for storage keys
const APP_PREFIX = 'your-app-name';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

interface StoredUser {
  username: string;
  createdAt: string;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [isNewUser, setIsNewUser] = useState(true);
  const [existingUsers, setExistingUsers] = useState<StoredUser[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const users = localStorage.getItem(`${APP_PREFIX}-users`);
    if (users) {
      const parsed = JSON.parse(users) as StoredUser[];
      setExistingUsers(parsed);
      if (parsed.length > 0) setIsNewUser(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) { setError('Please enter a username'); return; }
    if (username.trim().length < 2) { setError('Username must be at least 2 characters'); return; }

    const trimmedUsername = username.trim();
    const existingUser = existingUsers.find(u => u.username.toLowerCase() === trimmedUsername.toLowerCase());

    if (existingUser) {
      onLogin(existingUser.username);
    } else {
      const newUser: StoredUser = { username: trimmedUsername, createdAt: new Date().toISOString() };
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem(`${APP_PREFIX}-users`, JSON.stringify(updatedUsers));
      onLogin(trimmedUsername);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center"
         style={{ backgroundColor: 'var(--bg-primary, #0a0806)' }}>
      <div className="w-full max-w-md mx-auto px-6">
        {/* CUSTOMIZE: App branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-accent, #d4a574)' }}>
            Your App Name
          </h1>
          <p className="text-sm tracking-widest uppercase" style={{ color: 'var(--text-secondary, #8b7355)' }}>
            Subtitle
          </p>
        </div>

        <div className="p-6 rounded-lg" style={{
          background: 'var(--bg-tertiary, rgba(30, 28, 25, 0.9))',
          border: '1px solid var(--border-subtle)',
        }}>
          {existingUsers.length > 0 && !isNewUser ? (
            <>
              <h2 className="text-lg font-bold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>
                Welcome Back
              </h2>
              <div className="space-y-2 mb-4">
                {existingUsers.map((user) => (
                  <button
                    key={user.username}
                    onClick={() => onLogin(user.username)}
                    className="w-full p-3 rounded text-left transition-all hover:scale-[1.02]"
                    style={{
                      background: 'rgba(var(--accent-primary-rgb), 0.1)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-accent)',
                    }}
                  >
                    {user.username}
                  </button>
                ))}
              </div>
              <div className="text-center">
                <button onClick={() => setIsNewUser(true)} className="text-sm hover:underline"
                        style={{ color: 'var(--text-secondary)' }}>
                  Create new profile
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="text-lg font-bold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>
                {existingUsers.length > 0 ? 'Create New Profile' : 'Enter Your Name'}
              </h2>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder="Enter username..."
                className="w-full p-3 rounded mb-3 outline-none"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                }}
                autoFocus
              />
              {error && <p className="text-sm mb-3" style={{ color: 'var(--error)' }}>{error}</p>}
              <button
                type="submit"
                className="w-full p-3 rounded font-bold uppercase tracking-wider transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                  color: 'var(--bg-primary)',
                }}
              >
                Start Learning
              </button>
              {existingUsers.length > 0 && (
                <div className="text-center mt-4">
                  <button onClick={() => setIsNewUser(false)} className="text-sm hover:underline"
                          style={{ color: 'var(--text-secondary)' }}>
                    Back to profiles
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 5. Progress Context

User-specific progress tracking with localStorage persistence.

```typescript
// src/lib/progress-context.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// CUSTOMIZE: App prefix
const APP_PREFIX = 'your-app-name';
const STORAGE_KEY_PREFIX = `${APP_PREFIX}-progress-`;

function getStorageKey(username: string | null): string {
  return username ? `${STORAGE_KEY_PREFIX}${username.toLowerCase()}` : `${APP_PREFIX}-progress`;
}

interface UserProgress {
  modulesCompleted: string[];
  cardsRead: Record<string, string[]>;
  quizAttempts: QuizAttempt[];
  flashcardProgress: Record<string, FlashcardState>;
  lastVisited: string;
  bookmarks: Bookmark[];
}

interface QuizAttempt {
  quizId: string;
  score: number;
  totalQuestions: number;
  date: string;
}

interface FlashcardState {
  known: boolean;
  lastReviewed: string;
  reviewCount: number;
}

interface Bookmark {
  type: string;
  id: string;
  title: string;
  dateAdded: string;
}

const defaultProgress: UserProgress = {
  modulesCompleted: [],
  cardsRead: {},
  quizAttempts: [],
  flashcardProgress: {},
  lastVisited: new Date().toISOString(),
  bookmarks: [],
};

interface ProgressContextType {
  progress: UserProgress;
  markModuleComplete: (moduleId: string) => void;
  markCardRead: (moduleId: string, cardId: string) => void;
  recordQuizAttempt: (attempt: QuizAttempt) => void;
  updateFlashcardProgress: (cardId: string, state: FlashcardState) => void;
  addBookmark: (bookmark: Omit<Bookmark, 'dateAdded'>) => void;
  removeBookmark: (type: string, id: string) => void;
  resetProgress: () => void;
  getModuleProgress: (moduleId: string) => number;
  getTotalProgress: () => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const username = sessionStorage.getItem(`${APP_PREFIX}-current-user`);
      setCurrentUser(username);

      const storageKey = getStorageKey(username);
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          setProgress({ ...defaultProgress, ...JSON.parse(stored) });
        } catch {
          setProgress(defaultProgress);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      const storageKey = getStorageKey(currentUser);
      localStorage.setItem(storageKey, JSON.stringify(progress));
    }
  }, [progress, isLoaded, currentUser]);

  const markModuleComplete = (moduleId: string) => {
    setProgress(prev => ({
      ...prev,
      modulesCompleted: prev.modulesCompleted.includes(moduleId)
        ? prev.modulesCompleted
        : [...prev.modulesCompleted, moduleId],
      lastVisited: new Date().toISOString(),
    }));
  };

  const markCardRead = (moduleId: string, cardId: string) => {
    setProgress(prev => {
      const moduleCards = prev.cardsRead[moduleId] || [];
      if (moduleCards.includes(cardId)) return prev;
      return {
        ...prev,
        cardsRead: { ...prev.cardsRead, [moduleId]: [...moduleCards, cardId] },
        lastVisited: new Date().toISOString(),
      };
    });
  };

  const recordQuizAttempt = (attempt: QuizAttempt) => {
    setProgress(prev => ({
      ...prev,
      quizAttempts: [...prev.quizAttempts, attempt],
      lastVisited: new Date().toISOString(),
    }));
  };

  const updateFlashcardProgress = (cardId: string, state: FlashcardState) => {
    setProgress(prev => ({
      ...prev,
      flashcardProgress: { ...prev.flashcardProgress, [cardId]: state },
      lastVisited: new Date().toISOString(),
    }));
  };

  const addBookmark = (bookmark: Omit<Bookmark, 'dateAdded'>) => {
    setProgress(prev => {
      if (prev.bookmarks.some(b => b.type === bookmark.type && b.id === bookmark.id)) return prev;
      return {
        ...prev,
        bookmarks: [...prev.bookmarks, { ...bookmark, dateAdded: new Date().toISOString() }],
        lastVisited: new Date().toISOString(),
      };
    });
  };

  const removeBookmark = (type: string, id: string) => {
    setProgress(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.filter(b => !(b.type === type && b.id === id)),
      lastVisited: new Date().toISOString(),
    }));
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(getStorageKey(currentUser));
    }
  };

  // CUSTOMIZE: Adjust cards per module as needed
  const getModuleProgress = (moduleId: string): number => {
    const cardsRead = progress.cardsRead[moduleId]?.length || 0;
    const cardsPerModule = 8;
    return Math.min(100, Math.round((cardsRead / cardsPerModule) * 100));
  };

  // CUSTOMIZE: Adjust total modules as needed
  const getTotalProgress = (): number => {
    const totalModules = 10;
    return Math.round((progress.modulesCompleted.length / totalModules) * 100);
  };

  return (
    <ProgressContext.Provider value={{
      progress, markModuleComplete, markCardRead, recordQuizAttempt,
      updateFlashcardProgress, addBookmark, removeBookmark, resetProgress,
      getModuleProgress, getTotalProgress,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within a ProgressProvider');
  return context;
}
```

---

## 6. TypeScript Interfaces

Complete type definitions for content structures.

```typescript
// src/types/content.ts

export interface Module {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  order: number;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  icon?: string;
  cards: Card[];
}

export interface Card {
  id: string;
  title: string;
  content: string;
  image?: {
    url: string;
    alt: string;
    caption?: string;
    credit?: string;
  };
  keyPoints?: string[];
  funFact?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  moduleId?: string;
  timeLimit?: number;
  passingScore: number;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  difficulty: 1 | 2 | 3;
  points: number;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  category: string;
  moduleId?: string;
  cards: Flashcard[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  image?: string;
  tags?: string[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  sortDate: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  image?: { url: string; alt: string };
  significance: 'minor' | 'major' | 'critical';
  relatedModules?: string[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  channel: string;
  duration: string;
  category: string;
  tags?: string[];
  relatedModules?: string[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  pronunciation?: string;
  category: string;
  relatedTerms?: string[];
  seeAlso?: string[];
}

export interface UserProgress {
  modulesCompleted: string[];
  cardsRead: Record<string, string[]>;
  quizAttempts: QuizAttempt[];
  flashcardProgress: Record<string, FlashcardState>;
  currentPath?: string;
  lastVisited: string;
  bookmarks: Bookmark[];
}

export interface QuizAttempt {
  quizId: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export interface FlashcardState {
  known: boolean;
  lastReviewed: string;
  reviewCount: number;
}

export interface Bookmark {
  type: string;
  id: string;
  title: string;
  dateAdded: string;
}
```

---

## 7. Root Layout Template

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppWrapper from '@/components/AppWrapper';
import { ProgressProvider } from '@/lib/progress-context';

const inter = Inter({ subsets: ['latin'] });

// CUSTOMIZE: App metadata
export const metadata: Metadata = {
  title: 'Your App Name',
  description: 'Your app description',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProgressProvider>
          <AppWrapper>{children}</AppWrapper>
        </ProgressProvider>
      </body>
    </html>
  );
}
```

---

## 8. Global CSS Template

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* CUSTOMIZE: Color palette */
  --bg-primary: #0a0806;
  --bg-secondary: #14120f;
  --bg-tertiary: #1e1c19;

  --text-primary: #e8dcc8;
  --text-secondary: #8b7355;
  --text-accent: #d4a574;

  --accent-primary: #d4a574;
  --accent-secondary: #a67c52;
  --accent-tertiary: #5a4a3a;

  --success: #4a7c59;
  --warning: #c4a048;
  --error: #c45c5c;
  --info: #5c8bc4;

  --border-subtle: rgba(212, 165, 116, 0.2);
  --border-medium: rgba(212, 165, 116, 0.3);
  --border-strong: rgba(212, 165, 116, 0.5);

  --background: var(--bg-primary);
  --foreground: var(--text-primary);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: 'Georgia', 'Palatino Linotype', serif;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--accent-tertiary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--accent-secondary);
}
```

---

## Usage Notes

1. **Replace all `// CUSTOMIZE` comments** with your app-specific values
2. **Update `APP_PREFIX`** in all components to match your app name
3. **Create content JSON files** following the schemas in the main framework doc
4. **Add intro assets** (audio, background image, character images) to `/public/intro/`
5. **Test localStorage** to ensure progress persists correctly between sessions

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-27 | Claude Code | Initial code templates |
