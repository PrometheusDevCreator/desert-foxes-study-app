# Prometheus Study App Framework
## Reusable Template for Client Learning Applications

**Version:** 1.0
**Author:** Claude Code (Engineering Agent)
**Authority:** Matthew (Founder)
**Date:** 2025-12-27

---

## 1. Overview

This framework provides a complete blueprint for reproducing the Desert Foxes Study App architecture for any educational subject. The system combines a modern Next.js/React frontend with structured content management, progress tracking, and immersive multimedia experiences.

### Core Value Proposition
- **Rapid Deployment**: Template-based content structure allows new apps in hours, not weeks
- **Subject Agnostic**: Content schema works for any domain (history, science, technical training, compliance)
- **Engaging Experience**: Cinematic intros, interactive elements, and gamified progress tracking
- **User-Specific Progress**: Individual profiles with persistent, per-user progress storage
- **Modern Stack**: Next.js 16+, TypeScript, Tailwind CSS, Vercel deployment

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                               │
│  Landing → Intro Animation → Login → Main Application           │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                       PRESENTATION LAYER                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Modules  │  │ Quizzes  │  │Flashcards│  │ Timeline │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Videos  │  │ Glossary │  │   Maps   │  │  Museum  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                        STATE LAYER                               │
│  UserContext ←→ ProgressContext ←→ localStorage/sessionStorage  │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                       CONTENT LAYER                              │
│  modules.json │ quizzes.json │ flashcards.json │ videos.json    │
│  timeline.json │ glossary.json │ maps.json │ sources.json       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Directory Structure

```
{app-name}/
├── public/
│   ├── intro/                    # Cinematic intro assets
│   │   ├── intro-music.mp3       # Background audio (~2 min)
│   │   ├── background.png        # Desert/themed background
│   │   └── character-*.png       # Character images for intro
│   ├── images/                   # Module/card images
│   └── maps/                     # Interactive map assets
│
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── page.tsx              # Home/dashboard
│   │   ├── modules/
│   │   │   ├── page.tsx          # Module listing
│   │   │   └── [id]/page.tsx     # Individual module view
│   │   ├── quizzes/page.tsx
│   │   ├── flashcards/page.tsx
│   │   ├── timeline/page.tsx
│   │   ├── videos/page.tsx
│   │   ├── glossary/page.tsx
│   │   ├── maps/page.tsx
│   │   ├── museum/page.tsx       # Media gallery
│   │   └── sources/page.tsx      # Academic sources
│   │
│   ├── components/
│   │   ├── AppWrapper.tsx        # Auth flow orchestrator
│   │   ├── LandingPage.tsx       # Initial splash screen
│   │   ├── IntroPage.tsx         # Cinematic intro sequence
│   │   ├── LoginPage.tsx         # User profile selection
│   │   ├── Navigation.tsx        # Main nav component
│   │   ├── ModuleCard.tsx        # Module display card
│   │   ├── QuizCard.tsx          # Quiz component
│   │   ├── FlashcardDeck.tsx     # Flashcard system
│   │   └── ProgressBar.tsx       # Progress visualization
│   │
│   ├── content/                  # JSON content files
│   │   ├── modules.json
│   │   ├── quizzes.json
│   │   ├── flashcards.json
│   │   ├── timeline.json
│   │   ├── videos.json
│   │   ├── glossary.json
│   │   ├── maps.json
│   │   └── sources.json
│   │
│   ├── lib/
│   │   └── progress-context.tsx  # Progress state management
│   │
│   └── types/
│       └── content.ts            # TypeScript interfaces
│
├── docs/
│   └── framework/                # This documentation
│
└── package.json
```

---

## 4. Content Schema Definitions

### 4.1 Modules Schema
```typescript
interface Module {
  id: string;                     // Unique identifier (e.g., "mod-01-introduction")
  title: string;                  // Display title
  subtitle?: string;              // Optional subtitle
  description: string;            // Brief overview (2-3 sentences)
  order: number;                  // Display order
  estimatedTime: string;          // e.g., "25 minutes"
  difficulty: "beginner" | "intermediate" | "advanced";
  prerequisites?: string[];       // Array of module IDs
  icon?: string;                  // Icon identifier or URL
  cards: Card[];                  // Learning content cards
}

interface Card {
  id: string;                     // Unique card ID
  title: string;
  content: string;                // Markdown-supported content
  image?: {
    url: string;
    alt: string;
    caption?: string;
    credit?: string;
  };
  keyPoints?: string[];           // Bullet points for quick reference
  funFact?: string;               // Engaging aside
}
```

### 4.2 Quiz Schema
```typescript
interface Quiz {
  id: string;
  title: string;
  description: string;
  moduleId?: string;              // Link to related module
  timeLimit?: number;             // Minutes (optional)
  passingScore: number;           // Percentage (e.g., 70)
  questions: Question[];
}

interface Question {
  id: string;
  type: "multiple-choice" | "true-false" | "fill-blank";
  question: string;
  options?: string[];             // For multiple choice
  correctAnswer: string | number; // Answer or index
  explanation: string;            // Shown after answering
  difficulty: 1 | 2 | 3;          // 1=easy, 3=hard
  points: number;
}
```

### 4.3 Flashcard Schema
```typescript
interface FlashcardDeck {
  id: string;
  title: string;
  category: string;
  moduleId?: string;
  cards: Flashcard[];
}

interface Flashcard {
  id: string;
  front: string;                  // Question/term
  back: string;                   // Answer/definition
  hint?: string;
  image?: string;
  tags?: string[];
}
```

### 4.4 Timeline Schema
```typescript
interface TimelineEvent {
  id: string;
  date: string;                   // Display date (e.g., "June 1941")
  sortDate: string;               // ISO date for sorting
  title: string;
  description: string;
  category: string;               // For filtering/coloring
  location?: string;
  image?: {
    url: string;
    alt: string;
  };
  significance: "minor" | "major" | "critical";
  relatedModules?: string[];
}
```

### 4.5 Video Schema
```typescript
interface Video {
  id: string;
  title: string;
  description: string;
  url: string;                    // YouTube/Vimeo URL
  thumbnail: string;
  channel: string;
  duration: string;               // e.g., "15:32"
  category: string;
  tags?: string[];
  relatedModules?: string[];
}
```

### 4.6 Glossary Schema
```typescript
interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  pronunciation?: string;
  category: string;
  relatedTerms?: string[];
  seeAlso?: string[];             // Module or source references
}
```

---

## 5. User Flow Architecture

### 5.1 Entry Flow
```
User Arrives
     │
     ▼
┌─────────────────┐
│  Landing Page   │ ← Atmospheric splash with "Enter" CTA
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Intro Sequence │ ← Cinematic text + images + audio (~2 min)
│                 │   Skip button appears after 5 seconds
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Login Page    │ ← Select existing profile or create new
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Main App       │ ← Full application with navigation
└─────────────────┘
```

### 5.2 Session Persistence
- `sessionStorage`: Current user session (`{app-prefix}-entered`, `{app-prefix}-current-user`)
- `localStorage`: User profiles (`{app-prefix}-users`), per-user progress (`{app-prefix}-progress-{username}`)

---

## 6. Theming System

### 6.1 Color Palette Template
```css
:root {
  /* Background Colors */
  --bg-primary: #0a0806;          /* Darkest background */
  --bg-secondary: #14120f;        /* Card backgrounds */
  --bg-tertiary: #1e1c19;         /* Elevated surfaces */

  /* Text Colors */
  --text-primary: #e8dcc8;        /* Main text */
  --text-secondary: #8b7355;      /* Muted text */
  --text-accent: #d4a574;         /* Highlighted text */

  /* Accent Colors */
  --accent-primary: #d4a574;      /* Primary accent (sepia/gold) */
  --accent-secondary: #a67c52;    /* Secondary accent */
  --accent-tertiary: #5a4a3a;     /* Subtle accent */

  /* Functional Colors */
  --success: #4a7c59;
  --warning: #c4a048;
  --error: #c45c5c;
  --info: #5c8bc4;

  /* Border Colors */
  --border-subtle: rgba(212, 165, 116, 0.2);
  --border-medium: rgba(212, 165, 116, 0.3);
  --border-strong: rgba(212, 165, 116, 0.5);
}
```

### 6.2 Typography
```css
/* Primary UI Font */
font-family: "'Georgia', 'Palatino Linotype', serif";

/* Code/Data Font */
font-family: "'Cascadia Code', 'Fira Code', monospace";

/* Cinematic/Title Font */
font-family: "'Palatino Linotype', 'Book Antiqua', Georgia, serif";
```

---

## 7. Component Templates

### 7.1 AppWrapper Pattern
```typescript
// Manages: loading → landing → intro → login → app stages
// Provides: UserContext with username and logout function
// Persists: Session state in sessionStorage
```

### 7.2 ProgressContext Pattern
```typescript
// Tracks: modulesCompleted, cardsRead, quizAttempts, flashcardProgress
// Storage: Per-user localStorage keys
// Methods: markModuleComplete, recordQuizAttempt, updateFlashcardProgress
```

### 7.3 Intro Sequence Pattern
```typescript
// Timing: Array of { start, fadeIn, display, fadeOut } for each text block
// Audio: Background music synced to text timing
// Images: Character images fade in/out at key moments
// Skip: Button appears after 5 seconds in bottom-right
```

---

## 8. Deployment Configuration

### 8.1 Vercel Settings
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

### 8.2 Environment Variables
```
# No backend required for client-side only version
# For future API integration:
# NEXT_PUBLIC_API_URL=https://api.example.com
```

---

## 9. Client Customization Checklist

When creating a new app for a client:

### Phase 1: Content Preparation
- [ ] Define subject domain and scope
- [ ] Gather source materials
- [ ] Create module structure (8-12 modules recommended)
- [ ] Write card content (6-10 cards per module)
- [ ] Prepare quiz questions (10-20 per quiz)
- [ ] Create flashcard decks
- [ ] Build timeline events
- [ ] Compile glossary terms
- [ ] Curate video resources
- [ ] Source images (ensure licensing)

### Phase 2: Theme Customization
- [ ] Define color palette appropriate to subject
- [ ] Select typography that matches tone
- [ ] Create/source background images
- [ ] Design intro sequence narrative
- [ ] Source/create intro audio
- [ ] Design character/icon images

### Phase 3: Technical Setup
- [ ] Clone template repository
- [ ] Update package.json with app name
- [ ] Replace content JSON files
- [ ] Update theming CSS variables
- [ ] Replace public assets
- [ ] Update intro text and timing
- [ ] Test all features
- [ ] Deploy to Vercel

### Phase 4: Quality Assurance
- [ ] Verify all video links work
- [ ] Check all images load
- [ ] Test progress tracking
- [ ] Test user profiles
- [ ] Verify mobile responsiveness
- [ ] Performance audit

---

## 10. Estimated Effort

| Component | Hours (Est.) |
|-----------|-------------|
| Content writing (10 modules) | 20-40 |
| Quiz creation | 8-12 |
| Flashcard creation | 4-8 |
| Timeline compilation | 4-6 |
| Glossary creation | 2-4 |
| Video curation | 2-4 |
| Image sourcing | 4-8 |
| Intro sequence | 4-8 |
| Theme customization | 4-8 |
| Testing & deployment | 4-8 |
| **Total** | **56-106 hours** |

---

## 11. Future Enhancements

Potential features for roadmap consideration:

1. **Backend Integration**: User accounts, cloud sync, leaderboards
2. **AI Quiz Generation**: Generate quizzes from module content
3. **Spaced Repetition**: SM-2 algorithm for flashcards
4. **Achievement System**: Badges, streaks, gamification
5. **Collaborative Features**: Study groups, shared notes
6. **Offline Support**: PWA with service workers
7. **Analytics Dashboard**: Learning insights, progress reports
8. **Multi-language Support**: i18n framework integration

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-27 | Claude Code | Initial framework documentation |

**Authority Chain**: Matthew (Founder) → Sarah (Controller) → Claude Code (Engineering)
