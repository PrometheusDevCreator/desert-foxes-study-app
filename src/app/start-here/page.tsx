'use client';

import Link from 'next/link';
import { useProgress } from '@/lib/progress-context';
import { learningPaths, modules, getModuleById } from '@/lib/content-loader';

export default function StartHerePage() {
  const { progress } = useProgress();

  const isModuleComplete = (modId: string) => {
    return progress.modulesCompleted.includes(modId);
  };

  const quickTourPath = learningPaths.find(p => p.id === 'quick-tour');

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Start Here</h1>
          <p className="text-[var(--foreground-muted)]">
            Welcome to Desert Foxes: Kevin&apos;s Study Room! Here&apos;s how to get the most out of your North African Campaign studies.
          </p>
        </div>

        {/* Quick Start Guide */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Start Guide</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-[var(--accent-sand)]/20 flex items-center justify-center text-[var(--accent-sand)] font-bold flex-shrink-0">1</span>
              <div>
                <h3 className="font-bold">Work through the Modules</h3>
                <p className="text-sm text-[var(--foreground-muted)]">
                  Start with Module 1 on Rommel and progress through each lesson. Each module contains study cards with &quot;Find Out More&quot; sections for deeper exploration.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-[var(--accent-sand)]/20 flex items-center justify-center text-[var(--accent-sand)] font-bold flex-shrink-0">2</span>
              <div>
                <h3 className="font-bold">Explore the Timeline</h3>
                <p className="text-sm text-[var(--foreground-muted)]">
                  Follow the North African Campaign from the Italian invasion of Egypt through the Axis surrender in Tunisia.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-[var(--accent-sand)]/20 flex items-center justify-center text-[var(--accent-sand)] font-bold flex-shrink-0">3</span>
              <div>
                <h3 className="font-bold">Test Your Knowledge</h3>
                <p className="text-sm text-[var(--foreground-muted)]">
                  Use flashcards for quick review and take quizzes to test your understanding of each module.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-[var(--accent-sand)]/20 flex items-center justify-center text-[var(--accent-sand)] font-bold flex-shrink-0">4</span>
              <div>
                <h3 className="font-bold">Visit the Arsenal</h3>
                <p className="text-sm text-[var(--foreground-muted)]">
                  Explore the tanks, aircraft, and equipment that fought in the desert from the Panzer III to the LRDG trucks.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Path */}
        {quickTourPath && (
          <div className="card p-6 mb-8 border-[var(--accent-sand)]/30">
            <div className="flex items-center gap-2 mb-4">
              <span className="badge badge-command">Recommended</span>
              <h2 className="text-xl font-bold">{quickTourPath.name}</h2>
            </div>
            <p className="text-[var(--foreground-muted)] mb-4">{quickTourPath.description}</p>
            <p className="text-sm text-[var(--foreground-muted)] mb-6">
              Estimated time: {quickTourPath.estimatedTime}
            </p>

            <h3 className="font-bold mb-3">Modules in this path:</h3>
            <div className="space-y-3">
              {quickTourPath.modules.map((moduleId, idx) => {
                const module = getModuleById(moduleId);
                if (!module) return null;
                const completed = isModuleComplete(moduleId);

                return (
                  <Link
                    key={moduleId}
                    href={`/modules/${moduleId}`}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                      completed
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-[var(--border)] hover:border-[var(--accent-sand)]/50'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      completed
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-[var(--accent-sand)]/20 text-[var(--accent-sand)]'
                    }`}>
                      {completed ? '✓' : idx + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-bold">{module.title}</h4>
                      <p className="text-sm text-[var(--foreground-muted)]">{module.estimatedTime}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* All Learning Paths */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">All Learning Paths</h2>
          <div className="grid gap-4">
            {learningPaths.map(path => (
              <div key={path.id} className="card p-5">
                <h3 className="font-bold mb-2">{path.name}</h3>
                <p className="text-sm text-[var(--foreground-muted)] mb-2">{path.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-[var(--background-secondary)] px-2 py-1 rounded">
                    {path.estimatedTime}
                  </span>
                  <span className="text-xs bg-[var(--background-secondary)] px-2 py-1 rounded">
                    {path.modules.length} modules
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/modules/rommel-desert-fox" className="btn-primary text-lg px-8 py-3">
            Begin Module 1: The Desert Fox →
          </Link>
        </div>
      </div>
    </div>
  );
}
