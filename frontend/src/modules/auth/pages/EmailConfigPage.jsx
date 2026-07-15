import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, FormControlLabel, Stack, Switch, TextField, Typography } from '@mui/material';
import { api } from '../../../shared/api/client';

export function EmailConfigPage() {
  const [form, setForm] = useState({
    emailConfig: { service: 'gmail', user: '', pass: '', host: '', port: 587, secure: false }
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const setField = (key, value) => setForm((f) => ({ emailConfig: { ...f.emailConfig, [key]: value } }));

  const onSave = async () => {
    setSaving(true); setError(null); setSuccess(null);
    try {
      await api.patch('/api/v1/auth/email-config', form);
      setSuccess('Email configuration saved');
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <Box maxWidth={560} mx="auto" mt={4}>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>Email Configuration</Typography>
          <Stack gap={2}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <TextField label="Service" value={form.emailConfig.service} onChange={(e) => setField('service', e.target.value)} />
            <TextField label="User" value={form.emailConfig.user} onChange={(e) => setField('user', e.target.value)} />
            <TextField label="Password" type="password" value={form.emailConfig.pass} onChange={(e) => setField('pass', e.target.value)} />
            <TextField label="Host" value={form.emailConfig.host} onChange={(e) => setField('host', e.target.value)} />
            <TextField label="Port" type="number" value={form.emailConfig.port} onChange={(e) => setField('port', Number(e.target.value))} />
            <FormControlLabel control={<Switch checked={form.emailConfig.secure} onChange={(e) => setField('secure', e.target.checked)} />} label="Secure" />
            <Button variant="contained" onClick={onSave} disabled={saving}>Save</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
