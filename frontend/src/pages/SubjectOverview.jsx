import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import { Spinner } from '../components/common/Spinner';
import { Alert } from '../components/common/Alert';

export function SubjectOverview() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFirstVideo = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/subjects/${subjectId}/first-video`);
        const { video_id } = response.data;
        
        if (video_id) {
          navigate(`/subjects/${subjectId}/video/${video_id}`, { replace: true });
        } else {
          setError('No videos available in this subject');
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load subject');
      } finally {
        setLoading(false);
      }
    };

    fetchFirstVideo();
  }, [subjectId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert variant="error">{error}</Alert>
      </div>
    );
  }

  return null;
}
