import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Fab,
  Alert,
  Snackbar,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Download,
  Upload,
  Refresh,
  ViewList,
  ViewModule,
  FilterList,
  Sort,
  Archive,
  Delete,
  CheckCircle,
  Schedule,
  TrendingUp,
} from '@mui/icons-material';
import { useTaskQueries } from '../../../shared/hooks/useTaskQueries';
import { TaskForm } from '../../../shared/components/FormComponents';
import { TaskList, TaskStats } from '../../../shared/components/TaskComponents';
import { TaskFilters, QuickFilters } from '../../../shared/components/FilterComponents';
import { VoiceInput } from '../../../shared/components/VoiceComponents';
import { TaskPriority, TaskStatus } from '../../../shared/api/types';

const TasksPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('created');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('card');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const {
    useGetTasks,
    useCreateTask,
    useUpdateTask,
    useDeleteTask,
    useCompleteTask,
    useArchiveTask,
    useAddComment,
    useBulkUpdate,
    useBulkDelete,
    useBulkArchive,
    useExportTasks,
    useImportTasks,
    useGetReminderStats,
    useParseNaturalLanguage,
  } = useTaskQueries();

  const { data: tasksData, isLoading, error, refetch } = useGetTasks({
    ...filters,
    sortBy,
    sortOrder,
  });

  const { data: reminderStats } = useGetReminderStats();

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const completeTaskMutation = useCompleteTask();
  const archiveTaskMutation = useArchiveTask();
  const addCommentMutation = useAddComment();
  const bulkUpdateMutation = useBulkUpdate();
  const bulkDeleteMutation = useBulkDelete();
  const bulkArchiveMutation = useBulkArchive();
  const exportTasksMutation = useExportTasks();
  const importTasksMutation = useImportTasks();
  const parseNLPMutation = useParseNaturalLanguage();

  const tasks = tasksData?.data || [];

  // Filter tasks based on active tab
  const filteredTasks = useMemo(() => {
    switch (activeTab) {
      case 0: // All tasks
        return tasks.filter(task => !task.archived);
      case 1: // Pending
        return tasks.filter(task => task.status === TaskStatus.PENDING && !task.archived);
      case 2: // Completed
        return tasks.filter(task => task.status === TaskStatus.COMPLETED && !task.archived);
      case 3: // Overdue
        return tasks.filter(task => 
          task.deadline && 
          new Date(task.deadline) < new Date() && 
          task.status === TaskStatus.PENDING && 
          !task.archived
        );
      case 4: // Recurring
        return tasks.filter(task => task.recurring && !task.archived);
      case 5: // Archived
        return tasks.filter(task => task.archived);
      default:
        return tasks;
    }
  }, [tasks, activeTab]);

  // Calculate stats
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

    return { total, pending, completed, overdue };
  }, [tasks]);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateTask = async (taskData) => {
    try {
      await createTaskMutation.mutateAsync(taskData);
      setShowCreateForm(false);
      showSnackbar('Task created successfully!', 'success');
    } catch (error) {
      showSnackbar(`Failed to create task: ${error.message}`, 'error');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTaskMutation.mutateAsync({
        taskId: editingTask._id,
        data: taskData,
      });
      setEditingTask(null);
      showSnackbar('Task updated successfully!', 'success');
    } catch (error) {
      showSnackbar(`Failed to update task: ${error.message}`, 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTaskMutation.mutateAsync(taskId);
        showSnackbar('Task deleted successfully!', 'success');
      } catch (error) {
        showSnackbar(`Failed to delete task: ${error.message}`, 'error');
      }
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await completeTaskMutation.mutateAsync(taskId);
      showSnackbar('Task marked as completed!', 'success');
    } catch (error) {
      showSnackbar(`Failed to complete task: ${error.message}`, 'error');
    }
  };

  const handleArchiveTask = async (taskId) => {
    try {
      await archiveTaskMutation.mutateAsync(taskId);
      showSnackbar('Task archived successfully!', 'success');
    } catch (error) {
      showSnackbar(`Failed to archive task: ${error.message}`, 'error');
    }
  };

  const handleAddComment = async (taskId) => {
    const comment = prompt('Enter your comment:');
    if (comment) {
      try {
        await addCommentMutation.mutateAsync({ taskId, comment });
        showSnackbar('Comment added successfully!', 'success');
      } catch (error) {
        showSnackbar(`Failed to add comment: ${error.message}`, 'error');
      }
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = ({ field, order }) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  const handleVoiceTaskCreated = (task) => {
    showSnackbar('Task created from voice input!', 'success');
  };

  const handleQuickFilter = (filterType) => {
    switch (filterType) {
      case 'urgent':
        setFilters(prev => ({ ...prev, priority: TaskPriority.URGENT }));
        break;
      case 'today':
        // Filter for tasks due today
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        setFilters(prev => ({ ...prev, deadline: today.toISOString() }));
        break;
      case 'overdue':
        setFilters(prev => ({ ...prev, overdue: true }));
        break;
      case 'completed':
        setFilters(prev => ({ ...prev, status: TaskStatus.COMPLETED }));
        break;
      case 'recurring':
        setFilters(prev => ({ ...prev, recurring: 'true' }));
        break;
      default:
        setFilters({});
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExportTasks = async () => {
    try {
      const result = await exportTasksMutation.mutateAsync('json');
      const blob = new Blob([result.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showSnackbar('Tasks exported successfully!', 'success');
    } catch (error) {
      showSnackbar(`Failed to export tasks: ${error.message}`, 'error');
    }
    handleMenuClose();
  };

  const handleImportTasks = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          await importTasksMutation.mutateAsync({ file, format: 'json' });
          showSnackbar('Tasks imported successfully!', 'success');
        } catch (error) {
          showSnackbar(`Failed to import tasks: ${error.message}`, 'error');
        }
      }
    };
    input.click();
    handleMenuClose();
  };

  const handleRefresh = () => {
    refetch();
    showSnackbar('Tasks refreshed!', 'info');
  };

  const handleBulkAction = async (action) => {
    if (selectedTasks.length === 0) {
      showSnackbar('Please select tasks first', 'warning');
      return;
    }

    try {
      switch (action) {
        case 'complete':
          await bulkUpdateMutation.mutateAsync({
            taskIds: selectedTasks,
            updates: { status: TaskStatus.COMPLETED }
          });
          showSnackbar(`${selectedTasks.length} tasks marked as completed!`, 'success');
          break;
        case 'archive':
          await bulkArchiveMutation.mutateAsync(selectedTasks);
          showSnackbar(`${selectedTasks.length} tasks archived!`, 'success');
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} tasks?`)) {
            await bulkDeleteMutation.mutateAsync(selectedTasks);
            showSnackbar(`${selectedTasks.length} tasks deleted!`, 'success');
          }
          break;
      }
      setSelectedTasks([]);
    } catch (error) {
      showSnackbar(`Failed to perform bulk action: ${error.message}`, 'error');
    }
    handleMenuClose();
  };

  const tabs = [
    { label: 'All Tasks', count: stats.total },
    { label: 'Pending', count: stats.pending },
    { label: 'Completed', count: stats.completed },
    { label: 'Overdue', count: stats.overdue },
    { label: 'Recurring', count: tasks.filter(task => task.recurring && !task.archived).length },
    { label: 'Archived', count: tasks.filter(task => task.archived).length },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Tasks</Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowCreateForm(true)}
          >
            Create Task
          </Button>
          <IconButton onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleExportTasks}>
          <ListItemIcon>
            <Download />
          </ListItemIcon>
          <ListItemText>Export Tasks</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleImportTasks}>
          <ListItemIcon>
            <Upload />
          </ListItemIcon>
          <ListItemText>Import Tasks</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleBulkAction('complete')}>
          <ListItemIcon>
            <CheckCircle />
          </ListItemIcon>
          <ListItemText>Mark Selected Complete</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('archive')}>
          <ListItemIcon>
            <Archive />
          </ListItemIcon>
          <ListItemText>Archive Selected</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('delete')}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText>Delete Selected</ListItemText>
        </MenuItem>
      </Menu>

      <TaskStats stats={stats} loading={isLoading} />

      <VoiceInput 
        mode="create"
        onTaskCreated={handleVoiceTaskCreated}
      />

      <QuickFilters 
        onFilterSelect={handleQuickFilter}
        activeFilters={filters}
      />

      <TaskFilters
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
        onViewChange={handleViewChange}
        viewMode={viewMode}
        initialFilters={filters}
      />

      <Paper sx={{ mb: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  {tab.label}
                  <Badge badgeContent={tab.count} color="primary" />
                </Box>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load tasks: {error.message}
        </Alert>
      )}

      <TaskList
        tasks={filteredTasks}
        loading={isLoading}
        onTaskAction={{
          complete: handleCompleteTask,
          archive: handleArchiveTask,
          addComment: handleAddComment,
          edit: setEditingTask,
          delete: handleDeleteTask,
        }}
        compact={viewMode === 'list'}
        emptyMessage={`No ${tabs[activeTab].label.toLowerCase()} found`}
      />

      <TaskForm
        open={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateTask}
        loading={createTaskMutation.isLoading}
      />

      <TaskForm
        open={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        initialData={editingTask}
        loading={updateTaskMutation.isLoading}
        title="Edit Task"
      />

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setShowCreateForm(true)}
      >
        <Add />
      </Fab>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TasksPage;