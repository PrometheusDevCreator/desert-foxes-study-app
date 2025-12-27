'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserProgress, QuizAttempt, FlashcardState, Bookmark } from '@/types/content';

const STORAGE_KEY_PREFIX = 'desert-foxes-progress-';

function getStorageKey(username: string | null): string {
  return username ? `${STORAGE_KEY_PREFIX}${username.toLowerCase()}` : 'desert-foxes-study-progress';
}

const defaultProgress: UserProgress = {
  modulesCompleted: [],
  cardsRead: {},
  quizAttempts: [],
  flashcardProgress: {},
  currentPath: undefined,
  lastVisited: new Date().toISOString(),
  bookmarks: [],
};

interface ProgressContextType {
  progress: UserProgress;
  markModuleComplete: (moduleId: string) => void;
  markCardRead: (moduleId: string, cardId: string) => void;
  recordQuizAttempt: (attempt: QuizAttempt) => void;
  updateFlashcardProgress: (cardId: string, state: FlashcardState) => void;
  setCurrentPath: (pathId: string | undefined) => void;
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

  // Load from localStorage on mount and when user changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const username = sessionStorage.getItem('desert-foxes-current-user');
      setCurrentUser(username);

      const storageKey = getStorageKey(username);
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProgress({ ...defaultProgress, ...parsed });
        } catch (e) {
          console.error('Failed to parse progress:', e);
          setProgress(defaultProgress);
        }
      } else {
        setProgress(defaultProgress);
      }
      setIsLoaded(true);
    }
  }, []);

  // Listen for user changes (e.g., logout/login)
  useEffect(() => {
    const handleStorageChange = () => {
      const username = sessionStorage.getItem('desert-foxes-current-user');
      if (username !== currentUser) {
        setCurrentUser(username);
        const storageKey = getStorageKey(username);
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setProgress({ ...defaultProgress, ...parsed });
          } catch (e) {
            setProgress(defaultProgress);
          }
        } else {
          setProgress(defaultProgress);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentUser]);

  // Save to localStorage on change
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
        cardsRead: {
          ...prev.cardsRead,
          [moduleId]: [...moduleCards, cardId],
        },
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
      flashcardProgress: {
        ...prev.flashcardProgress,
        [cardId]: state,
      },
      lastVisited: new Date().toISOString(),
    }));
  };

  const setCurrentPath = (pathId: string | undefined) => {
    setProgress(prev => ({
      ...prev,
      currentPath: pathId,
      lastVisited: new Date().toISOString(),
    }));
  };

  const addBookmark = (bookmark: Omit<Bookmark, 'dateAdded'>) => {
    setProgress(prev => {
      const exists = prev.bookmarks.some(
        b => b.type === bookmark.type && b.id === bookmark.id
      );
      if (exists) return prev;
      return {
        ...prev,
        bookmarks: [
          ...prev.bookmarks,
          { ...bookmark, dateAdded: new Date().toISOString() },
        ],
        lastVisited: new Date().toISOString(),
      };
    });
  };

  const removeBookmark = (type: string, id: string) => {
    setProgress(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.filter(
        b => !(b.type === type && b.id === id)
      ),
      lastVisited: new Date().toISOString(),
    }));
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
    if (typeof window !== 'undefined') {
      const storageKey = getStorageKey(currentUser);
      localStorage.removeItem(storageKey);
    }
  };

  const getModuleProgress = (moduleId: string): number => {
    const cardsRead = progress.cardsRead[moduleId]?.length || 0;
    // Assume 8 cards per module as default
    return Math.min(100, Math.round((cardsRead / 8) * 100));
  };

  const getTotalProgress = (): number => {
    const totalModules = 10;
    return Math.round((progress.modulesCompleted.length / totalModules) * 100);
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markModuleComplete,
        markCardRead,
        recordQuizAttempt,
        updateFlashcardProgress,
        setCurrentPath,
        addBookmark,
        removeBookmark,
        resetProgress,
        getModuleProgress,
        getTotalProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
