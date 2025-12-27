# Project Briefing: Desert Foxes Study App
## Context Package for Sarah (Prometheus Project Officer AI)

**Document Type:** Implementation Summary & Handoff Brief
**Date:** 2025-12-27
**Author:** Claude Code (Engineering Agent)
**Authority:** Matthew (Founder)
**Status:** Production Deployed

---

## Executive Summary

The **Desert Foxes Study App** is a complete, production-ready educational application built with Next.js 16, TypeScript, and Tailwind CSS. It serves as a proof-of-concept and template for the Prometheus courseware generation ecosystem, demonstrating how structured content can be delivered through an engaging, user-friendly interface.

**Live URL:** https://desert-foxes-study-app.vercel.app

This document provides the context package required for Sarah to understand the implementation, integrate learnings into Prometheus architecture decisions, and guide future learning app development projects.

---

## 1. Project Origin & Purpose

### 1.1 Initial Request
Matthew requested an interactive study application for WWII North African Campaign history, specifically focused on the Afrika Korps and SAS operations. The target audience is a friend ("Kevin") preparing to study this subject.

### 1.2 Scope Evolution
The project evolved through multiple sessions:
1. **Session 1:** Core structure, modules, quizzes, flashcards, timeline
2. **Session 2:** Cinematic intro sequence with audio/visuals
3. **Session 3:** Video curation, image fixes, Skip Intro button, user login system
4. **Session 4:** Framework documentation for replication

### 1.3 Strategic Value
The app demonstrates:
- Rapid courseware deployment (built in ~4-6 hours across sessions)
- Engaging presentation layer separate from content
- Template-based architecture enabling subject-agnostic replication
- User-specific progress tracking without backend infrastructure

---

## 2. Technical Architecture

### 2.1 Stack
| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.1.1 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS Variables |
| State | React Context API |
| Storage | localStorage + sessionStorage |
| Deployment | Vercel |

### 2.2 Architecture Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│                         ENTRY FLOW                               │
│  LandingPage → IntroPage (cinematic) → LoginPage → MainApp      │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    CONTEXT PROVIDERS                             │
│  AppWrapper (UserContext) ←→ ProgressProvider (ProgressContext) │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                       PAGE ROUTES                                │
│  /modules, /quizzes, /flashcards, /timeline, /videos,           │
│  /glossary, /maps, /museum, /sources, /start-here               │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                     CONTENT LAYER                                │
│  JSON files: modules, quizzes, flashcards, timeline, videos,    │
│  glossary, maps, sources                                        │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Key Design Decisions

**Decision 1: No Backend**
- Rationale: Speed to deployment, zero infrastructure costs, works offline
- Trade-off: No cloud sync, no cross-device progress
- Mitigation: localStorage is per-user with username-prefixed keys

**Decision 2: JSON Content Files**
- Rationale: Easy editing, version control, no database setup
- Trade-off: Manual content updates require redeployment
- Future: Could integrate with Prometheus PKE for dynamic content

**Decision 3: Cinematic Intro**
- Rationale: Creates emotional engagement, sets tone for learning
- Implementation: Timed text reveals synced to 2-minute audio track
- User Option: Skip button appears after 5 seconds

**Decision 4: User Profiles Without Auth**
- Rationale: Balance between personalization and friction
- Implementation: Usernames stored in localStorage, current session in sessionStorage
- Security: No sensitive data, acceptable for study app context

---

## 3. Content Structure

### 3.1 Module System
- **10 modules** covering North African Campaign chronologically
- Each module contains **6-10 cards** with rich content
- Cards include: text, images, key points, fun facts
- Progress tracked per-user at card and module level

### 3.2 Assessment System
- **Quizzes:** Multiple choice with explanations and scoring
- **Flashcards:** Front/back cards with category grouping
- Both track completion status per user

### 3.3 Reference Materials
- **Timeline:** Chronological events with filtering
- **Glossary:** Military terms and definitions
- **Videos:** Curated YouTube content from verified channels
- **Sources:** Academic citations for fact-checking
- **Maps:** Interactive campaign maps
- **Museum:** Image gallery with historical photos

---

## 4. Implementation Details

### 4.1 Files Modified/Created (Session 3-4)

| File | Purpose |
|------|---------|
| `src/components/IntroPage.tsx` | Added Skip Intro button (5-second delay) |
| `src/components/LoginPage.tsx` | **NEW** - User profile selection/creation |
| `src/components/AppWrapper.tsx` | Added login stage, UserContext |
| `src/lib/progress-context.tsx` | Per-user progress with storage key prefix |
| `src/content/videos.json` | Fixed 7 broken YouTube links |
| `src/content/modules.json` | Fixed 88mm Flak gun image URL |
| `docs/framework/STUDY_APP_FRAMEWORK.md` | **NEW** - Replication framework |
| `docs/framework/CODE_TEMPLATES.md` | **NEW** - Reusable code patterns |
| `docs/framework/SARAH_BRIEFING.md` | **NEW** - This document |

### 4.2 User Flow State Machine
```
loading → landing → intro → login → app
    │                    │       │
    └─ (session exists)──┴───────┴─→ app
```

### 4.3 Storage Schema
```javascript
// Session Storage (current session only)
'desert-foxes-entered': 'true'
'desert-foxes-current-user': 'Kevin'

// Local Storage (persistent)
'desert-foxes-users': [{ username: 'Kevin', createdAt: '2025-12-27T...' }]
'desert-foxes-progress-kevin': { modulesCompleted: [...], cardsRead: {...}, ... }
```

---

## 5. Lessons Learned

### 5.1 What Worked Well
1. **JSON-based content** enables rapid iteration
2. **Cinematic intro** creates memorable first impression
3. **Progress context** pattern cleanly separates state management
4. **Tailwind + CSS variables** provides theming flexibility
5. **Vercel deployment** is frictionless for Next.js

### 5.2 Challenges Encountered
1. **YouTube link rot:** External video URLs break; need verification workflow
2. **Wikimedia rate limiting:** Direct file URLs can return 429; use thumbnail URLs
3. **Intro timing:** Syncing text to audio requires careful iteration
4. **Mobile testing:** Need more responsive design attention

### 5.3 Recommendations for Future Projects
1. **Video verification step:** Use Playwright to verify YouTube URLs before deployment
2. **Image hosting:** Consider dedicated image CDN vs external URLs
3. **Content validation:** Create JSON schema validation for content files
4. **Accessibility audit:** Add ARIA labels, keyboard navigation, screen reader support

---

## 6. Framework for Replication

### 6.1 Created Documentation
Two comprehensive documents created for future client projects:

**STUDY_APP_FRAMEWORK.md**
- Complete architecture overview
- Content schema definitions (TypeScript interfaces)
- Directory structure template
- Theming system with CSS variables
- Client customization checklist
- Effort estimation (56-106 hours per app)

**CODE_TEMPLATES.md**
- AppWrapper component (entry flow orchestration)
- LandingPage component (atmospheric splash)
- IntroPage component (cinematic sequence with audio)
- LoginPage component (profile selection)
- ProgressContext (per-user state management)
- TypeScript interfaces (all content types)
- Root layout and global CSS templates

### 6.2 Replication Process
```
1. Clone template or copy structure
2. Update APP_PREFIX in all components
3. Create content JSON files for new subject
4. Customize theming (colors, typography)
5. Create intro assets (audio, images)
6. Deploy to Vercel
```

---

## 7. Integration with Prometheus Ecosystem

### 7.1 Alignment with Constitution
This implementation adheres to Prometheus principles:
- **Repeatability:** Template-based architecture ensures consistent output
- **Constraint Compliance:** Content schema enforces structure
- **Transparency:** All code is readable, no hidden logic

### 7.2 PKE Integration Opportunity
The content JSON structure could be:
- **Generated by PKE:** Topic → Module → Card hierarchy matches PKE output
- **Validated against schemas:** Content validation before deployment
- **Versioned in PKE corpus:** Track content evolution

### 7.3 Generation Engine Opportunity
Future workflow:
```
Client Brief → PKE Knowledge Retrieval → Generation Engine →
Content JSON → Study App Template → Deployment
```

### 7.4 Orchestrator Workflow
Potential automated pipeline:
1. Sarah receives client brief
2. Claude generates content structure
3. PKE retrieves domain knowledge
4. Generation Engine produces JSON content
5. Template populated and deployed
6. Sarah validates and reports completion

---

## 8. Metrics & Status

### 8.1 Current Status
| Metric | Value |
|--------|-------|
| Deployment Status | Production |
| Build Status | Passing |
| Total Modules | 10 |
| Total Quiz Questions | ~100 |
| Total Flashcards | ~50 |
| Total Videos | 7 (verified) |
| Timeline Events | ~30 |
| Glossary Terms | ~50 |

### 8.2 Known Issues
1. Mobile nav could be improved (hamburger menu needed)
2. Some images load slowly (external URLs)
3. No analytics tracking (could add Vercel Analytics)

### 8.3 Future Enhancement Candidates
- Spaced repetition for flashcards (SM-2 algorithm)
- Achievement/badge system
- Study streaks tracking
- Export progress as PDF
- Dark/light theme toggle

---

## 9. Handoff Checklist

For Sarah to proceed with new learning app projects:

- [x] Framework documentation complete
- [x] Code templates documented
- [x] Content schemas defined
- [x] Theming system documented
- [x] Deployment process documented
- [x] Example implementation (Desert Foxes) live
- [ ] Client brief template (to be created)
- [ ] Content generation workflow (pending PKE integration)
- [ ] Automated deployment pipeline (pending orchestrator)

---

## 10. Next Steps

### Immediate (Ready Now)
1. Use framework to create new study apps for clients
2. Content creation can begin with JSON templates
3. Theming can be customized per client

### Short-term (Pending Development)
1. Connect to Prometheus PKE for content retrieval
2. Integrate with Generation Engine for content creation
3. Create Orchestrator workflow for automated deployment

### Long-term (Roadmap)
1. Multi-tenant platform (single deployment, multiple apps)
2. Backend API for cloud sync and analytics
3. AI-powered quiz generation from module content
4. Mobile app versions (React Native)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-27 | Claude Code | Initial briefing document |

**Classification:** Internal - Prometheus Team
**Distribution:** Matthew (Founder), Sarah (Controller), Claude Code (Engineering)

---

## Appendix A: Repository Location

**Local Path:** `C:\Users\matt_\OneDrive\Desktop\desert-foxes-study-app`
**Live URL:** https://desert-foxes-study-app.vercel.app
**Framework Docs:** `docs/framework/`

---

*End of Briefing Document*
