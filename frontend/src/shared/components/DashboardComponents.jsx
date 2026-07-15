import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Skeleton,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
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
  Refresh,
} from '@mui/icons-material';
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
} from 'recharts';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isPast } from 'date-fns';
import { TaskPriority, TaskStatus } from '../api/types';

// Dashboard stats component
export const DashboardStats = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="h4" width="40%" />
                <Skeleton variant="text" width="80%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats?.total || 0,
      icon: <Schedule color="primary" />,
      color: 'primary',
      change: stats?.totalChange || 0,
    },
    {
      title: 'Completed',
      value: stats?.completed || 0,
      icon: <CheckCircle color="success" />,
      color: 'success',
      change: stats?.completedChange || 0,
    },
    {
      title: 'Pending',
      value: stats?.pending || 0,
      icon: <Warning color="warning" />,
      color: 'warning',
      change: stats?.pendingChange || 0,
    },
    {
      title: 'Overdue',
      value: stats?.overdue || 0,
      icon: <Error color="error" />,
      color: 'error',
      change: stats?.overdueChange || 0,
    },
  ];

  return (
    <Grid container spacing={3}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" color={`${stat.color}.main`}>
                    {stat.value}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {stat.change > 0 ? (
                      <TrendingUp color="success" fontSize="small" />
                    ) : stat.change < 0 ? (
                      <TrendingDown color="error" fontSize="small" />
                    ) : null}
                    <Typography 
                      variant="body2" 
                      color={stat.change > 0 ? 'success.main' : stat.change < 0 ? 'error.main' : 'text.secondary'}
                      sx={{ ml: 0.5 }}
                    >
                      {stat.change > 0 ? '+' : ''}{stat.change}%
                    </Typography>
                  </Box>
                </Box>
                <Box color={`${stat.color}.main`}>
                  {stat.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// Task completion chart
export const TaskCompletionChart = ({ data, loading = false }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader title="Task Completion Trend" />
        <CardContent>
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    );
  }

  const chartData = data || [];

  return (
    <Card>
      <CardHeader 
        title="Task Completion Trend"
        action={
          <Tooltip title="Refresh Data">
            <IconButton>
              <Refresh />
            </IconButton>
          </Tooltip>
        }
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip />
            <Line 
              type="monotone" 
              dataKey="completed" 
              stroke="#4caf50" 
              strokeWidth={2}
              name="Completed"
            />
            <Line 
              type="monotone" 
              dataKey="created" 
              stroke="#2196f3" 
              strokeWidth={2}
              name="Created"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Priority distribution chart
export const PriorityDistributionChart = ({ data, loading = false }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader title="Priority Distribution" />
        <CardContent>
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    );
  }

  const chartData = data || [];
  const COLORS = ['#4caf50', '#ff9800', '#f44336', '#9c27b0'];

  return (
    <Card>
      <CardHeader title="Priority Distribution" />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Category breakdown chart
export const CategoryBreakdownChart = ({ data, loading = false }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader title="Tasks by Category" />
        <CardContent>
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    );
  }

  const chartData = data || [];

  return (
    <Card>
      <CardHeader title="Tasks by Category" />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <RechartsTooltip />
            <Bar dataKey="count" fill="#2196f3" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Upcoming tasks list
export const UpcomingTasksList = ({ tasks, loading = false, onTaskClick }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader title="Upcoming Tasks" />
        <CardContent>
          {Array.from({ length: 3 }).map((_, index) => (
            <Box key={index} mb={2}>
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
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
    <Card>
      <CardHeader title="Upcoming Tasks" />
      <CardContent>
        {upcomingTasks.length === 0 ? (
          <Alert severity="info">
            No upcoming tasks scheduled.
          </Alert>
        ) : (
          <List>
            {upcomingTasks.map((task, index) => (
              <React.Fragment key={task._id}>
                <ListItem 
                  button 
                  onClick={() => onTaskClick?.(task)}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemIcon>
                    <CalendarToday color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={task.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(task.deadline), 'MMM dd, yyyy h:mm a')}
                        </Typography>
                        <Box display="flex" gap={1} mt={0.5}>
                          <Chip
                            size="small"
                            label={task.priority}
                            color={task.priority === TaskPriority.URGENT ? 'error' : 
                                   task.priority === TaskPriority.HIGH ? 'warning' : 'default'}
                            variant="outlined"
                          />
                          <Chip
                            size="small"
                            label={task.category}
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < upcomingTasks.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

// Productivity insights
export const ProductivityInsights = ({ insights, loading = false }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader title="Productivity Insights" />
        <CardContent>
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="90%" />
        </CardContent>
      </Card>
    );
  }

  const insightsList = insights || [];

  return (
    <Card>
      <CardHeader title="Productivity Insights" />
      <CardContent>
        {insightsList.length === 0 ? (
          <Alert severity="info">
            Complete more tasks to see productivity insights.
          </Alert>
        ) : (
          <List>
            {insightsList.map((insight, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    {insight.type === 'positive' ? (
                      <TrendingUp color="success" />
                    ) : insight.type === 'negative' ? (
                      <TrendingDown color="error" />
                    ) : (
                      <Schedule color="info" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={insight.title}
                    secondary={insight.description}
                  />
                </ListItem>
                {index < insightsList.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

// Main dashboard component
export const Dashboard = ({ 
  stats, 
  chartData, 
  upcomingTasks, 
  insights,
  loading = false,
  onTaskClick,
  onRefresh 
}) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Box mb={3}>
        <DashboardStats stats={stats} loading={loading} />
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <TaskCompletionChart data={chartData?.completion} loading={loading} />
        </Grid>
        <Grid item xs={12} md={4}>
          <PriorityDistributionChart data={chartData?.priority} loading={loading} />
        </Grid>
        <Grid item xs={12} md={6}>
          <CategoryBreakdownChart data={chartData?.category} loading={loading} />
        </Grid>
        <Grid item xs={12} md={6}>
          <UpcomingTasksList 
            tasks={upcomingTasks} 
            loading={loading}
            onTaskClick={onTaskClick}
          />
        </Grid>
        <Grid item xs={12}>
          <ProductivityInsights insights={insights} loading={loading} />
        </Grid>
      </Grid>
    </Box>
  );
};
