'use client';

import { useState, useEffect, ReactNode } from 'react';
import LandingPage from './LandingPage';
import IntroPage from './IntroPage';

interface AppWrapperProps {
  children: ReactNode;
}

type AppStage = 'loading' | 'landing' | 'intro' | 'app';

export default function AppWrapper({ children }: AppWrapperProps) {
  const [stage, setStage] = useState<AppStage>('loading');

  useEffect(() => {
    // Check if user has already entered the app this session
    const hasEntered = sessionStorage.getItem('desert-foxes-entered');
    if (hasEntered === 'true') {
      setStage('app');
    } else {
      setStage('landing');
    }
  }, []);

  const handleLandingEnter = () => {
    setStage('intro');
  };

  const handleIntroComplete = () => {
    sessionStorage.setItem('desert-foxes-entered', 'true');
    setStage('app');
  };

  // Loading state
  if (stage === 'loading') {
    return (
      <div className="fixed inset-0 z-[100]" style={{ backgroundColor: 'var(--background, #0d1117)' }} />
    );
  }

  // Landing page
  if (stage === 'landing') {
    return <LandingPage onEnter={handleLandingEnter} />;
  }

  // Cinematic intro
  if (stage === 'intro') {
    return <IntroPage onComplete={handleIntroComplete} />;
  }

  // Main app
  return <>{children}</>;
}
