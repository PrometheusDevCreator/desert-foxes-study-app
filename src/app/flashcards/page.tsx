'use client';

import { useState } from 'react';
import { flashcards } from '@/lib/content-loader';

const categories = [
  { id: 'all', label: 'All Cards' },
  { id: 'date', label: 'Dates' },
  { id: 'person', label: 'People' },
  { id: 'location', label: 'Locations' },
  { id: 'fact', label: 'Facts' },
  { id: 'glossary', label: 'Terms' },
];

export default function FlashcardsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const filteredCards = selectedCategory === 'all'
    ? flashcards
    : flashcards.filter(f => f.category === selectedCategory);

  const currentCard = filteredCards[currentIndex];

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const shuffleCards = () => {
    setIsFlipped(false);
    setCurrentIndex(Math.floor(Math.random() * filteredCards.length));
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Flashcards</h1>
          <p className="text-[var(--foreground-muted)]">
            Test your knowledge with {flashcards.length} flashcards covering key facts, dates, people, and terms.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
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

        {/* View Toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-[var(--accent-sand)] hover:underline"
          >
            {showAll ? 'Show Single Card' : 'Show All Cards'}
          </button>
        </div>

        {showAll ? (
          /* Grid View */
          <div className="grid gap-4 md:grid-cols-2">
            {filteredCards.map((card, idx) => (
              <div key={card.id} className="card p-5">
                <div className="text-xs text-[var(--foreground-muted)] mb-2 capitalize">
                  {card.category}
                </div>
                <p className="font-bold mb-3">{card.front}</p>
                <p className="text-[var(--foreground-muted)] text-sm">{card.back}</p>
              </div>
            ))}
          </div>
        ) : (
          /* Single Card View */
          <>
            <div className="mb-4 text-center text-sm text-[var(--foreground-muted)]">
              Card {currentIndex + 1} of {filteredCards.length}
            </div>

            {currentCard && (
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="card p-8 min-h-[300px] flex flex-col items-center justify-center cursor-pointer hover:border-[var(--accent-sand)]/50 transition-all"
              >
                <div className="text-xs text-[var(--foreground-muted)] mb-4 capitalize">
                  {currentCard.category} {isFlipped ? '(Answer)' : '(Question)'}
                </div>
                <p className="text-xl text-center">
                  {isFlipped ? currentCard.back : currentCard.front}
                </p>
                <p className="text-sm text-[var(--foreground-muted)] mt-6">
                  Click to {isFlipped ? 'see question' : 'reveal answer'}
                </p>
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={prevCard}
                className="btn-secondary px-6"
              >
                ← Previous
              </button>
              <button
                onClick={shuffleCards}
                className="btn-secondary px-6"
              >
                🔀 Shuffle
              </button>
              <button
                onClick={nextCard}
                className="btn-primary px-6"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
