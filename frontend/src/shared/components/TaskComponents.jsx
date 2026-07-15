import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  CheckCircle,
  Schedule,
  Flag,
  Comment,
  Archive,
  MoreVert,
  AccessTime,
  CalendarToday,
} from '@mui/icons-material';
import { format, isToday, isTomorrow, isPast, isThisWeek } from 'date-fns';
import { TaskPriority, TaskStatus } from '../api/types';

// Priority color mapping
const priorityColors = {
  [TaskPriority.LOW]: 'success',
  [TaskPriority.MEDIUM]: 'warning',
  [TaskPriority.HIGH]: 'error',
  [TaskPriority.URGENT]: 'error',
};

// Priority icons
const priorityIcons = {
  [TaskPriority.LOW]: '🟢',
  [TaskPriority.MEDIUM]: '🟡',
  [TaskPriority.HIGH]: '🟠',
  [TaskPriority.URGENT]: '🔴',
};

// Task card component
export const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete, 
  onComplete, 
  onArchive, 
  onAddComment,
  loading = false,
  compact = false 
}) => {
  if (loading) {
    return <TaskCardSkeleton compact={compact} />;
  }

  const handleComplete = () => {
    if (onComplete) onComplete(task._id);
  };

  const handleArchive = () => {
    if (onArchive) onArchive(task._id);
  };

  const handleAddComment = () => {
    if (onAddComment) onAddComment(task._id);
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return null;
    
    const date = new Date(deadline);
    
    if (isPast(date)) {
      return { text: 'Overdue', color: 'error', icon: '⚠️' };
    } else if (isToday(date)) {
      return { text: 'Today', color: 'warning', icon: '🔥' };
    } else if (isTomorrow(date)) {
      return { text: 'Tomorrow', color: 'info', icon: '📅' };
    } else if (isThisWeek(date)) {
      return { text: format(date, 'EEEE'), color: 'primary', icon: '📆' };
    } else {
      return { text: format(date, 'MMM dd'), color: 'default', icon: '📅' };
    }
  };

  const deadlineInfo = formatDeadline(task.deadline);
  const isOverdue = deadlineInfo?.color === 'error';

  return (
    <Card 
      sx={{ 
        mb: 2, 
        border: isOverdue ? '2px solid' : '1px solid',
        borderColor: isOverdue ? 'error.main' : 'divider',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
        },
        opacity: task.status === TaskStatus.COMPLETED ? 0.7 : 1,
      }}
    >
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <Typography 
              variant={compact ? "subtitle1" : "h6"} 
              sx={{ 
                textDecoration: task.status === TaskStatus.COMPLETED ? 'line-through' : 'none',
                flex: 1,
              }}
            >
              {task.title}
            </Typography>
            {task.recurring && (
              <Tooltip title="Recurring Task">
                <Chip size="small" label="🔄" variant="outlined" />
              </Tooltip>
            )}
            {task.auto_categorized && (
              <Tooltip title="AI Categorized">
                <Chip size="small" label="🤖" variant="outlined" />
              </Tooltip>
            )}
          </Box>
        }
        action={
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              size="small"
              label={`${priorityIcons[task.priority]} ${task.priority}`}
              color={priorityColors[task.priority]}
              variant="outlined"
            />
            <IconButton size="small">
              <MoreVert />
            </IconButton>
          </Box>
        }
      />
      
      <CardContent>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 2 }}
        >
          {task.description}
        </Typography>
        
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          <Chip
            size="small"
            label={task.category}
            variant="outlined"
            color="primary"
          />
          
          {task.time_required && (
            <Chip
              size="small"
              icon={<AccessTime />}
              label={`${task.time_required}m`}
              variant="outlined"
            />
          )}
          
          {task.comments?.length > 0 && (
            <Chip
              size="small"
              icon={<Comment />}
              label={`${task.comments.length} comments`}
              variant="outlined"
            />
          )}
        </Box>
        
        {deadlineInfo && (
          <Alert 
            severity={deadlineInfo.color} 
            icon={<CalendarToday />}
            sx={{ mb: 2 }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <span>{deadlineInfo.icon}</span>
              <Typography variant="body2">
                {deadlineInfo.text} {task.deadline && format(new Date(task.deadline), 'h:mm a')}
              </Typography>
            </Box>
          </Alert>
        )}
        
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" gap={1}>
            {task.status === TaskStatus.PENDING && (
              <Tooltip title="Mark Complete">
                <IconButton 
                  size="small" 
                  color="success"
                  onClick={handleComplete}
                >
                  <CheckCircle />
                </IconButton>
              </Tooltip>
            )}
            
            <Tooltip title="Add Comment">
              <IconButton 
                size="small" 
                color="primary"
                onClick={handleAddComment}
              >
                <Comment />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={task.archived ? "Unarchive" : "Archive"}>
              <IconButton 
                size="small" 
                color="secondary"
                onClick={handleArchive}
              >
                <Archive />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Typography variant="caption" color="text.secondary">
            {format(new Date(task.createdAt), 'MMM dd, yyyy')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Task card skeleton for loading state
export const TaskCardSkeleton = ({ compact = false }) => (
  <Card sx={{ mb: 2 }}>
    <CardHeader
      title={<Skeleton variant="text" width="60%" />}
      action={<Skeleton variant="circular" width={24} height={24} />}
    />
    <CardContent>
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="80%" />
      <Box display="flex" gap={1} my={2}>
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="rounded" width={80} height={24} />
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" gap={1}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
        <Skeleton variant="text" width={80} />
      </Box>
    </CardContent>
  </Card>
);

// Task list component
export const TaskList = ({ 
  tasks, 
  loading, 
  onTaskAction,
  compact = false,
  emptyMessage = "No tasks found"
}) => {
  if (loading) {
    return (
      <Box>
        {Array.from({ length: 3 }).map((_, index) => (
          <TaskCardSkeleton key={index} compact={compact} />
        ))}
      </Box>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        py={8}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {emptyMessage}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first task to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onComplete={onTaskAction?.complete}
          onArchive={onTaskAction?.archive}
          onAddComment={onTaskAction?.addComment}
          onEdit={onTaskAction?.edit}
          onDelete={onTaskAction?.delete}
          compact={compact}
        />
      ))}
    </Box>
  );
};

// Task stats component
export const TaskStats = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <Box display="flex" gap={2} flexWrap="wrap">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} sx={{ flex: 1, minWidth: 150 }}>
            <CardContent>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="h4" width="40%" />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  const statItems = [
    { label: 'Total Tasks', value: stats?.total || 0, color: 'primary' },
    { label: 'Pending', value: stats?.pending || 0, color: 'warning' },
    { label: 'Completed', value: stats?.completed || 0, color: 'success' },
    { label: 'Overdue', value: stats?.overdue || 0, color: 'error' },
  ];

  return (
    <Box display="flex" gap={2} flexWrap="wrap">
      {statItems.map((item, index) => (
        <Card key={index} sx={{ flex: 1, minWidth: 150 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {item.label}
            </Typography>
            <Typography variant="h4" color={`${item.color}.main`}>
              {item.value}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
