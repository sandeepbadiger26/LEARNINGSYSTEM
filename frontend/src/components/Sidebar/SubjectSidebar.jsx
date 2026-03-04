import React, { useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useSidebarStore } from '../../store/sidebarStore';
import { Spinner } from '../common/Spinner';
import { SectionItem } from './SectionItem';

export function SubjectSidebar() {
  const { subjectId } = useParams();
  const location = useLocation();
  const { tree, loading, error, fetchTree } = useSidebarStore();

  useEffect(() => {
    if (subjectId) {
      fetchTree(subjectId);
    }
  }, [subjectId, fetchTree]);

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] flex items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] p-4">
        <div className="text-red-600 text-sm">{error}</div>
      </div>
    );
  }

  if (!tree) {
    return null;
  }

  // Extract current video ID from URL
  const currentVideoId = location.pathname.match(/\/video\/(\d+)/)?.[1];

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Subject Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900 line-clamp-2">{tree.title}</h2>
        {tree.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{tree.description}</p>
        )}
      </div>

      {/* Sections */}
      <div className="py-2">
        {tree.sections.map((section, sectionIndex) => (
          <SectionItem
            key={section.id}
            section={section}
            sectionIndex={sectionIndex}
            subjectId={subjectId}
            currentVideoId={currentVideoId}
          />
        ))}
      </div>
    </div>
  );
}
