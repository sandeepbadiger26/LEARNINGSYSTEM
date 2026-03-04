import React from 'react';

export function VideoMeta({ title, description, sectionTitle, subjectTitle }) {
  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <span>{subjectTitle}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span>{sectionTitle}</span>
      </nav>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

      {/* Description */}
      {description && (
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 whitespace-pre-wrap">{description}</p>
        </div>
      )}
    </div>
  );
}
