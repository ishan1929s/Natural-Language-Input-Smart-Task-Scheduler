import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Box, Typography, Button, Alert } from '@mui/material';
import { motion } from 'framer-motion';

// Theme and Components
import { AppThemeProvider } from './shared/theme/theme.jsx';
import { AuthProvider, useAuth } from './modules/auth/AuthProvider';

// Pages - Import with error handling
let LoginPage, RegisterPage, OAuthCallback, DashboardPage, TasksPage, VoicePage, AdminPage, JobsPage;

try {
  LoginPage = React.lazy(() => import('./modules/auth/pages/LoginPage'));
  RegisterPage = React.lazy(() => import('./modules/auth/pages/RegisterPage'));
  OAuthCallback = React.lazy(() => import('./modules/auth/pages/OAuthCallback'));
  DashboardPage = React.lazy(() => import('./modules/app/pages/DashboardPage'));
  TasksPage = React.lazy(() => import('./modules/tasks/pages/TasksPage'));
  VoicePage = React.lazy(() => import('./modules/voice/pages/VoicePage'));
  AdminPage = React.lazy(() => import('./modules/admin/pages/AdminPage'));
  JobsPage = React.lazy(() => import('./modules/jobs/pages/JobsPage'));
} catch (error) {
  console.warn('Some pages failed to load:', error);
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error?.response?.status === 401) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

// Loading component
const LoadingSpinner = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          border: '4px solid rgba(255, 255, 255, 0.3)',
          borderTop: '4px solid white',
          borderRadius: '50%',
        }}
      />
    </motion.div>
  </Box>
);

// Error boundary component
const ErrorFallback = ({ error, resetError }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center',
      p: 4,
    }}
  >
    <Typography variant="h4" sx={{ mb: 2 }}>
      ⚠️ Something went wrong
    </Typography>
    <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
      {error?.message || 'An unexpected error occurred'}
    </Typography>
    <Button
      variant="contained"
      onClick={resetError}
      sx={{
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        '&:hover': {
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        },
      }}
    >
      Try Again
    </Button>
  </Box>
);

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      {children}
    </React.Suspense>
  );
};

// Welcome page for unauthenticated users
const WelcomePage = () => {
  const navigate = useNavigate();
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        p: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
          `,
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography 
          variant="h2" 
          className="gradient-text"
          sx={{ 
            mb: 4, 
            fontWeight: 700,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
          }}
        >
          🎉 TaskMaster
        </Typography>
        
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 4, 
            opacity: 0.9,
            fontSize: { xs: '1.2rem', md: '1.5rem' },
          }}
        >
          Your Ultimate Task Management Solution
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 6, 
            opacity: 0.8,
            maxWidth: 600,
            fontSize: { xs: '1rem', md: '1.1rem' },
          }}
        >
          Organize your tasks with AI-powered natural language processing, 
          voice input, and intelligent scheduling. Boost your productivity today!
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Sign In
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.5)',
              color: 'white',
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Sign Up
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

// Main App Component
const App = () => {
  const [error, setError] = useState(null);

  const resetError = () => {
    setError(null);
  };

  if (error) {
    return <ErrorFallback error={error} resetError={resetError} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <AuthProvider>
          <Router>
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
              {/* Main Content */}
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  minHeight: '100vh',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                      radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.05) 0%, transparent 50%)
                    `,
                    pointerEvents: 'none',
                  },
                }}
              >
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<WelcomePage />} />
                  <Route 
                    path="/login" 
                    element={
                      <React.Suspense fallback={<LoadingSpinner />}>
                        {LoginPage ? <LoginPage /> : <LoadingSpinner />}
                      </React.Suspense>
                    } 
                  />
                  <Route 
                    path="/register" 
                    element={
                      <React.Suspense fallback={<LoadingSpinner />}>
                        {RegisterPage ? <RegisterPage /> : <LoadingSpinner />}
                      </React.Suspense>
                    } 
                  />
                  <Route 
                    path="/auth/callback" 
                    element={
                      <React.Suspense fallback={<LoadingSpinner />}>
                        {OAuthCallback ? <OAuthCallback /> : <LoadingSpinner />}
                      </React.Suspense>
                    } 
                  />
                  
                  {/* Protected Routes */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        {DashboardPage ? <DashboardPage /> : <LoadingSpinner />}
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/tasks" 
                    element={
                      <ProtectedRoute>
                        {TasksPage ? <TasksPage /> : <LoadingSpinner />}
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/voice" 
                    element={
                      <ProtectedRoute>
                        {VoicePage ? <VoicePage /> : <LoadingSpinner />}
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/jobs" 
                    element={
                      <ProtectedRoute>
                        {JobsPage ? <JobsPage /> : <LoadingSpinner />}
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute adminOnly>
                        {AdminPage ? <AdminPage /> : <LoadingSpinner />}
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* 404 Route */}
                  <Route 
                    path="*" 
                    element={
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100vh',
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="h1" sx={{ fontSize: '8rem', mb: 2 }}>
                          🚫
                        </Typography>
                        <Typography variant="h3" className="gradient-text" sx={{ mb: 2 }}>
                          Page Not Found
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
                          The page you're looking for doesn't exist.
                        </Typography>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => window.history.back()}
                          sx={{
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            },
                          }}
                        >
                          Go Back
                        </Button>
                      </Box>
                    } 
                  />
                </Routes>
              </Box>
            </Box>
          </Router>
          
          {/* React Query Devtools */}
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
};

export default App;