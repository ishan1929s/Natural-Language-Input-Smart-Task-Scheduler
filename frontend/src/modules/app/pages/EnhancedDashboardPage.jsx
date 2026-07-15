import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Button,
  IconButton,
  Tooltip,
  Chip,
  LinearProgress,
  Paper,
  Stack,
} from '@mui/material';
import {
  Refresh,
  TrendingUp,
  TrendingDown,
  Schedule,
  CheckCircle,
  Warning,
  Error,
  CalendarToday,
  AccessTime,
  Flag,
  Category,
  Analytics,
  PlayArrow,
  Pause,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from 'recharts';
import { useTaskQueries } from '../../../shared/hooks/useTaskQueries';
import { TaskPriority, TaskStatus } from '../../../shared/api/types';

// Enhanced Dashboard Stats Component
const DashboardStats = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent>
                  <Box
                    sx={{
                      height: 20,
                      background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  />
                  <Box
                    sx={{
                      height: 32,
                      background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite',
                      borderRadius: 1,
                      width: '60%',
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    );
  }

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats?.total || 0,
      icon: <Schedule sx={{ fontSize: 40 }} />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      change: stats?.totalChange || 0,
      trend: 'up',
    },
    {
      title: 'Completed',
      value: stats?.completed || 0,
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
      change: stats?.completedChange || 0,
      trend: 'up',
    },
    {
      title: 'Pending',
      value: stats?.pending || 0,
      icon: <Warning sx={{ fontSize: 40 }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      change: stats?.pendingChange || 0,
      trend: 'down',
    },
    {
      title: 'Overdue',
      value: stats?.overdue || 0,
      icon: <Error sx={{ fontSize: 40 }} />,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444, #f87171)',
      change: stats?.overdueChange || 0,
      trend: 'down',
    },
  ];

  return (
    <Grid container spacing={3}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <Card
              sx={{
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: stat.gradient,
                },
                '&:hover': {
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        background: stat.gradient,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      {stat.change > 0 ? (
                        <TrendingUp sx={{ fontSize: '1rem', color: '#10b981' }} />
                      ) : stat.change < 0 ? (
                        <TrendingDown sx={{ fontSize: '1rem', color: '#ef4444' }} />
                      ) : null}
                      <Typography
                        variant="caption"
                        sx={{
                          color: stat.change > 0 ? '#10b981' : stat.change < 0 ? '#ef4444' : '#64748b',
                          fontWeight: 600,
                        }}
                      >
                        {stat.change > 0 ? '+' : ''}{stat.change}%
                      </Typography>
                    </Box>
                  </Box>
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: `${stat.color}15`,
                        color: stat.color,
                      }}
                    >
                      {stat.icon}
                    </Box>
                  </motion.div>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

// Enhanced Task Completion Chart
const TaskCompletionChart = ({ data, loading = false }) => {
  if (loading) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box
            sx={{
              height: 300,
              background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: 2,
            }}
          />
        </CardContent>
      </Card>
    );
  }

  const chartData = data || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Task Completion Trend
            </Typography>
            <Chip
              label="Last 7 Days"
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white',
                fontWeight: 500,
              }}
            />
          </Box>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
              />
              <RechartsTooltip
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  borderRadius: 8,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorCompleted)"
                strokeWidth={3}
                name="Completed"
              />
              <Area
                type="monotone"
                dataKey="created"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorCreated)"
                strokeWidth={3}
                name="Created"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Enhanced Priority Distribution Chart
const PriorityDistributionChart = ({ data, loading = false }) => {
  if (loading) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box
            sx={{
              height: 300,
              background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: 2,
            }}
          />
        </CardContent>
      </Card>
    );
  }

  const chartData = data || [];
  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#dc2626'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Priority Distribution
          </Typography>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                strokeWidth={2}
                stroke="#ffffff"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  borderRadius: 8,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Enhanced Category Breakdown Chart
const CategoryBreakdownChart = ({ data, loading = false }) => {
  if (loading) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box
            sx={{
              height: 300,
              background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: 2,
            }}
          />
        </CardContent>
      </Card>
    );
  }

  const chartData = data || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Tasks by Category
          </Typography>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="category" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
              />
              <RechartsTooltip
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  borderRadius: 8,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Bar 
                dataKey="count" 
                fill="url(#colorGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Enhanced Upcoming Tasks List
const UpcomingTasksList = ({ tasks, loading = false, onTaskClick }) => {
  if (loading) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          {Array.from({ length: 3 }).map((_, index) => (
            <Box key={index} mb={2}>
              <Box
                sx={{
                  height: 20,
                  background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  borderRadius: 1,
                  mb: 1,
                }}
              />
              <Box
                sx={{
                  height: 16,
                  background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  borderRadius: 1,
                  width: '60%',
                }}
              />
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  const upcomingTasks = tasks?.filter(task => 
    task.deadline && 
    !isPast(new Date(task.deadline)) && 
    task.status === TaskStatus.PENDING
  ).slice(0, 5) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Upcoming Tasks
            </Typography>
            <Chip
              label={`${upcomingTasks.length} tasks`}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                color: 'white',
                fontWeight: 500,
              }}
            />
          </Box>
          
          {upcomingTasks.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h1" sx={{ fontSize: '3rem', mb: 2 }}>
                🎉
              </Typography>
              <Typography variant="body1" color="text.secondary">
                No upcoming tasks! You're all caught up.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {upcomingTasks.map((task, index) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                    onClick={() => onTaskClick?.(task)}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                          color: 'white',
                        }}
                      >
                        <CalendarToday sx={{ fontSize: '1rem' }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {task.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(task.deadline).toLocaleString()}
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        label={task.priority}
                        sx={{
                          background: task.priority === TaskPriority.URGENT 
                            ? 'linear-gradient(135deg, #ef4444, #f87171)'
                            : task.priority === TaskPriority.HIGH
                            ? 'linear-gradient(135deg, #f59e0b, #fbbf24)'
                            : 'linear-gradient(135deg, #10b981, #34d399)',
                          color: 'white',
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  </Paper>
                </motion.div>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main Dashboard Component
const DashboardPage = () => {
  const [refreshing, setRefreshing] = useState(false);

  const {
    useGetTasks,
    useGetAnalytics,
    useGetReminderStats,
  } = useTaskQueries();

  const { data: tasksData, isLoading, error, refetch } = useGetTasks();
  const { data: analyticsData } = useGetAnalytics();
  const { data: reminderStats } = useGetReminderStats();

  const tasks = tasksData?.data || [];

  // Calculate comprehensive stats
  const stats = useMemo(() => {
    const total = tasks.filter(task => !task.archived).length;
    const pending = tasks.filter(task => task.status === TaskStatus.PENDING && !task.archived).length;
    const completed = tasks.filter(task => task.status === TaskStatus.COMPLETED && !task.archived).length;
    const overdue = tasks.filter(task => 
      task.deadline && 
      new Date(task.deadline) < new Date() && 
      task.status === TaskStatus.PENDING && 
      !task.archived
    ).length;

    // Calculate trends (mock data for now)
    const totalChange = 12;
    const completedChange = 8;
    const pendingChange = -5;
    const overdueChange = -15;

    return { 
      total, 
      pending, 
      completed, 
      overdue,
      totalChange,
      completedChange,
      pendingChange,
      overdueChange,
    };
  }, [tasks]);

  // Generate chart data
  const chartData = useMemo(() => {
    // Completion trend data (last 7 days)
    const completionData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate.toDateString() === date.toDateString();
      });
      
      const completedTasks = tasks.filter(task => {
        const taskDate = new Date(task.updatedAt);
        return taskDate.toDateString() === date.toDateString() && 
               task.status === TaskStatus.COMPLETED;
      });
      
      completionData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        created: dayTasks.length,
        completed: completedTasks.length,
      });
    }

    // Priority distribution
    const priorityData = [
      { name: 'Low', value: tasks.filter(t => t.priority === TaskPriority.LOW).length },
      { name: 'Medium', value: tasks.filter(t => t.priority === TaskPriority.MEDIUM).length },
      { name: 'High', value: tasks.filter(t => t.priority === TaskPriority.HIGH).length },
      { name: 'Urgent', value: tasks.filter(t => t.priority === TaskPriority.URGENT).length },
    ];

    // Category breakdown
    const categoryCounts = {};
    tasks.forEach(task => {
      categoryCounts[task.category] = (categoryCounts[task.category] || 0) + 1;
    });
    
    const categoryData = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));

    return {
      completion: completionData,
      priority: priorityData,
      category: categoryData,
    };
  }, [tasks]);

  // Get upcoming tasks
  const upcomingTasks = useMemo(() => {
    return tasks.filter(task => 
      task.deadline && 
      !isPast(new Date(task.deadline)) && 
      task.status === TaskStatus.PENDING &&
      !task.archived
    ).slice(0, 5);
  }, [tasks]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const handleTaskClick = (task) => {
    console.log('Task clicked:', task);
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load dashboard data: {error.message}
        </Alert>
        <Button variant="contained" onClick={handleRefresh}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography 
              variant="h3" 
              className="gradient-text"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back! Here's what's happening with your tasks.
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Tooltip title="Refresh Data">
              <IconButton 
                onClick={handleRefresh} 
                disabled={refreshing}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  },
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </motion.div>

      {refreshing && <LinearProgress sx={{ mb: 2 }} />}

      {/* Stats Cards */}
      <DashboardStats stats={stats} loading={isLoading} />

      {/* Charts Grid */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <TaskCompletionChart data={chartData?.completion} loading={isLoading} />
        </Grid>
        <Grid item xs={12} md={4}>
          <PriorityDistributionChart data={chartData?.priority} loading={isLoading} />
        </Grid>
        <Grid item xs={12} md={6}>
          <CategoryBreakdownChart data={chartData?.category} loading={isLoading} />
        </Grid>
        <Grid item xs={12} md={6}>
          <UpcomingTasksList 
            tasks={upcomingTasks} 
            loading={isLoading}
            onTaskClick={handleTaskClick}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
