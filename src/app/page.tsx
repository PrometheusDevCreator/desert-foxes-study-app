'use client';

import Link from 'next/link';
import { useProgress } from '@/lib/progress-context';
import { modules, learningPaths } from '@/lib/content-loader';

export default function HomePage() {
  const { progress, getTotalProgress, getModuleProgress } = useProgress();

  const recentModules = modules.slice(0, 3);
  const featuredPath = learningPaths.find(p => p.id === 'quick-tour');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-b from-[var(--background-secondary)] to-[var(--background)]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-[var(--accent-sand)]/10 border border-[var(--accent-sand)]/30">
            <span className="text-[var(--accent-sand)] text-sm font-medium">
              Interactive North African Campaign Study
            </span>
          </div>

          {/* Afrika Korps Palm Tree Symbol */}
          <div className="mb-6">
            <svg viewBox="0 0 200 200" className="w-32 h-32 mx-auto" aria-label="Afrika Korps Palm Symbol">
              {/* Palm trunk */}
              <path
                d="M100 180 L100 90 Q95 85 100 80 Q105 85 100 90"
                stroke="var(--accent-sand)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
              {/* Palm fronds - left side */}
              <path
                d="M100 85 Q60 70 30 80"
                stroke="var(--accent-sand)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M100 80 Q55 55 25 55"
                stroke="var(--accent-sand)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M100 75 Q65 40 40 30"
                stroke="var(--accent-sand)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              {/* Palm fronds - right side */}
              <path
                d="M100 85 Q140 70 170 80"
                stroke="var(--accent-sand)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M100 80 Q145 55 175 55"
                stroke="var(--accent-sand)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M100 75 Q135 40 160 30"
                stroke="var(--accent-sand)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              {/* Center frond */}
              <path
                d="M100 80 Q100 50 100 25"
                stroke="var(--accent-sand)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              {/* Swastika removed - historically accurate but inappropriate */}
              {/* Base sand dune */}
              <ellipse cx="100" cy="185" rx="40" ry="8" fill="var(--accent-sand)" opacity="0.3" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            The <span className="text-[var(--accent-sand)]">Desert Foxes</span>
            <br />
            <span className="text-2xl md:text-3xl font-normal text-[var(--foreground-muted)]">
              Kevin&apos;s Study Room
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto mb-8 leading-relaxed">
            Explore the North African Campaign, Rommel&apos;s desert warfare genius, and the
            birth of the SAS through structured lessons, interactive timelines, and engaging quizzes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/start-here" className="btn-primary text-lg px-8 py-3">
              Start Learning
            </Link>
            <Link href="/modules" className="btn-secondary text-lg px-8 py-3">
              Browse Modules
            </Link>
          </div>
        </div>

        {/* Decorative timeline preview */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)] mb-2">
            <span>September 1940</span>
            <span>May 1943</span>
          </div>
          <div className="h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--accent-rust)] via-[var(--accent-sand)] to-[var(--accent-khaki)]"
              style={{ width: '100%' }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-[var(--foreground-muted)]">
            <span>Italian Invasion</span>
            <span>Desert War</span>
            <span>Axis Surrender</span>
          </div>
        </div>
      </section>

      {/* Progress Section (only show if user has started) */}
      {getTotalProgress() > 0 && (
        <section className="py-12 px-4 bg-[var(--background-secondary)] border-y border-[var(--border)]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="text-3xl font-bold text-[var(--accent-sand)]">
                  {getTotalProgress()}%
                </div>
                <div className="text-sm text-[var(--foreground-muted)]">Overall Complete</div>
                <div className="mt-3 progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${getTotalProgress()}%` }} />
                </div>
              </div>
              <div className="card p-6">
                <div className="text-3xl font-bold text-[var(--accent-sand)]">
                  {progress.modulesCompleted.length}
                </div>
                <div className="text-sm text-[var(--foreground-muted)]">Modules Completed</div>
              </div>
              <div className="card p-6">
                <div className="text-3xl font-bold text-[var(--accent-sand)]">
                  {progress.quizAttempts.length}
                </div>
                <div className="text-sm text-[var(--foreground-muted)]">Quizzes Taken</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Learning Path */}
      {featuredPath && (
        <section className="py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Recommended Path</h2>
            <div className="card p-6 md:p-8 border-[var(--accent-sand)]/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="badge badge-command mb-2">Featured</span>
                  <h3 className="text-xl font-bold mb-2">{featuredPath.name}</h3>
                  <p className="text-[var(--foreground-muted)]">{featuredPath.description}</p>
                  <p className="text-sm text-[var(--foreground-muted)] mt-2">
                    Estimated time: {featuredPath.estimatedTime}
                  </p>
                </div>
                <Link href="/start-here" className="btn-primary whitespace-nowrap">
                  Start This Path
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Module Preview */}
      <section className="py-12 px-4 bg-[var(--background-secondary)]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Study Modules</h2>
            <Link href="/modules" className="text-[var(--accent-sand)] hover:underline">
              View all {modules.length} modules
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentModules.map(module => (
              <Link key={module.id} href={`/modules/${module.id}`} className="card p-6 group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-lg bg-[var(--accent-sand)]/20 flex items-center justify-center text-[var(--accent-sand)] font-bold">
                    {module.number}
                  </span>
                  <span className="text-xs text-[var(--foreground-muted)]">{module.estimatedTime}</span>
                </div>
                <h3 className="font-bold mb-2 group-hover:text-[var(--accent-sand)] transition-colors">
                  {module.title}
                </h3>
                <p className="text-sm text-[var(--foreground-muted)] line-clamp-2">
                  {module.subtitle}
                </p>
                {getModuleProgress(module.id) > 0 && (
                  <div className="mt-4">
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${getModuleProgress(module.id)}%` }} />
                    </div>
                    <span className="text-xs text-[var(--foreground-muted)]">{getModuleProgress(module.id)}% complete</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Study Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/timeline" className="card p-6 text-center group hover:border-[var(--accent-sand)]/50">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-[var(--accent-sand)]/10 flex items-center justify-center text-[var(--accent-sand)] font-bold text-lg">T</div>
              <h3 className="font-bold mb-1 group-hover:text-[var(--accent-sand)]">Timeline</h3>
              <p className="text-xs text-[var(--foreground-muted)]">35+ key events</p>
            </Link>
            <Link href="/maps" className="card p-6 text-center group hover:border-[var(--accent-sand)]/50">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-[var(--accent-sand)]/10 flex items-center justify-center text-[var(--accent-sand)] font-bold text-lg">M</div>
              <h3 className="font-bold mb-1 group-hover:text-[var(--accent-sand)]">Map Room</h3>
              <p className="text-xs text-[var(--foreground-muted)]">Desert campaign maps</p>
            </Link>
            <Link href="/flashcards" className="card p-6 text-center group hover:border-[var(--accent-sand)]/50">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-[var(--accent-sand)]/10 flex items-center justify-center text-[var(--accent-sand)] font-bold text-lg">F</div>
              <h3 className="font-bold mb-1 group-hover:text-[var(--accent-sand)]">Flashcards</h3>
              <p className="text-xs text-[var(--foreground-muted)]">35+ cards</p>
            </Link>
            <Link href="/quizzes" className="card p-6 text-center group hover:border-[var(--accent-sand)]/50">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-[var(--accent-sand)]/10 flex items-center justify-center text-[var(--accent-sand)] font-bold text-lg">Q</div>
              <h3 className="font-bold mb-1 group-hover:text-[var(--accent-sand)]">Quizzes</h3>
              <p className="text-xs text-[var(--foreground-muted)]">Test your knowledge</p>
            </Link>
          </div>
        </div>
      </section>

      {/* SAS Highlight */}
      <section className="py-12 px-4 bg-[var(--background-secondary)]">
        <div className="max-w-5xl mx-auto">
          <div className="card p-6 md:p-8 border-[var(--accent-sand)]/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--accent-sand)]/20 border border-[var(--accent-sand)]/30 flex items-center justify-center text-[var(--accent-sand)] font-bold text-lg flex-shrink-0">SAS</div>
              <div>
                <h2 className="text-xl font-bold mb-2">Birth of the SAS</h2>
                <p className="text-[var(--foreground-muted)] mb-4">
                  Discover how David Stirling created the Special Air Service in the
                  North African desert, pioneering special forces tactics that would
                  influence military operations worldwide. From Jock Lewes bombs to
                  jeep-mounted raids, explore the origins of modern special warfare.
                </p>
                <Link href="/modules/birth-of-sas" className="text-[var(--accent-sand)] hover:underline">
                  Learn about the SAS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">The North African Campaign by the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--accent-sand)]">3 Years</div>
              <div className="text-sm text-[var(--foreground-muted)]">Duration of campaign</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--accent-sand)]">1,500+</div>
              <div className="text-sm text-[var(--foreground-muted)]">Miles of desert warfare</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--accent-sand)]">275,000</div>
              <div className="text-sm text-[var(--foreground-muted)]">Axis troops surrendered</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--accent-sand)]">400+</div>
              <div className="text-sm text-[var(--foreground-muted)]">Aircraft destroyed by SAS</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
