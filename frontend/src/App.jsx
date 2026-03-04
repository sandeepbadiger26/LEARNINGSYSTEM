import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/Layout/AppShell';
import { AuthGuard, PublicOnly } from './components/Auth/AuthGuard';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { SubjectOverview } from './pages/SubjectOverview';
import { VideoPage } from './pages/VideoPage';
import { Profile } from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          
          {/* Auth Routes - Public Only */}
          <Route 
            path="/login" 
            element={
              <PublicOnly>
                <Login />
              </PublicOnly>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicOnly>
                <Register />
              </PublicOnly>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/profile" 
            element={
              <AuthGuard>
                <Profile />
              </AuthGuard>
            } 
          />
          <Route 
            path="/subjects/:subjectId" 
            element={
              <AuthGuard>
                <SubjectOverview />
              </AuthGuard>
            } 
          />
          <Route 
            path="/subjects/:subjectId/video/:videoId" 
            element={
              <AuthGuard>
                <VideoPage />
              </AuthGuard>
            } 
          />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
