'use client';

import { useState } from 'react';
import Link from 'next/link';
import { timeline } from '@/lib/content-loader';

const categories = [
  { id: 'all', label: 'All Events' },
  { id: 'command', label: 'Military Operations' },
  { id: 'sas', label: 'SAS Operations' },
];

export default function TimelinePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredEvents = selectedCategory === 'all'
    ? timeline
    : timeline.filter(e => e.category === selectedCategory);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      command: 'bg-[var(--accent-rust)]',
      sas: 'bg-[var(--accent-sand)]',
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Campaign Timeline</h1>
          <p className="text-[var(--foreground-muted)]">
            Follow the key events of the North African Campaign from September 1940 to May 1943.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[var(--accent-sand)] text-black'
                  : 'bg-[var(--background-secondary)] hover:bg-[var(--background-secondary)]/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--border)]" />

          <div className="space-y-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="relative pl-12">
                {/* Timeline dot */}
                <div className={`absolute left-2 w-5 h-5 rounded-full ${getCategoryColor(event.category)} border-4 border-[var(--background)]`} />

                <div className="card p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-sm font-mono text-[var(--accent-sand)]">
                      {formatDate(event.date)}
                    </span>
                    {event.time && (
                      <span className="text-sm font-mono text-[var(--foreground-muted)]">
                        {event.time}
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(event.category)} ${event.category === 'sas' ? 'text-black' : 'text-white'}`}>
                      {event.category === 'sas' ? 'SAS' : event.category}
                    </span>
                    {event.importance === 'major' && (
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--accent-sand)]/20 text-[var(--accent-sand)]">
                        Major Event
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                  <p className="text-[var(--foreground-muted)] text-sm mb-3">{event.description}</p>

                  {event.location && (
                    <p className="text-xs text-[var(--foreground-muted)]">
                      {event.location}
                    </p>
                  )}

                  {event.relatedModules.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[var(--border)]">
                      <span className="text-xs text-[var(--foreground-muted)]">Related modules: </span>
                      {event.relatedModules.map((moduleId, idx) => (
                        <Link
                          key={moduleId}
                          href={`/modules/${moduleId}`}
                          className="text-xs text-[var(--accent-sand)] hover:underline"
                        >
                          {moduleId}{idx < event.relatedModules.length - 1 ? ', ' : ''}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
