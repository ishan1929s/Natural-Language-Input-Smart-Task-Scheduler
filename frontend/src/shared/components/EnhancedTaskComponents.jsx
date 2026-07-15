import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Avatar,
  Stack,
  Button,
  Badge,
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
  PlayArrow,
  Pause,
  Refresh,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isTomorrow, isPast, isThisWeek } from 'date-fns';
import { TaskPriority, TaskStatus } from '../api/types';

// Enhanced priority colors with gradients
const priorityConfig = {
  [TaskPriority.LOW]: {
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    icon: '🟢',
    label: 'Low',
  },
  [TaskPriority.MEDIUM]: {
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    icon: '🟡',
    label: 'Medium',
  },
  [TaskPriority.HIGH]: {
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #f87171)',
    icon: '🟠',
    label: 'High',
  },
  [TaskPriority.URGENT]: {
    color: '#dc2626',
    gradient: 'linear-gradient(135deg, #dc2626, #ef4444)',
    icon: '🔴',
    label: 'Urgent',
  },
};

// Enhanced task card with modern design
export const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete, 
  onComplete, 
  onArchive, 
  onAddComment,
  loading = false,
  compact = false,
  index = 0
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  if (loading) {
    return <TaskCardSkeleton compact={compact} />;
  }

  const handleComplete = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (onComplete) onComplete(task._id);
      setIsAnimating(false);
    }, 300);
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
      return { text: 'Overdue', color: '#ef4444', icon: '⚠️', urgent: true };
    } else if (isToday(date)) {
      return { text: 'Today', color: '#f59e0b', icon: '🔥', urgent: true };
    } else if (isTomorrow(date)) {
      return { text: 'Tomorrow', color: '#3b82f6', icon: '📅', urgent: false };
    } else if (isThisWeek(date)) {
      return { text: format(date, 'EEEE'), color: '#6366f1', icon: '📆', urgent: false };
    } else {
      return { text: format(date, 'MMM dd'), color: '#64748b', icon: '📅', urgent: false };
    }
  };

  const deadlineInfo = formatDeadline(task.deadline);
  const priorityInfo = priorityConfig[task.priority];
  const isOverdue = deadlineInfo?.urgent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        type: 'spring',
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        sx={{ 
          mb: 2,
          position: 'relative',
          overflow: 'hidden',
          background: isOverdue 
            ? 'linear-gradient(135deg, #fef2f2, #fee2e2)'
            : 'linear-gradient(135deg, #ffffff, #f8fafc)',
          border: isOverdue 
            ? '2px solid #ef4444'
            : isHovered 
              ? '2px solid #6366f1'
              : '1px solid rgba(0, 0, 0, 0.05)',
          borderRadius: 3,
          boxShadow: isHovered
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: priorityInfo.gradient,
            opacity: isHovered ? 1 : 0.7,
            transition: 'opacity 0.3s ease',
          },
        }}
      >
        {/* Priority Badge */}
        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
          <motion.div
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            <Chip
              size="small"
              label={`${priorityInfo.icon} ${priorityInfo.label}`}
              sx={{
                background: priorityInfo.gradient,
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                },
              }}
            />
          </motion.div>
        </Box>

        <CardContent sx={{ pt: 3, pb: 2 }}>
          {/* Task Title */}
          <Typography 
            variant={compact ? "subtitle1" : "h6"} 
            sx={{ 
              fontWeight: 600,
              mb: 1,
              pr: 8,
              textDecoration: task.status === TaskStatus.COMPLETED ? 'line-through' : 'none',
              color: task.status === TaskStatus.COMPLETED ? '#64748b' : '#1e293b',
              background: task.status === TaskStatus.COMPLETED 
                ? 'linear-gradient(90deg, #64748b 0%, #94a3b8 100%)'
                : 'linear-gradient(90deg, #1e293b 0%, #334155 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {task.title}
          </Typography>
          
          {/* Task Description */}
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2,
              color: '#64748b',
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: compact ? 2 : 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {task.description}
          </Typography>
          
          {/* Task Metadata */}
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Chip
              size="small"
              label={task.category}
              sx={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white',
                fontWeight: 500,
              }}
            />
            
            {task.time_required && (
              <Chip
                size="small"
                icon={<AccessTime sx={{ fontSize: '0.875rem' }} />}
                label={`${task.time_required}m`}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                  color: 'white',
                  fontWeight: 500,
                }}
              />
            )}
            
            {task.comments?.length > 0 && (
              <Chip
                size="small"
                icon={<Comment sx={{ fontSize: '0.875rem' }} />}
                label={`${task.comments.length}`}
                sx={{
                  background: 'linear-gradient(135deg, #10b981, #34d399)',
                  color: 'white',
                  fontWeight: 500,
                }}
              />
            )}

            {task.recurring && (
              <Chip
                size="small"
                label="🔄 Recurring"
                sx={{
                  background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                  color: 'white',
                  fontWeight: 500,
                }}
              />
            )}

            {task.auto_categorized && (
              <Chip
                size="small"
                label="🤖 AI"
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                  color: 'white',
                  fontWeight: 500,
                }}
              />
            )}
          </Stack>
          
          {/* Deadline Alert */}
          {deadlineInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  background: deadlineInfo.urgent
                    ? 'linear-gradient(135deg, #fef2f2, #fee2e2)'
                    : 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                  border: `1px solid ${deadlineInfo.color}20`,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    background: deadlineInfo.color,
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography sx={{ fontSize: '1.2rem' }}>
                    {deadlineInfo.icon}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: deadlineInfo.color,
                    }}
                  >
                    {deadlineInfo.text}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#64748b',
                      ml: 'auto',
                    }}
                  >
                    {format(new Date(task.deadline), 'h:mm a')}
                  </Typography>
                </Stack>
              </Box>
            </motion.div>
          )}
          
          {/* Action Buttons */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              pt: 1,
            }}
          >
            <Stack direction="row" spacing={1}>
              {task.status === TaskStatus.PENDING && (
                <Tooltip title="Mark Complete">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IconButton 
                      size="small" 
                      onClick={handleComplete}
                      sx={{
                        background: 'linear-gradient(135deg, #10b981, #34d399)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #059669, #10b981)',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <CheckCircle />
                    </IconButton>
                  </motion.div>
                </Tooltip>
              )}
              
              <Tooltip title="Add Comment">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton 
                    size="small" 
                    onClick={handleAddComment}
                    sx={{
                      background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <Comment />
                  </IconButton>
                </motion.div>
              </Tooltip>
              
              <Tooltip title={task.archived ? "Unarchive" : "Archive"}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton 
                    size="small" 
                    onClick={handleArchive}
                    sx={{
                      background: 'linear-gradient(135deg, #64748b, #94a3b8)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #475569, #64748b)',
                        boxShadow: '0 4px 12px rgba(100, 116, 139, 0.4)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <Archive />
                  </IconButton>
                </motion.div>
              </Tooltip>
            </Stack>
            
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#94a3b8',
                fontWeight: 500,
              }}
            >
              {format(new Date(task.createdAt), 'MMM dd')}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Enhanced skeleton with shimmer effect
export const TaskCardSkeleton = ({ compact = false }) => (
  <Card sx={{ mb: 2, borderRadius: 3 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              height: compact ? 20 : 24,
              background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: 1,
              mb: 1,
              width: '70%',
            }}
          />
          <Box
            sx={{
              height: 16,
              background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: 1,
              width: '90%',
            }}
          />
        </Box>
        <Box
          sx={{
            width: 60,
            height: 24,
            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: 2,
          }}
        />
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            height: 14,
            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: 1,
            mb: 0.5,
            width: '100%',
          }}
        />
        <Box
          sx={{
            height: 14,
            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: 1,
            width: '80%',
          }}
        />
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Box
          sx={{
            width: 60,
            height: 24,
            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: 2,
          }}
        />
        <Box
          sx={{
            width: 80,
            height: 24,
            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: 2,
          }}
        />
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: '50%',
            }}
          />
          <Box
            sx={{
              width: 32,
              height: 32,
              background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: '50%',
            }}
          />
        </Box>
        <Box
          sx={{
            width: 60,
            height: 12,
            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: 1,
          }}
        />
      </Box>
    </CardContent>
  </Card>
);

// Enhanced task list with animations
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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box 
          sx={{
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            py: 8,
            px: 4,
            textAlign: 'center',
          }}
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
              📝
            </Typography>
          </motion.div>
          <Typography 
            variant="h5" 
            className="gradient-text"
            sx={{ fontWeight: 600, mb: 1 }}
          >
            {emptyMessage}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ color: '#64748b', maxWidth: 400 }}
          >
            Create your first task to get started with TaskMaster. Use natural language or voice input for quick task creation!
          </Typography>
        </Box>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <Box>
        {tasks.map((task, index) => (
          <TaskCard
            key={task._id}
            task={task}
            onComplete={onTaskAction?.complete}
            onArchive={onTaskAction?.archive}
            onAddComment={onTaskAction?.addComment}
            onEdit={onTaskAction?.edit}
            onDelete={onTaskAction?.delete}
            compact={compact}
            index={index}
          />
        ))}
      </Box>
    </AnimatePresence>
  );
};

// Enhanced task stats with animations
export const TaskStats = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} sx={{ flex: 1, minWidth: 150, borderRadius: 3 }}>
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
        ))}
      </Box>
    );
  }

  const statItems = [
    { 
      label: 'Total Tasks', 
      value: stats?.total || 0, 
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      icon: '📊',
      change: stats?.totalChange || 0,
    },
    { 
      label: 'Completed', 
      value: stats?.completed || 0, 
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
      icon: '✅',
      change: stats?.completedChange || 0,
    },
    { 
      label: 'Pending', 
      value: stats?.pending || 0, 
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      icon: '⏳',
      change: stats?.pendingChange || 0,
    },
    { 
      label: 'Overdue', 
      value: stats?.overdue || 0, 
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444, #f87171)',
      icon: '⚠️',
      change: stats?.overdueChange || 0,
    },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
      {statItems.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ y: -4, scale: 1.02 }}
        >
          <Card 
            sx={{ 
              flex: 1, 
              minWidth: 150,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: stat.gradient,
              },
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                  {stat.label}
                </Typography>
                <Typography variant="h4" sx={{ fontSize: '1.5rem' }}>
                  {stat.icon}
                </Typography>
              </Box>
              
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
              
              {stat.change !== 0 && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  {stat.change > 0 ? (
                    <TrendingUp sx={{ fontSize: '1rem', color: '#10b981' }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: '1rem', color: '#ef4444' }} />
                  )}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: stat.change > 0 ? '#10b981' : '#ef4444',
                      fontWeight: 600,
                    }}
                  >
                    {stat.change > 0 ? '+' : ''}{stat.change}%
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </Box>
  );
};
