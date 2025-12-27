'use client';

import { useState, useEffect, ReactNode } from 'react';
import LandingPage from './LandingPage';

interface AppWrapperProps {
  children: ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const [showLanding, setShowLanding] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if user has already entered the app this session
    const hasEntered = sessionStorage.getItem('desert-foxes-entered');
    if (hasEntered === 'true') {
      setShowLanding(false);
    }
    setIsLoaded(true);
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem('desert-foxes-entered', 'true');
    setShowLanding(false);
  };

  // Don't render anything until we've checked sessionStorage
  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-[100]" style={{ backgroundColor: 'var(--background, #0d1117)' }} />
    );
  }

  if (showLanding) {
    return <LandingPage onEnter={handleEnter} />;
  }

  return <>{children}</>;
}
