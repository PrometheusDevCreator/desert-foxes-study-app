'use client';

import { useState } from 'react';
import Link from 'next/link';
import { glossary } from '@/lib/content-loader';

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTerms = glossary.filter(term =>
    term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by first letter
  const groupedTerms = filteredTerms.reduce((acc, term) => {
    const letter = term.term[0].toUpperCase();
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(term);
    return acc;
  }, {} as Record<string, typeof glossary>);

  const sortedLetters = Object.keys(groupedTerms).sort();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Glossary</h1>
          <p className="text-[var(--foreground-muted)]">
            {glossary.length} key terms and definitions from the North African Campaign.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96 px-4 py-3 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] focus:border-[var(--accent-sand)] focus:outline-none"
          />
        </div>

        {/* Quick Jump */}
        <div className="flex flex-wrap gap-2 mb-8">
          {sortedLetters.map(letter => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="w-8 h-8 flex items-center justify-center rounded bg-[var(--background-secondary)] hover:bg-[var(--accent-sand)] hover:text-black transition-all text-sm font-mono"
            >
              {letter}
            </a>
          ))}
        </div>

        {/* Terms */}
        <div className="space-y-8">
          {sortedLetters.map(letter => (
            <div key={letter} id={`letter-${letter}`}>
              <h2 className="text-2xl font-bold text-[var(--accent-sand)] mb-4 border-b border-[var(--border)] pb-2">
                {letter}
              </h2>
              <div className="space-y-4">
                {groupedTerms[letter].map(term => (
                  <div key={term.id} className="card p-5">
                    <dt className="text-lg font-bold mb-2">{term.term}</dt>
                    <dd className="text-[var(--foreground-muted)]">{term.definition}</dd>
                    {term.relatedModules.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[var(--border)]">
                        <span className="text-xs text-[var(--foreground-muted)]">Related modules: </span>
                        {term.relatedModules.map((moduleId, idx) => (
                          <Link
                            key={moduleId}
                            href={`/modules/${moduleId}`}
                            className="text-xs text-[var(--accent-sand)] hover:underline"
                          >
                            {moduleId}{idx < term.relatedModules.length - 1 ? ', ' : ''}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--foreground-muted)]">No terms found matching &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
