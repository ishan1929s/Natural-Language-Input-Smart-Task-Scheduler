import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { Email } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { api } from '../../../shared/api/client';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError(null); setSuccess(null);
    try {
      await api.post('/api/v1/auth/forgot-password', { email });
      setSuccess('Password reset link sent to your email');
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to send reset link');
    } finally { setSaving(false); }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            width: { xs: '90%', sm: '400px' },
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
            },
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={700} mb={2} textAlign="center">
              Forgot Password
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3} textAlign="center">
              Enter your email address and we'll send you a link to reset your password.
            </Typography>
            <Stack gap={2} component="form" onSubmit={onSubmit}>
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: <Email sx={{ color: '#6366f1', mr: 1 }} />,
                }}
                required
              />
              <Button variant="contained" type="submit" disabled={saving}>
                Send Reset Link
              </Button>
              <Button component={RouterLink} to="/login" variant="text">
                Back to Login
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
