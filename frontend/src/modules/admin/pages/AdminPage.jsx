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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
} from '@mui/material';
import {
  Refresh,
  Settings,
  Person,
  Email,
  Security,
  Analytics,
  Storage,
  Schedule,
  CheckCircle,
  Error,
  Warning,
  Info,
  Edit,
  Delete,
  Add,
} from '@mui/icons-material';
import { useAuthQueries } from '../../../shared/hooks/useAuthQueries';
import { useTaskQueries } from '../../../shared/hooks/useTaskQueries';
import { TaskPriority, TaskStatus, UserRoles } from '../../../shared/api/types';

const AdminPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showSystemDialog, setShowSystemDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [systemSettings, setSystemSettings] = useState({
    maxTasksPerUser: 1000,
    maxFileSize: 10,
    emailNotifications: true,
    voiceProcessing: true,
    nlpProcessing: true,
    maintenanceMode: false,
  });

  const { useGetMe } = useAuthQueries();
  const { useGetTasks, useGetAnalytics, useGetReminderStats } = useTaskQueries();

  const { data: currentUser } = useGetMe();
  const { data: tasksData } = useGetTasks();
  const { data: analyticsData } = useGetAnalytics();
  const { data: reminderStats } = useGetReminderStats();

  const tasks = tasksData?.data || [];

  // Check if user is admin
  const isAdmin = currentUser?.role === UserRoles.ADMIN;

  if (!isAdmin) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Access denied. Admin privileges required.
        </Alert>
      </Box>
    );
  }

  // Calculate system statistics
  const systemStats = useMemo(() => {
    const totalUsers = 1; // Mock data - would come from user API
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
    const pendingTasks = tasks.filter(t => t.status === TaskStatus.PENDING).length;
    const overdueTasks = tasks.filter(t => 
      t.deadline && new Date(t.deadline) < new Date() && t.status === TaskStatus.PENDING
    ).length;
    const urgentTasks = tasks.filter(t => t.priority === TaskPriority.URGENT).length;

    return {
      totalUsers,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      urgentTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    };
  }, [tasks]);

  // Mock user data - would come from user management API
  const users = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      fullname: 'System Administrator',
      role: UserRoles.ADMIN,
      createdAt: '2024-01-01',
      lastLogin: '2024-01-15',
      taskCount: tasks.length,
      status: 'active',
    },
    {
      id: '2',
      username: 'user1',
      email: 'user1@example.com',
      fullname: 'John Doe',
      role: UserRoles.USER,
      createdAt: '2024-01-10',
      lastLogin: '2024-01-14',
      taskCount: 15,
      status: 'active',
    },
  ];

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserDialog(true);
  };

  const handleSaveUser = () => {
    // Mock save user logic
    console.log('Saving user:', editingUser);
    setShowUserDialog(false);
    setEditingUser(null);
  };

  const handleSystemSettingsChange = (field, value) => {
    setSystemSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSystemSettings = () => {
    // Mock save system settings logic
    console.log('Saving system settings:', systemSettings);
    setShowSystemDialog(false);
  };

  const tabs = [
    { label: 'Overview', icon: <Analytics /> },
    { label: 'Users', icon: <Person /> },
    { label: 'Tasks', icon: <Schedule /> },
    { label: 'System', icon: <Settings /> },
    { label: 'Email', icon: <Email /> },
    { label: 'Security', icon: <Security /> },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Admin Panel</Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
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
                  <Person color="primary" sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4">{systemStats.totalUsers}</Typography>
                    <Typography color="text.secondary">Total Users</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Schedule color="primary" sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4">{systemStats.totalTasks}</Typography>
                    <Typography color="text.secondary">Total Tasks</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CheckCircle color="success" sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4">{systemStats.completedTasks}</Typography>
                    <Typography color="text.secondary">Completed</Typography>
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
                    <Typography variant="h4">{systemStats.overdueTasks}</Typography>
                    <Typography color="text.secondary">Overdue</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Task Completion Rate
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <LinearProgress
                    variant="determinate"
                    value={systemStats.completionRate}
                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="h6">
                    {systemStats.completionRate.toFixed(1)}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Status
                </Typography>
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>Database</Typography>
                    <Chip label="Online" color="success" size="small" />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>Email Service</Typography>
                    <Chip label="Online" color="success" size="small" />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>Voice Processing</Typography>
                    <Chip label="Online" color="success" size="small" />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>NLP Service</Typography>
                    <Chip label="Online" color="success" size="small" />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Users Tab */}
      {selectedTab === 1 && (
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">User Management</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  setEditingUser(null);
                  setShowUserDialog(true);
                }}
              >
                Add User
              </Button>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Tasks</TableCell>
                    <TableCell>Last Login</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.fullname}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={user.role === UserRoles.ADMIN ? 'error' : 'primary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{user.taskCount}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          color={user.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this user?')) {
                              console.log('Delete user:', user.id);
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Tasks Tab */}
      {selectedTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Task Management
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {systemStats.totalTasks}
                  </Typography>
                  <Typography variant="body2">Total Tasks</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {systemStats.completedTasks}
                  </Typography>
                  <Typography variant="body2">Completed</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {systemStats.pendingTasks}
                  </Typography>
                  <Typography variant="body2">Pending</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {systemStats.overdueTasks}
                  </Typography>
                  <Typography variant="body2">Overdue</Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* System Tab */}
      {selectedTab === 3 && (
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">System Settings</Typography>
              <Button
                variant="contained"
                onClick={() => setShowSystemDialog(true)}
              >
                Edit Settings
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Current Settings
                  </Typography>
                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Max Tasks Per User:</Typography>
                      <Typography>{systemSettings.maxTasksPerUser}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Max File Size (MB):</Typography>
                      <Typography>{systemSettings.maxFileSize}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Email Notifications:</Typography>
                      <Chip
                        label={systemSettings.emailNotifications ? 'Enabled' : 'Disabled'}
                        color={systemSettings.emailNotifications ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Voice Processing:</Typography>
                      <Chip
                        label={systemSettings.voiceProcessing ? 'Enabled' : 'Disabled'}
                        color={systemSettings.voiceProcessing ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>NLP Processing:</Typography>
                      <Chip
                        label={systemSettings.nlpProcessing ? 'Enabled' : 'Disabled'}
                        color={systemSettings.nlpProcessing ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Maintenance Mode:</Typography>
                      <Chip
                        label={systemSettings.maintenanceMode ? 'Enabled' : 'Disabled'}
                        color={systemSettings.maintenanceMode ? 'error' : 'success'}
                        size="small"
                      />
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    System Information
                  </Typography>
                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Server Status:</Typography>
                      <Chip label="Online" color="success" size="small" />
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Database Status:</Typography>
                      <Chip label="Connected" color="success" size="small" />
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Uptime:</Typography>
                      <Typography>99.9%</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Version:</Typography>
                      <Typography>1.0.0</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Last Backup:</Typography>
                      <Typography>2024-01-15</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Email Tab */}
      {selectedTab === 4 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Email Configuration
            </Typography>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              Email service is currently configured for Gmail. Users can configure their own email settings in their profile.
            </Alert>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Email Statistics
                  </Typography>
                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Emails Sent Today:</Typography>
                      <Typography>0</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Emails Sent This Week:</Typography>
                      <Typography>0</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Failed Deliveries:</Typography>
                      <Typography>0</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Service Status:</Typography>
                      <Chip label="Active" color="success" size="small" />
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Email Templates
                  </Typography>
                  <Stack spacing={1}>
                    <Button variant="outlined" fullWidth>
                      Welcome Email Template
                    </Button>
                    <Button variant="outlined" fullWidth>
                      Reminder Email Template
                    </Button>
                    <Button variant="outlined" fullWidth>
                      Overdue Email Template
                    </Button>
                    <Button variant="outlined" fullWidth>
                      Password Reset Template
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Security Tab */}
      {selectedTab === 5 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Security Settings
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Authentication
                  </Typography>
                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>JWT Token Expiry:</Typography>
                      <Typography>15 minutes</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Refresh Token Expiry:</Typography>
                      <Typography>7 days</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Password Requirements:</Typography>
                      <Typography>8+ characters</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Session Timeout:</Typography>
                      <Typography>24 hours</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Security Logs
                  </Typography>
                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Failed Login Attempts:</Typography>
                      <Typography>0</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Suspicious Activity:</Typography>
                      <Typography>0</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Last Security Scan:</Typography>
                      <Typography>2024-01-15</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Security Status:</Typography>
                      <Chip label="Secure" color="success" size="small" />
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* User Dialog */}
      <Dialog open={showUserDialog} onClose={() => setShowUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Username"
              value={editingUser?.username || ''}
              onChange={(e) => setEditingUser(prev => ({ ...prev, username: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={editingUser?.email || ''}
              onChange={(e) => setEditingUser(prev => ({ ...prev, email: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Full Name"
              value={editingUser?.fullname || ''}
              onChange={(e) => setEditingUser(prev => ({ ...prev, fullname: e.target.value }))}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={editingUser?.role || UserRoles.USER}
                onChange={(e) => setEditingUser(prev => ({ ...prev, role: e.target.value }))}
                label="Role"
              >
                <MenuItem value={UserRoles.USER}>User</MenuItem>
                <MenuItem value={UserRoles.ADMIN}>Admin</MenuItem>
              </Select>
            </FormControl>
            {!editingUser && (
              <TextField
                label="Password"
                type="password"
                fullWidth
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUserDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveUser}>
            {editingUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* System Settings Dialog */}
      <Dialog open={showSystemDialog} onClose={() => setShowSystemDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          System Settings
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Max Tasks Per User"
              type="number"
              value={systemSettings.maxTasksPerUser}
              onChange={(e) => handleSystemSettingsChange('maxTasksPerUser', parseInt(e.target.value))}
              fullWidth
            />
            <TextField
              label="Max File Size (MB)"
              type="number"
              value={systemSettings.maxFileSize}
              onChange={(e) => handleSystemSettingsChange('maxFileSize', parseInt(e.target.value))}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={systemSettings.emailNotifications}
                  onChange={(e) => handleSystemSettingsChange('emailNotifications', e.target.checked)}
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={systemSettings.voiceProcessing}
                  onChange={(e) => handleSystemSettingsChange('voiceProcessing', e.target.checked)}
                />
              }
              label="Voice Processing"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={systemSettings.nlpProcessing}
                  onChange={(e) => handleSystemSettingsChange('nlpProcessing', e.target.checked)}
                />
              }
              label="NLP Processing"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={systemSettings.maintenanceMode}
                  onChange={(e) => handleSystemSettingsChange('maintenanceMode', e.target.checked)}
                />
              }
              label="Maintenance Mode"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSystemDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveSystemSettings}>
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPage;