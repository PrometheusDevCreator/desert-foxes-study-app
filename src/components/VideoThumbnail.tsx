'use client';

interface VideoThumbnailProps {
  videoId: string;
  title: string;
  channel: string;
  className?: string;
}

export default function VideoThumbnail({ videoId, title, channel, className }: VideoThumbnailProps) {
  // YouTube thumbnails are being blocked/returning 404s
  // Show a styled fallback with video info
  return (
    <div className={`${className} bg-gradient-to-br from-red-800 via-gray-900 to-gray-950 flex flex-col items-center justify-center`}>
      <svg className="w-16 h-16 text-red-500 mb-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
      </svg>
      <p className="text-white font-bold text-sm text-center px-4 line-clamp-2 max-w-[90%]">{title}</p>
      <p className="text-gray-400 text-xs mt-1">{channel}</p>
    </div>
  );
}
