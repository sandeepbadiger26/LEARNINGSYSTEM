import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function SectionItem({ section, sectionIndex, subjectId, currentVideoId }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const hasLockedVideos = section.videos.some(v => v.locked);
  const hasCompletedVideos = section.videos.some(v => v.is_completed);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 text-left">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-medium flex items-center justify-center">
            {sectionIndex + 1}
          </span>
          <span className="font-medium text-gray-900 text-sm">{section.title}</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Videos */}
      {isExpanded && (
        <div className="pb-2">
          {section.videos.map((video, videoIndex) => {
            const isActive = currentVideoId === String(video.id);
            const isLocked = video.locked;
            const isCompleted = video.is_completed;

            return (
              <Link
                key={video.id}
                to={isLocked ? '#' : `/subjects/${subjectId}/video/${video.id}`}
                className={`px-4 py-2 pl-12 flex items-center gap-3 transition-colors ${
                  isActive
                    ? 'bg-primary-50 border-r-2 border-primary-600'
                    : isLocked
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:bg-gray-50'
                }`}
                onClick={(e) => {
                  if (isLocked) {
                    e.preventDefault();
                  }
                }}
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {isLocked ? (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ) : isCompleted ? (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${isActive ? 'text-primary-700 font-medium' : 'text-gray-700'}`}>
                    {video.title}
                  </p>
                  {video.duration_seconds && (
                    <p className="text-xs text-gray-400">
                      {Math.floor(video.duration_seconds / 60)}:{String(video.duration_seconds % 60).padStart(2, '0')}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
