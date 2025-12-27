'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProgress } from '@/lib/progress-context';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/start-here', label: 'Start Here' },
  { href: '/modules', label: 'Modules' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/maps', label: 'Map Room' },
  { href: '/museum', label: 'Armoury' },
  { href: '/videos', label: 'Videos' },
  { href: '/flashcards', label: 'Flashcards' },
  { href: '/quizzes', label: 'Quizzes' },
  { href: '/glossary', label: 'Glossary' },
  { href: '/sources', label: 'Sources' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { getTotalProgress } = useProgress();

  return (
    <header className="sticky top-0 z-50 bg-[var(--background-secondary)] border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar with logo and settings */}
        <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Palm tree logo */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[var(--accent-sand)] to-[var(--accent-rust)] flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="w-6 h-6"
                style={{ color: 'var(--background)' }}
              >
                <rect x="47" y="45" width="6" height="50" fill="currentColor" />
                <path d="M50 40 Q30 35 15 45 Q25 38 35 38 Q42 38 50 40" fill="currentColor" />
                <path d="M50 38 Q25 28 10 35 Q20 30 32 32 Q42 34 50 38" fill="currentColor" />
                <path d="M50 35 Q30 20 20 22 Q28 22 38 28 Q45 32 50 35" fill="currentColor" />
                <path d="M50 40 Q70 35 85 45 Q75 38 65 38 Q58 38 50 40" fill="currentColor" />
                <path d="M50 38 Q75 28 90 35 Q80 30 68 32 Q58 34 50 38" fill="currentColor" />
                <path d="M50 35 Q70 20 80 22 Q72 22 62 28 Q55 32 50 35" fill="currentColor" />
                <path d="M50 35 Q48 20 50 10 Q52 20 50 35" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight group-hover:text-[var(--accent-sand)] transition-colors">
                Desert Foxes
              </h1>
              <p className="text-xs text-[var(--foreground-muted)]">Kevin&apos;s Study Room</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {/* Progress indicator */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs text-[var(--foreground-muted)]">Progress</span>
              <div className="w-24 progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${getTotalProgress()}%` }}
                />
              </div>
              <span className="text-xs font-medium">{getTotalProgress()}%</span>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
          {navItems.map(item => {
            const isActive = pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[var(--accent-sand)]/10 text-[var(--accent-sand)] border border-[var(--accent-sand)]/30'
                    : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
