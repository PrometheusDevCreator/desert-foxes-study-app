'use client';

import Link from 'next/link';
import { useProgress } from '@/lib/progress-context';
import { modules } from '@/lib/content-loader';

export default function ModulesPage() {
  const { getModuleProgress } = useProgress();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Study Modules</h1>
          <p className="text-[var(--foreground-muted)]">
            Explore the North African Campaign through {modules.length} structured learning modules.
          </p>
        </div>

        <div className="grid gap-6">
          {modules.map(module => {
            const progress = getModuleProgress(module.id);
            return (
              <Link
                key={module.id}
                href={`/modules/${module.id}`}
                className="card p-6 group hover:border-[var(--accent-sand)]/50 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-shrink-0">
                    <span className="w-12 h-12 rounded-xl bg-[var(--accent-sand)]/20 flex items-center justify-center text-[var(--accent-sand)] font-bold text-xl">
                      {module.number}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold group-hover:text-[var(--accent-sand)] transition-colors">
                        {module.title}
                      </h2>
                      <span className="text-xs text-[var(--foreground-muted)] bg-[var(--background-secondary)] px-2 py-1 rounded">
                        {module.estimatedTime}
                      </span>
                    </div>
                    <p className="text-[var(--foreground-muted)] mb-3">{module.subtitle}</p>
                    <p className="text-sm text-[var(--foreground-muted)]">{module.overview}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {module.keyIdeas.slice(0, 3).map((idea, idx) => (
                        <span key={idx} className="text-xs bg-[var(--background-secondary)] px-2 py-1 rounded">
                          {idea}
                        </span>
                      ))}
                      {module.keyIdeas.length > 3 && (
                        <span className="text-xs text-[var(--foreground-muted)]">
                          +{module.keyIdeas.length - 3} more
                        </span>
                      )}
                    </div>

                    {progress > 0 && (
                      <div className="mt-4">
                        <div className="progress-bar">
                          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-xs text-[var(--foreground-muted)]">{progress}% complete</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
