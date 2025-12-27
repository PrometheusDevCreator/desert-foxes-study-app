import { Module, TimelineEvent, GlossaryTerm, QuizQuestion, Source, Flashcard, LearningPath, NormandySite, MuseumItem, HistoricalMap, YouTubeVideo } from '@/types/content';

// Import all content statically for Next.js
import modulesData from '@/content/modules.json';
import timelineData from '@/content/timeline.json';
import glossaryData from '@/content/glossary.json';
import quizBankData from '@/content/quizbank.json';
import sourcesData from '@/content/sources.json';
import flashcardsData from '@/content/flashcards.json';
import learningPathsData from '@/content/learning-paths.json';
import normandySitesData from '@/content/normandy-sites.json';
import museumData from '@/content/museum.json';
import historicalMapsData from '@/content/historical-maps.json';
import videosData from '@/content/videos.json';

// Type assertions for imported data
export const modules: Module[] = modulesData as Module[];
export const timeline: TimelineEvent[] = timelineData as TimelineEvent[];
export const glossary: GlossaryTerm[] = glossaryData as GlossaryTerm[];
export const quizBank: QuizQuestion[] = quizBankData as QuizQuestion[];
export const sources: Source[] = sourcesData as Source[];
export const flashcards: Flashcard[] = flashcardsData as Flashcard[];
export const learningPaths: LearningPath[] = learningPathsData as LearningPath[];
export const normandySites: NormandySite[] = normandySitesData as NormandySite[];
export const museumItems: MuseumItem[] = museumData as unknown as MuseumItem[];
export const historicalMaps: HistoricalMap[] = historicalMapsData as HistoricalMap[];
export const videos: YouTubeVideo[] = videosData as YouTubeVideo[];

// Helper functions
export function getModuleById(id: string): Module | undefined {
  return modules.find(m => m.id === id);
}

export function getModuleByNumber(num: number): Module | undefined {
  return modules.find(m => m.number === num);
}

export function getGlossaryTerm(id: string): GlossaryTerm | undefined {
  return glossary.find(g => g.id === id);
}

export function getGlossaryTermByName(term: string): GlossaryTerm | undefined {
  return glossary.find(g => g.term.toLowerCase() === term.toLowerCase());
}

export function getQuizQuestionsForModule(moduleId: string): QuizQuestion[] {
  return quizBank.filter(q => q.moduleId === moduleId);
}

export function getTimelineEventsByCategory(category: string): TimelineEvent[] {
  return timeline.filter(e => e.category === category);
}

export function getTimelineEventsByDateRange(start: string, end: string): TimelineEvent[] {
  return timeline.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate >= new Date(start) && eventDate <= new Date(end);
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getSourceById(id: string): Source | undefined {
  return sources.find(s => s.id === id);
}

export function getLearningPathById(id: string): LearningPath | undefined {
  return learningPaths.find(p => p.id === id);
}

export function getFlashcardsByCategory(category: string): Flashcard[] {
  return flashcards.filter(f => f.category === category);
}

export function getFlashcardsForModule(moduleId: string): Flashcard[] {
  return flashcards.filter(f => f.moduleId === moduleId);
}

export function getRelatedModulesForEvent(eventId: string): Module[] {
  const event = timeline.find(e => e.id === eventId);
  if (!event) return [];
  return event.relatedModules.map(id => getModuleById(id)).filter((m): m is Module => m !== undefined);
}

export function searchGlossary(query: string): GlossaryTerm[] {
  const lowerQuery = query.toLowerCase();
  return glossary.filter(
    g => g.term.toLowerCase().includes(lowerQuery) ||
         g.definition.toLowerCase().includes(lowerQuery)
  );
}

export function searchTimeline(query: string): TimelineEvent[] {
  const lowerQuery = query.toLowerCase();
  return timeline.filter(
    e => e.title.toLowerCase().includes(lowerQuery) ||
         e.description.toLowerCase().includes(lowerQuery)
  );
}
