import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Stack,
  Badge,
} from '@mui/material';
import {
  Refresh,
  Schedule,
  CheckCircle,
  Error,
  Warning,
  Info,
  PlayArrow,
  Pause,
  Stop,
  Settings,
  Email,
  Notifications,
  Timer,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { useTaskQueries } from '../../../shared/hooks/useTaskQueries';
import { TaskPriority, TaskStatus } from '../../../shared/api/types';

const JobsPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { useGetReminderStats, useCheckDeadlines } = useTaskQueries();

  const { data: reminderStats } = useGetReminderStats();

  // Mock job data - would come from job monitoring API
  const jobs = [
    {
      id: '1',
      name: 'Deadline Reminder Check',
      type: 'cron',
      schedule: '*/30 * * * *', // Every 30 minutes
      status: 'running',
      lastRun: '2024-01-15T10:30:00Z',
      nextRun: '2024-01-15T11:00:00Z',
      successCount: 245,
      failureCount: 2,
      avgDuration: '150ms',
      description: 'Checks for upcoming deadlines and sends reminder emails',
    },
    {
      id: '2',
      name: 'Overdue Task Check',
      type: 'cron',
      schedule: '10 * * * *', // Every hour at 10 minutes
      status: 'running',
      lastRun: '2024-01-15T10:10:00Z',
      nextRun: '2024-01-15T11:10:00Z',
      successCount: 168,
      failureCount: 0,
      avgDuration: '89ms',
      description: 'Identifies overdue tasks and sends notifications',
    },
    {
      id: '3',
      name: 'Daily Summary',
      type: 'cron',
      schedule: '0 9 * * *', // Daily at 9 AM
      status: 'running',
      lastRun: '2024-01-15T09:00:00Z',
      nextRun: '2024-01-16T09:00:00Z',
      successCount: 15,
      failureCount: 0,
      avgDuration: '2.3s',
      description: 'Sends daily task summary emails to users',
    },
    {
      id: '4',
      name: 'Email Queue Processor',
      type: 'queue',
      schedule: 'continuous',
      status: 'running',
      lastRun: '2024-01-15T10:45:00Z',
      nextRun: 'continuous',
      successCount: 1234,
      failureCount: 12,
      avgDuration: '45ms',
      description: 'Processes outgoing email queue',
    },
    {
      id: '5',
      name: 'Database Cleanup',
      type: 'cron',
      schedule: '0 2 * * 0', // Weekly on Sunday at 2 AM
      status: 'paused',
      lastRun: '2024-01-14T02:00:00Z',
      nextRun: '2024-01-21T02:00:00Z',
      successCount: 8,
      failureCount: 1,
      avgDuration: '15.2s',
      description: 'Cleans up old logs and temporary data',
    },
  ];

  const jobHistory = [
    {
      id: '1',
      jobId: '1',
      status: 'success',
      startedAt: '2024-01-15T10:30:00Z',
      completedAt: '2024-01-15T10:30:00.150Z',
      duration: '150ms',
      result: 'Sent 3 reminder emails',
    },
    {
      id: '2',
      jobId: '2',
      status: 'success',
      startedAt: '2024-01-15T10:10:00Z',
      completedAt: '2024-01-15T10:10:00.089Z',
      duration: '89ms',
      result: 'Found 0 overdue tasks',
    },
    {
      id: '3',
      jobId: '4',
      status: 'error',
      startedAt: '2024-01-15T10:45:00Z',
      completedAt: '2024-01-15T10:45:00.200Z',
      duration: '200ms',
      result: 'Failed to send email: Invalid recipient',
    },
  ];

  // Calculate job statistics
  const jobStats = useMemo(() => {
    const totalJobs = jobs.length;
    const runningJobs = jobs.filter(j => j.status === 'running').length;
    const pausedJobs = jobs.filter(j => j.status === 'paused').length;
    const failedJobs = jobs.filter(j => j.status === 'failed').length;
    const totalSuccess = jobs.reduce((sum, j) => sum + j.successCount, 0);
    const totalFailures = jobs.reduce((sum, j) => sum + j.failureCount, 0);
    const successRate = totalSuccess + totalFailures > 0 ? (totalSuccess / (totalSuccess + totalFailures)) * 100 : 0;

    return {
      totalJobs,
      runningJobs,
      pausedJobs,
      failedJobs,
      totalSuccess,
      totalFailures,
      successRate,
    };
  }, [jobs]);

  const handleJobAction = (jobId, action) => {
    console.log(`Job ${jobId} action: ${action}`);
    // Mock job action logic
  };

  const handleViewJobDetails = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const formatSchedule = (schedule) => {
    if (schedule === 'continuous') return 'Continuous';
    if (schedule === 'manual') return 'Manual';
    
    // Parse cron expression and return human-readable format
    const parts = schedule.split(' ');
    if (parts.length === 5) {
      const [minute, hour, day, month, weekday] = parts;
      if (minute === '*/30' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
        return 'Every 30 minutes';
      }
      if (minute === '10' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
        return 'Every hour at 10 minutes';
      }
      if (minute === '0' && hour === '9' && day === '*' && month === '*' && weekday === '*') {
        return 'Daily at 9:00 AM';
      }
      if (minute === '0' && hour === '2' && day === '*' && month === '*' && weekday === '0') {
        return 'Weekly on Sunday at 2:00 AM';
      }
    }
    return schedule;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'success';
      case 'paused': return 'warning';
      case 'failed': return 'error';
      case 'success': return 'success';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <PlayArrow />;
      case 'paused': return <Pause />;
      case 'failed': return <Error />;
      case 'success': return <CheckCircle />;
      case 'error': return <Error />;
      default: return <Info />;
    }
  };

  const tabs = [
    { label: 'Overview', icon: <TrendingUp /> },
    { label: 'Active Jobs', icon: <Schedule /> },
    { label: 'Job History', icon: <Timer /> },
    { label: 'Settings', icon: <Settings /> },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Background Jobs</Typography>
        <Box display="flex" gap={1}>
          <Tooltip title="Auto Refresh">
            <IconButton
              color={autoRefresh ? 'primary' : 'default'}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
          >
            Refresh All
          </Button>
        </Box>
      </Box>

      {/* Tab Navigation */}
      <Paper sx={{ mb: 3 }}>
        <Box display="flex" gap={1} p={1}>
          {tabs.map((tab, index) => (
            <Button
              key={index}
              variant={selectedTab === index ? 'contained' : 'text'}
              startIcon={tab.icon}
              onClick={() => setSelectedTab(index)}
              sx={{ minWidth: 120 }}
            >
              {tab.label}
            </Button>
          ))}
        </Box>
      </Paper>

      {/* Overview Tab */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Schedule color="primary" sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4">{jobStats.totalJobs}</Typography>
                    <Typography color="text.secondary">Total Jobs</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <PlayArrow color="success" sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4">{jobStats.runningJobs}</Typography>
                    <Typography color="text.secondary">Running</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Pause color="warning" sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4">{jobStats.pausedJobs}</Typography>
                    <Typography color="text.secondary">Paused</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Error color="error" sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4">{jobStats.failedJobs}</Typography>
                    <Typography color="text.secondary">Failed</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Success Rate
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <LinearProgress
                    variant="determinate"
                    value={jobStats.successRate}
                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="h6">
                    {jobStats.successRate.toFixed(1)}%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {jobStats.totalSuccess} successful, {jobStats.totalFailures} failed
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
      <Card>
        <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Health
                </Typography>
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>Cron Scheduler</Typography>
                    <Chip label="Healthy" color="success" size="small" />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>Email Queue</Typography>
                    <Chip label="Healthy" color="success" size="small" />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>Database</Typography>
                    <Chip label="Healthy" color="success" size="small" />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>Memory Usage</Typography>
                    <Typography>45%</Typography>
                  </Box>
          </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Active Jobs Tab */}
      {selectedTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Active Jobs
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Job Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Schedule</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Run</TableCell>
                    <TableCell>Next Run</TableCell>
                    <TableCell>Success Rate</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{job.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {job.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={job.type}
                          color={job.type === 'cron' ? 'primary' : 'secondary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatSchedule(job.schedule)}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(job.status)}
                          label={job.status}
                          color={getStatusColor(job.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(job.lastRun).toLocaleString()}</TableCell>
                      <TableCell>
                        {job.nextRun === 'continuous' ? 'Continuous' : new Date(job.nextRun).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2">
                            {job.successCount}/{job.successCount + job.failureCount}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(job.successCount / (job.successCount + job.failureCount)) * 100}
                            sx={{ width: 50, height: 4 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewJobDetails(job)}
                          >
                            <Info />
                          </IconButton>
                        </Tooltip>
                        {job.status === 'running' ? (
                          <Tooltip title="Pause Job">
                            <IconButton
                              size="small"
                              onClick={() => handleJobAction(job.id, 'pause')}
                            >
                              <Pause />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Start Job">
                            <IconButton
                              size="small"
                              onClick={() => handleJobAction(job.id, 'start')}
                            >
                              <PlayArrow />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Stop Job">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleJobAction(job.id, 'stop')}
                          >
                            <Stop />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Job History Tab */}
      {selectedTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Job Executions
            </Typography>
            
            <List>
              {jobHistory.map((execution, index) => (
                <React.Fragment key={execution.id}>
                  <ListItem>
                    <ListItemIcon>
                      {getStatusIcon(execution.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2">
                            {jobs.find(j => j.id === execution.jobId)?.name || 'Unknown Job'}
                          </Typography>
                          <Chip
                            label={execution.status}
                            color={getStatusColor(execution.status)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Started: {new Date(execution.startedAt).toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Duration: {execution.duration} | Result: {execution.result}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < jobHistory.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
        </CardContent>
      </Card>
      )}

      {/* Settings Tab */}
      {selectedTab === 3 && (
      <Card>
        <CardContent>
            <Typography variant="h6" gutterBottom>
              Job Scheduler Settings
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Scheduler Configuration
                  </Typography>
                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Max Concurrent Jobs:</Typography>
                      <Typography>5</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Job Timeout (minutes):</Typography>
                      <Typography>30</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Retry Failed Jobs:</Typography>
                      <Chip label="Enabled" color="success" size="small" />
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Max Retries:</Typography>
                      <Typography>3</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Log Level:</Typography>
                      <Typography>INFO</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Monitoring
                  </Typography>
                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Health Check Interval:</Typography>
                      <Typography>5 minutes</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Alert on Failures:</Typography>
                      <Chip label="Enabled" color="success" size="small" />
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Performance Monitoring:</Typography>
                      <Chip label="Enabled" color="success" size="small" />
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Log Retention:</Typography>
                      <Typography>30 days</Typography>
                    </Box>
          </Stack>
                </Paper>
              </Grid>
            </Grid>
        </CardContent>
      </Card>
      )}

      {/* Job Details Dialog */}
      <Dialog open={showJobDetails} onClose={() => setShowJobDetails(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Job Details: {selectedJob?.name}
        </DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body2">
                  {selectedJob.description}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Schedule
                </Typography>
                <Typography variant="body2">
                  {formatSchedule(selectedJob.schedule)}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">Success Count: {selectedJob.successCount}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Failure Count: {selectedJob.failureCount}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Average Duration: {selectedJob.avgDuration}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      Success Rate: {((selectedJob.successCount / (selectedJob.successCount + selectedJob.failureCount)) * 100).toFixed(1)}%
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Recent Executions
                </Typography>
                <List dense>
                  {jobHistory.filter(h => h.jobId === selectedJob.id).slice(0, 5).map((execution) => (
                    <ListItem key={execution.id}>
                      <ListItemIcon>
                        {getStatusIcon(execution.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={new Date(execution.startedAt).toLocaleString()}
                        secondary={`${execution.duration} - ${execution.result}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
    </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowJobDetails(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobsPage;