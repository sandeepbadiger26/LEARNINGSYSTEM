import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { getSubjectProgress } from '../lib/progress';
import apiClient from '../lib/apiClient';
import { Spinner } from '../components/common/Spinner';
import { Alert } from '../components/common/Alert';

export function Profile() {
  const { user } = useAuthStore();
  const [enrollments, setEnrollments] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // For now, fetch all subjects and their progress
        // In a real app, you'd have an enrollments endpoint
        const subjectsResponse = await apiClient.get('/api/subjects');
        const subjects = subjectsResponse.data.data;
        
        // Fetch progress for each subject
        const progressPromises = subjects.map(async (subject) => {
          try {
            const progress = await getSubjectProgress(subject.id);
            return { subjectId: subject.id, progress };
          } catch (e) {
            return { subjectId: subject.id, progress: null };
          }
        });
        
        const progressResults = await Promise.all(progressPromises);
        const progressMap = {};
        progressResults.forEach(({ subjectId, progress }) => {
          if (progress) progressMap[subjectId] = progress;
        });
        
        setEnrollments(subjects);
        setProgressData(progressMap);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-700">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Learning Progress */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Your Learning Progress</h2>
      
      {enrollments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-gray-500">Start learning to see your progress here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((subject) => {
            const progress = progressData[subject.id];
            const hasProgress = progress && progress.total_videos > 0;
            
            return (
              <div key={subject.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{subject.title}</h3>
                    {subject.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{subject.description}</p>
                    )}
                  </div>
                  {hasProgress && (
                    <span className="text-2xl font-bold text-primary-600">
                      {progress.percent_complete}%
                    </span>
                  )}
                </div>
                
                {hasProgress ? (
                  <>
                    {/* Progress Bar */}
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-primary-600 transition-all duration-300"
                        style={{ width: `${progress.percent_complete}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{progress.completed_videos} of {progress.total_videos} videos completed</span>
                      {progress.last_video_id && (
                        <a 
                          href={`/subjects/${subject.id}/video/${progress.last_video_id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Continue Learning
                        </a>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500">
                    No progress yet.{' '}
                    <a 
                      href={`/subjects/${subject.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Start now
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
