import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from '../AuthProvider';
import { api } from '../../../shared/api/client';

export function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ username: user?.username ?? '', email: user?.email ?? '', fullname: user?.fullname ?? '', profile_picture: user?.profile_picture ?? '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSave = async () => {
    setSaving(true); setError(null); setSuccess(null);
    try {
      await api.patch('/api/v1/auth/update', form);
      setSuccess('Profile updated');
    } catch (e) {
      setError(e?.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box maxWidth={560} mx="auto" mt={4}>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>Profile</Typography>
          <Stack gap={2}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <TextField name="username" label="Username" value={form.username} onChange={handleChange} />
            <TextField name="email" label="Email" value={form.email} onChange={handleChange} />
            <TextField name="fullname" label="Full name" value={form.fullname} onChange={handleChange} />
            <TextField name="profile_picture" label="Profile picture URL" value={form.profile_picture} onChange={handleChange} />
            <Button variant="contained" onClick={onSave} disabled={saving}>Save</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
