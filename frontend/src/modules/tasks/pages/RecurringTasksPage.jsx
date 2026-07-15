import { useEffect, useState } from 'react';
import { api } from '../../../shared/api/client';
import { Alert, Box, Button, Card, CardContent, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';

export function RecurringTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', deadline: '', rrule_string: '', priority: 'medium', category: 'general', time_required: 60, end_date: '' });
  const [selectedId, setSelectedId] = useState('');
  const [updateType, setUpdateType] = useState('all');
  const [deleteType, setDeleteType] = useState('all');

  const fetchTasks = async () => {
    try {
      const res = await api.get('/api/v1/tasks/recurring');
      setTasks(res.data.data);
    } catch (e) { setError(e?.response?.data?.message || 'Failed to load'); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const createRecurring = async () => {
    try {
      await api.post('/api/v1/tasks/recurring', { ...form, deadline: form.deadline || null, end_date: form.end_date || null });
      setForm({ title: '', description: '', deadline: '', rrule_string: '', priority: 'medium', category: 'general', time_required: 60, end_date: '' });
      await fetchTasks();
    } catch (e) { alert(e?.response?.data?.message || 'Create failed'); }
  };

  const updateRecurring = async () => {
    if (!selectedId) return alert('Select task id');
    try {
      await api.put(`/api/v1/tasks/recurring/${selectedId}`, { ...form, update_type: updateType });
      await fetchTasks();
    } catch (e) { alert(e?.response?.data?.message || 'Update failed'); }
  };

  const deleteRecurring = async () => {
    if (!selectedId) return alert('Select task id');
    try {
      await api.delete(`/api/v1/tasks/recurring/${selectedId}`, { data: { delete_type: deleteType } });
      setSelectedId('');
      await fetchTasks();
    } catch (e) { alert(e?.response?.data?.message || 'Delete failed'); }
  };

  return (
    <Stack gap={2}>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700}>Create Recurring Task</Typography>
          <Stack gap={2} mt={1}>
            <TextField label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            <TextField label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            <TextField type="datetime-local" label="First Deadline" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} InputLabelProps={{ shrink: true }} />
            <TextField label="RRULE" placeholder="FREQ=WEEKLY;BYDAY=MO,WE,FR" value={form.rrule_string} onChange={(e) => setForm((f) => ({ ...f, rrule_string: e.target.value }))} />
            <TextField label="End date" type="date" value={form.end_date} onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))} InputLabelProps={{ shrink: true }} />
            <Button variant="contained" onClick={createRecurring}>Create</Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700}>Update/Delete Recurring Series</Typography>
          <Stack gap={2} mt={1}>
            <TextField label="Task ID" value={selectedId} onChange={(e) => setSelectedId(e.target.value)} />
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
              <TextField select label="Update Type" value={updateType} onChange={(e) => setUpdateType(e.target.value)} sx={{ minWidth: 180 }}>
                <option value="this">this</option>
                <option value="following">following</option>
                <option value="all">all</option>
              </TextField>
              <Button variant="outlined" onClick={updateRecurring}>Update</Button>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
              <TextField select label="Delete Type" value={deleteType} onChange={(e) => setDeleteType(e.target.value)} sx={{ minWidth: 180 }}>
                <option value="this">this</option>
                <option value="following">following</option>
                <option value="all">all</option>
              </TextField>
              <Button color="error" variant="outlined" onClick={deleteRecurring}>Delete</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {error && <Alert severity="error">{error}</Alert>}

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700}>Recurring Tasks</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>RRULE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((t) => (
                <TableRow key={t._id}>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>{t.deadline}</TableCell>
                  <TableCell>{t.rrule_string}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  );
}
