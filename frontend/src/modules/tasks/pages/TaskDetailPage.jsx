import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../shared/api/client';
import { Alert, Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

export function TaskDetailPage() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/v1/tasks/${taskId}`);
        setTask(res.data.data);
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load task');
      }
    })();
  }, [taskId]);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!task) return null;

  return (
    <Box>
      <Card>
        <CardContent>
          <Stack gap={1}>
            <Typography variant="h5" fontWeight={700}>{task.title}</Typography>
            <Typography>{task.description}</Typography>
            <Stack direction="row" gap={1}>
              <Chip label={`Priority: ${task.priority}`} />
              <Chip label={`Status: ${task.status}`} />
              <Chip label={`Category: ${task.category}`} />
              <Chip label={`Deadline: ${task.deadline ? dayjs(task.deadline).format('YYYY-MM-DD HH:mm') : '-'}`} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
