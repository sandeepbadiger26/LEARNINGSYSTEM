import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import { getVideoProgress } from '../lib/progress';
import { useVideoStore } from '../store/videoStore';
import { SubjectSidebar } from '../components/Sidebar/SubjectSidebar';
import { VideoPlayer } from '../components/Video/VideoPlayer';
import { VideoMeta } from '../components/Video/VideoMeta';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { Alert } from '../components/common/Alert';

export function VideoPage() {
  const { subjectId, videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { 
    setCurrentVideo, 
    nextVideoId, 
    isCompleted 
  } = useVideoStore();

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch video metadata and progress in parallel
        const [videoResponse, progressResponse] = await Promise.all([
          apiClient.get(`/api/videos/${videoId}`),
          getVideoProgress(videoId)
        ]);
        
        const videoData = videoResponse.data;
        setVideo(videoData);
        setProgress(progressResponse);
        
        // Update video store
        setCurrentVideo(videoId, subjectId, videoData);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId, subjectId, setCurrentVideo]);

  const handleCompleted = useCallback(() => {
    // Navigate to next video if available
    if (video?.next_video_id) {
      navigate(`/subjects/${subjectId}/video/${video.next_video_id}`);
    }
  }, [video, subjectId, navigate]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)]">
        <SubjectSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)]">
        <SubjectSidebar />
        <div className="flex-1 p-8">
          <Alert variant="error">{error}</Alert>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex h-[calc(100vh-4rem)]">
        <SubjectSidebar />
        <div className="flex-1 p-8">
          <Alert variant="error">Video not found</Alert>
        </div>
      </div>
    );
  }

  // Video is locked
  if (video.locked) {
    return (
      <div className="flex h-[calc(100vh-4rem)]">
        <SubjectSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <Alert variant="warning">
              <div className="space-y-2">
                <p className="font-medium">This video is locked</p>
                <p>{video.unlock_reason}</p>
              </div>
            </Alert>
            
            {video.previous_video_id && (
              <div className="mt-6 text-center">
                <Button
                  onClick={() => navigate(`/subjects/${subjectId}/video/${video.previous_video_id}`)}
                  variant="secondary"
                >
                  Go to Previous Video
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <SubjectSidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          {/* Video Player */}
          <div className="mb-6">
            <VideoPlayer
              videoId={videoId}
              youtubeUrl={video.youtube_url}
              startPositionSeconds={progress?.last_position_seconds || 0}
              onCompleted={handleCompleted}
            />
          </div>

          {/* Video Meta */}
          <VideoMeta
            title={video.title}
            description={video.description}
            sectionTitle={video.section_title}
            subjectTitle={video.subject_title}
          />

          {/* Navigation */}
          <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
            {video.previous_video_id ? (
              <Button
                variant="secondary"
                onClick={() => navigate(`/subjects/${subjectId}/video/${video.previous_video_id}`)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Button>
            ) : (
              <div />
            )}

            {video.next_video_id && (
              <Button
                variant="primary"
                onClick={() => navigate(`/subjects/${subjectId}/video/${video.next_video_id}`)}
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            )}
          </div>

          {/* Completion Message */}
          {isCompleted && !video.next_video_id && (
            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
              <svg className="w-12 h-12 mx-auto text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-green-800">Congratulations!</h3>
              <p className="text-green-700 mt-1">You have completed all videos in this subject.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
