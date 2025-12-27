'use client';

import { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import LandingPage from './LandingPage';
import IntroPage from './IntroPage';
import LoginPage from './LoginPage';

interface AppWrapperProps {
  children: ReactNode;
}

type AppStage = 'loading' | 'landing' | 'intro' | 'login' | 'app';

// User context for accessing current user throughout the app
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
    // Check if user has already entered the app this session
    const hasEntered = sessionStorage.getItem('desert-foxes-entered');
    const savedUser = sessionStorage.getItem('desert-foxes-current-user');

    if (hasEntered === 'true' && savedUser) {
      setCurrentUser(savedUser);
      setStage('app');
    } else {
      setStage('landing');
    }
  }, []);

  const handleLandingEnter = () => {
    setStage('intro');
  };

  const handleIntroComplete = () => {
    setStage('login');
  };

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    sessionStorage.setItem('desert-foxes-entered', 'true');
    sessionStorage.setItem('desert-foxes-current-user', username);
    setStage('app');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('desert-foxes-entered');
    sessionStorage.removeItem('desert-foxes-current-user');
    setStage('login');
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

  // Login page
  if (stage === 'login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Main app with user context
  return (
    <UserContext.Provider value={{ username: currentUser, logout: handleLogout }}>
      {children}
    </UserContext.Provider>
  );
}
