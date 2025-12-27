'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProgress } from '@/lib/progress-context';
import { getModuleById, modules, getGlossaryTerm } from '@/lib/content-loader';
import ImageWithFallback from '@/components/ImageWithFallback';
import Accordion from '@/components/Accordion';

export default function ModulePage() {
  const params = useParams();
  const moduleId = params.id as string;
  const module = getModuleById(moduleId);
  const { progress, markCardRead, markModuleComplete } = useProgress();

  // Helper functions
  const isCardRead = (modId: string, cardId: string) => {
    return progress.cardsRead[modId]?.includes(cardId) || false;
  };

  const isModuleComplete = (modId: string) => {
    return progress.modulesCompleted.includes(modId);
  };

  if (!module) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Module Not Found</h1>
          <p className="text-[var(--foreground-muted)] mb-6">
            The module you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/modules" className="btn-primary">
            Back to Modules
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = modules.findIndex(m => m.id === moduleId);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  const allCardsRead = module.cards.every(card => isCardRead(moduleId, card.id));

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/modules" className="text-[var(--accent-sand)] hover:underline mb-4 inline-block">
            ← Back to Modules
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="w-12 h-12 rounded-xl bg-[var(--accent-sand)]/20 flex items-center justify-center text-[var(--accent-sand)] font-bold text-xl">
              {module.number}
            </span>
            <div>
              <h1 className="text-3xl font-bold">{module.title}</h1>
              <p className="text-[var(--foreground-muted)]">{module.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-[var(--foreground-muted)]">
            <span>{module.estimatedTime}</span>
            <span>•</span>
            <span>{module.cards.length} study cards</span>
            {isModuleComplete(moduleId) && (
              <>
                <span>•</span>
                <span className="text-green-500">Completed</span>
              </>
            )}
          </div>
        </div>

        {/* Overview */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold mb-3">Overview</h2>
          <p className="text-[var(--foreground-muted)] mb-4">{module.overview}</p>

          <h3 className="font-bold mb-2">Key Ideas</h3>
          <ul className="list-disc list-inside text-[var(--foreground-muted)] space-y-1">
            {module.keyIdeas.map((idea, idx) => (
              <li key={idx}>{idea}</li>
            ))}
          </ul>
        </div>

        {/* Study Cards */}
        <div className="space-y-6 mb-8">
          <h2 className="text-xl font-bold">Study Cards</h2>
          {module.cards.map((card) => (
            <div
              key={card.id}
              className={`card p-6 ${isCardRead(moduleId, card.id) ? 'border-green-500/30' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold">{card.title}</h3>
                {isCardRead(moduleId, card.id) ? (
                  <span className="text-green-500 text-sm">Read</span>
                ) : (
                  <button
                    onClick={() => markCardRead(moduleId, card.id)}
                    className="text-sm text-[var(--accent-sand)] hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
              <p className="text-[var(--foreground-muted)] whitespace-pre-line">{card.content}</p>

              {card.findOutMore && (
                <Accordion title="Find Out More">
                  <p className="text-[var(--foreground-muted)] whitespace-pre-line">{card.findOutMore}</p>
                </Accordion>
              )}
            </div>
          ))}
        </div>

        {/* Images Gallery */}
        {module.images && module.images.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Historical Images</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {module.images.map((image, idx) => (
                <div key={idx} className="card overflow-hidden">
                  <div className="aspect-video bg-[var(--background-secondary)]">
                    <ImageWithFallback
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      fallbackText={image.caption?.slice(0, 20) || 'Image'}
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-[var(--foreground-muted)]">{image.caption}</p>
                    <p className="text-xs text-[var(--foreground-muted)] mt-2">
                      Credit: {image.credit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos Section */}
        {module.videos && module.videos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Recommended Videos</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {module.videos.map((video, idx) => (
                <a
                  key={idx}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-4 hover:border-[var(--accent-sand)]/50 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold group-hover:text-[var(--accent-sand)] transition-colors line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-sm text-[var(--foreground-muted)]">{video.channel}</p>
                      <p className="text-xs text-[var(--foreground-muted)] mt-1">{video.duration}</p>
                      <p className="text-xs text-[var(--foreground-muted)] mt-2">{video.relevance}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Glossary Terms */}
        {module.glossaryTerms.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Key Terms</h2>
            <div className="space-y-3">
              {module.glossaryTerms.map(termId => {
                const term = getGlossaryTerm(termId);
                if (!term) return null;
                return (
                  <div key={termId} className="border-b border-[var(--border)] pb-3 last:border-0">
                    <dt className="font-bold text-[var(--accent-sand)]">{term.term}</dt>
                    <dd className="text-sm text-[var(--foreground-muted)]">{term.definition}</dd>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Complete Module Button */}
        {allCardsRead && !isModuleComplete(moduleId) && (
          <div className="card p-6 mb-8 text-center border-[var(--accent-sand)]/50">
            <p className="mb-4">You&apos;ve read all the cards in this module!</p>
            <button
              onClick={() => markModuleComplete(moduleId)}
              className="btn-primary"
            >
              Mark Module as Complete
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-[var(--border)]">
          {prevModule ? (
            <Link href={`/modules/${prevModule.id}`} className="text-[var(--accent-sand)] hover:underline">
              ← {prevModule.title}
            </Link>
          ) : (
            <div />
          )}
          {nextModule ? (
            <Link href={`/modules/${nextModule.id}`} className="text-[var(--accent-sand)] hover:underline">
              {nextModule.title} →
            </Link>
          ) : (
            <Link href="/quizzes" className="btn-primary">
              Take a Quiz →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
