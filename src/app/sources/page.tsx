'use client';

import { sources } from '@/lib/content-loader';

const typeIcons: Record<string, string> = {
  book: '📚',
  website: '🌐',
  documentary: '🎬',
  museum: '🏛️',
  archive: '📁',
  article: '📰',
};

export default function SourcesPage() {
  // Group by type
  const groupedSources = sources.reduce((acc, source) => {
    if (!acc[source.type]) {
      acc[source.type] = [];
    }
    acc[source.type].push(source);
    return acc;
  }, {} as Record<string, typeof sources>);

  const typeOrder = ['book', 'website', 'documentary', 'museum', 'archive', 'article'];
  const sortedTypes = typeOrder.filter(type => groupedSources[type]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sources & Credits</h1>
          <p className="text-[var(--foreground-muted)]">
            The content in this study app has been compiled from the following sources.
            We encourage you to explore these resources for deeper study.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="card p-5 mb-8 border-[var(--accent-sand)]/30">
          <p className="text-sm text-[var(--foreground-muted)]">
            <strong>Note:</strong> This app is designed for educational purposes.
            Content has been compiled from public domain sources and is not intended for commercial use.
            For academic work, please verify facts with primary sources.
          </p>
        </div>

        {/* Sources by Type */}
        <div className="space-y-8">
          {sortedTypes.map(type => (
            <div key={type}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>{typeIcons[type]}</span>
                <span className="capitalize">{type}s</span>
              </h2>
              <div className="space-y-4">
                {groupedSources[type].map(source => (
                  <div key={source.id} className="card p-5">
                    <h3 className="font-bold mb-1">{source.title}</h3>
                    {source.author && (
                      <p className="text-sm text-[var(--foreground-muted)]">
                        By {source.author}
                        {source.year && ` (${source.year})`}
                      </p>
                    )}
                    {source.publisher && (
                      <p className="text-sm text-[var(--foreground-muted)]">
                        {source.publisher}
                      </p>
                    )}
                    <p className="text-sm text-[var(--foreground-muted)] mt-2">
                      {source.description}
                    </p>
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--accent-sand)] hover:underline mt-2 inline-block"
                      >
                        Visit Resource →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mt-12 card p-6">
          <h2 className="text-xl font-bold mb-4">Recommended for Further Study</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-bold">Imperial War Museums</h3>
              <a href="https://www.iwm.org.uk" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accent-sand)] hover:underline">
                www.iwm.org.uk
              </a>
            </div>
            <div>
              <h3 className="font-bold">Australian War Memorial - Tobruk</h3>
              <a href="https://www.awm.gov.au" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accent-sand)] hover:underline">
                www.awm.gov.au
              </a>
            </div>
            <div>
              <h3 className="font-bold">The Tank Museum</h3>
              <a href="https://www.tankmuseum.org" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accent-sand)] hover:underline">
                www.tankmuseum.org
              </a>
            </div>
            <div>
              <h3 className="font-bold">National WWII Museum</h3>
              <a href="https://www.nationalww2museum.org" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accent-sand)] hover:underline">
                www.nationalww2museum.org
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
