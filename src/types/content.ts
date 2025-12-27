// Content Types for Desert Foxes Study App

export interface StudyCard {
  id: string;
  title: string;
  content: string;
  findOutMore?: string;
  sources: string[];
  images?: ImageItem[];
  videos?: VideoItem[];
}

export interface ImageItem {
  url: string;
  caption: string;
  credit: string;
  sourceLink: string;
  alt: string;
}

export interface VideoItem {
  title: string;
  channel: string;
  url: string;
  relevance: string;
  duration?: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  relatedModules: string[];
}

export interface QuizQuestion {
  id: string;
  moduleId: string;
  type: 'mcq' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Module {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  overview: string;
  keyIdeas: string[];
  cards: StudyCard[];
  glossaryTerms: string[];
  images: ImageItem[];
  videos: VideoItem[];
  quizQuestions: string[];
  estimatedTime: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  time?: string;
  title: string;
  description: string;
  category: 'afrika-korps' | '8th-army' | 'sas' | 'command' | 'armor' | 'air' | 'supply' | 'italian';
  location?: string;
  relatedModules: string[];
  images?: ImageItem[];
  importance: 'major' | 'significant' | 'minor';
}

export interface Source {
  id: string;
  type: 'book' | 'website' | 'documentary' | 'museum' | 'archive' | 'article';
  title: string;
  author?: string;
  publisher?: string;
  year?: string;
  url?: string;
  accessDate?: string;
  description: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: 'glossary' | 'fact' | 'date' | 'person' | 'location';
  moduleId?: string;
  lastReviewed?: string;
  confidence?: 'again' | 'good' | 'easy';
  nextReview?: string;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  modules: string[];
  focusAreas: string[];
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
  moduleId: string;
  date: string;
  score: number;
  totalQuestions: number;
  incorrectQuestions: string[];
}

export interface FlashcardState {
  lastReviewed: string;
  confidence: 'again' | 'good' | 'easy';
  reviewCount: number;
  nextReview: string;
}

export interface Bookmark {
  type: 'module' | 'card' | 'timeline' | 'glossary';
  id: string;
  title: string;
  dateAdded: string;
}

export interface DesertSite {
  id: string;
  name: string;
  type: 'battlefield' | 'museum' | 'memorial' | 'cemetery';
  location: string;
  description: string;
  whatItTeaches: string;
  visitTips?: string;
  website?: string;
}

// Alias for backwards compatibility
export type NormandySite = DesertSite;

export interface MuseumItem {
  id: string;
  name: string;
  type: 'tank' | 'vehicle' | 'aircraft' | 'weapon' | 'artillery' | 'equipment' | 'sasWeapon';
  nation: 'allied' | 'axis';
  country: string;
  description: string;
  specifications: Record<string, string>;
  desertRole: string;
  image: string;
  imageCredit: string;
  featured?: boolean;
  modifications?: Record<string, string>;
  famousRaids?: string[];
}

export interface HistoricalMap {
  id: string;
  title: string;
  description: string;
  image: string;
  credit: string;
  category: 'overview' | 'tobruk' | 'el-alamein' | 'german' | 'campaign' | 'logistics';
  relatedModules: string[];
}

export interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  url: string;
  thumbnail: string;
  duration: string;
  category: 'rommel' | 'campaign' | 'battles' | 'sas' | 'equipment' | 'documentary';
  description: string;
  relatedModules: string[];
  recommended: boolean;
}
