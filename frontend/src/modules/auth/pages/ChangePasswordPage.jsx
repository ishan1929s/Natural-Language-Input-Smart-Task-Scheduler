import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { api } from '../../../shared/api/client';

export function ChangePasswordPage() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSave = async () => {
    setSaving(true); setError(null); setSuccess(null);
    try {
      await api.patch('/api/v1/auth/change-password', form);
      setSuccess('Password changed successfully');
    } catch (e) {
      setError(e?.response?.data?.message || 'Change password failed');
    } finally { setSaving(false); }
  };

  return (
    <Box maxWidth={560} mx="auto" mt={4}>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>Change Password</Typography>
          <Stack gap={2}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <TextField name="currentPassword" label="Current password" type="password" value={form.currentPassword} onChange={handleChange} />
            <TextField name="newPassword" label="New password" type="password" value={form.newPassword} onChange={handleChange} />
            <Button variant="contained" onClick={onSave} disabled={saving}>Save</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
