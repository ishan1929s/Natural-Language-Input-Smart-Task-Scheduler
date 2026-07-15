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
} from '@mui/icons-material';
import { useTaskQueries } from '../../../shared/hooks/useTaskQueries';
import { Dashboard } from '../../../shared/components/DashboardComponents';
import { TaskPriority, TaskStatus } from '../../../shared/api/types';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isPast } from 'date-fns';

const DashboardPage = () => {
  const [refreshing, setRefreshing] = useState(false);

  const {
    useGetTasks,
    useGetAnalytics,
    useGetReminderStats,
    useCheckDeadlines,
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
    const totalChange = 12; // +12% from last week
    const completedChange = 8; // +8% from last week
    const pendingChange = -5; // -5% from last week
    const overdueChange = -15; // -15% from last week

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
        date: format(date, 'MMM dd'),
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

  // Generate productivity insights
  const insights = useMemo(() => {
    const insightsList = [];
    
    // Completion rate insight
    const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
    if (completionRate > 70) {
      insightsList.push({
        type: 'positive',
        title: 'Great Job!',
        description: `You've completed ${completionRate.toFixed(1)}% of your tasks. Keep up the excellent work!`,
      });
    } else if (completionRate < 30) {
      insightsList.push({
        type: 'negative',
        title: 'Need Focus',
        description: `Only ${completionRate.toFixed(1)}% of tasks completed. Consider breaking down large tasks into smaller ones.`,
      });
    }

    // Overdue tasks insight
    if (stats.overdue > 0) {
      insightsList.push({
        type: 'negative',
        title: 'Overdue Tasks',
        description: `You have ${stats.overdue} overdue task${stats.overdue > 1 ? 's' : ''}. Consider prioritizing these or adjusting deadlines.`,
      });
    }

    // Priority distribution insight
    const urgentTasks = tasks.filter(t => t.priority === TaskPriority.URGENT && !t.archived).length;
    if (urgentTasks > 3) {
      insightsList.push({
        type: 'warning',
        title: 'Too Many Urgent Tasks',
        description: `You have ${urgentTasks} urgent tasks. Consider if some can be deprioritized to reduce stress.`,
      });
    }

    // Recent activity insight
    const recentTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return taskDate > weekAgo;
    }).length;

    if (recentTasks > 10) {
      insightsList.push({
        type: 'positive',
        title: 'Active Week',
        description: `You've created ${recentTasks} tasks this week. Great productivity!`,
      });
    }

    return insightsList;
  }, [tasks, stats]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const handleTaskClick = (task) => {
    // Navigate to task detail or open task modal
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Dashboard</Typography>
        <Box display="flex" gap={1}>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} disabled={refreshing}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {refreshing && <LinearProgress sx={{ mb: 2 }} />}

      <Dashboard
        stats={stats}
        chartData={chartData}
        upcomingTasks={upcomingTasks}
        insights={insights}
        loading={isLoading}
        onTaskClick={handleTaskClick}
        onRefresh={handleRefresh}
      />
    </Box>
  );
};

export default DashboardPage;