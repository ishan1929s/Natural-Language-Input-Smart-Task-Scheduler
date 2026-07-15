import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Box textAlign="center" py={10}>
      <Typography variant="h2" fontWeight={800}>404</Typography>
      <Typography variant="h5" mb={2}>Page not found</Typography>
      <Button variant="contained" component={RouterLink} to="/tasks">Go Home</Button>
    </Box>
  );
}
