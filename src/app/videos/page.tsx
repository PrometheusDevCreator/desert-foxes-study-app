'use client';

import { useState } from 'react';
import { videos } from '@/lib/content-loader';
import VideoThumbnail from '@/components/VideoThumbnail';

const categories = [
  { id: 'all', label: 'All Videos' },
  { id: 'documentary', label: 'Documentaries' },
  { id: 'campaign', label: 'Campaign' },
  { id: 'rommel', label: 'Rommel' },
  { id: 'battles', label: 'Battles' },
  { id: 'sas', label: 'SAS/LRDG' },
  { id: 'equipment', label: 'Equipment' },
];

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);

  let filteredVideos = selectedCategory === 'all'
    ? videos
    : videos.filter(v => v.category === selectedCategory);

  if (showRecommendedOnly) {
    filteredVideos = filteredVideos.filter(v => v.recommended);
  }

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : '';
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Video Library</h1>
          <p className="text-[var(--foreground-muted)]">
            Curated YouTube videos featuring animated maps, documentaries, and detailed analyses of the North African Campaign.
          </p>
        </div>

        {/* Featured Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Featured: Campaign Documentaries</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {videos.filter(v => v.recommended && (v.category === 'campaign' || v.category === 'documentary')).slice(0, 2).map(video => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card overflow-hidden group hover:border-[var(--accent-sand)]/50 transition-all"
              >
                <div className="relative aspect-video bg-[var(--background-secondary)]">
                  <VideoThumbnail
                    videoId={getYouTubeId(video.url)}
                    title={video.title}
                    channel={video.channel}
                    className="w-full h-full"
                  />
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded z-30">
                    {video.duration}
                  </span>
                  <span className="absolute top-2 left-2 bg-[var(--accent-sand)] text-black text-xs px-2 py-1 rounded font-bold z-30">
                    RECOMMENDED
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-1 group-hover:text-[var(--accent-sand)] transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-[var(--foreground-muted)]">{video.channel}</p>
                  <p className="text-xs text-[var(--foreground-muted)] mt-2">{video.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-2">
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

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showRecommendedOnly}
              onChange={(e) => setShowRecommendedOnly(e.target.checked)}
              className="rounded border-[var(--border)]"
            />
            <span className="text-sm">Show recommended only</span>
          </label>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card overflow-hidden group hover:border-[var(--accent-sand)]/50 transition-all"
            >
              <div className="relative aspect-video bg-[var(--background-secondary)]">
                <VideoThumbnail
                  videoId={getYouTubeId(video.url)}
                  title={video.title}
                  channel={video.channel}
                  className="w-full h-full"
                />
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded z-30">
                  {video.duration}
                </span>
                {video.recommended && (
                  <span className="absolute top-2 left-2 bg-[var(--accent-sand)] text-black text-xs px-2 py-1 rounded font-bold z-30">
                    RECOMMENDED
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-[var(--background-secondary)] capitalize">
                    {video.category.replace(/-/g, ' ')}
                  </span>
                </div>
                <h3 className="font-bold mb-1 group-hover:text-[var(--accent-sand)] transition-colors line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-sm text-[var(--foreground-muted)]">{video.channel}</p>
                <p className="text-xs text-[var(--foreground-muted)] mt-2 line-clamp-2">{video.description}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Note about sources */}
        <div className="mt-12 card p-6">
          <h2 className="text-xl font-bold mb-4">About These Videos</h2>
          <p className="text-[var(--foreground-muted)] text-sm mb-4">
            These videos are curated from reputable YouTube channels specializing in military history.
            They feature animated maps, archival footage, and expert analysis to help visualize the
            complex operations of the North African Campaign.
          </p>
          <p className="text-[var(--foreground-muted)] text-sm">
            <strong>Note:</strong> Videos open in YouTube. Some channels may include advertisements.
            For classroom use, consider downloading or using ad-free playback options.
          </p>
        </div>
      </div>
    </div>
  );
}
