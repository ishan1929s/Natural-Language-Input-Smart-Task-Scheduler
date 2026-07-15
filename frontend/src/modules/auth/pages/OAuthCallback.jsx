import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { motion } from 'framer-motion';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError(decodeURIComponent(errorParam));
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        return;
      }

      if (accessToken && refreshToken) {
        // Store tokens using correct keys
        localStorage.setItem('tm_access_token', accessToken);
        localStorage.setItem('tm_refresh_token', refreshToken);

        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setError('Authentication failed. Missing tokens.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

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
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {error ? (
          <>
            <Alert severity="error" sx={{ mb: 3, maxWidth: 400 }}>
              {error}
            </Alert>
            <Typography variant="body1">
              Redirecting to login...
            </Typography>
          </>
        ) : (
          <>
            <CircularProgress size={60} sx={{ color: 'white', mb: 3 }} />
            <Typography variant="h5" sx={{ mb: 2 }}>
              Completing sign in...
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Please wait while we authenticate your account
            </Typography>
          </>
        )}
      </motion.div>
    </Box>
  );
};

export default OAuthCallback;
