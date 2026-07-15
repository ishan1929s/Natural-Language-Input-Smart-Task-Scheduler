import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Alert,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Stack,
} from '@mui/material';
import {
  Close,
  Save,
  Add,
  Delete,
  Schedule,
  Flag,
  Category,
  AccessTime,
  CalendarToday,
  Comment,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { validationSchemas, validateForm } from '../utils/validation';
import { TaskPriority, TaskStatus } from '../api/types';

// Task form component
export const TaskForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  initialData = null, 
  loading = false,
  title = "Create Task"
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || TaskPriority.MEDIUM,
    category: initialData?.category || 'general',
    deadline: initialData?.deadline ? dayjs(initialData.deadline) : null,
    time_required: initialData?.time_required || '',
    natural_language_input: initialData?.natural_language_input || '',
    recurring: initialData?.recurring || false,
    rrule_string: initialData?.rrule_string || '',
  });

  const [errors, setErrors] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (field) => (event) => {
    const value = event.target ? event.target.value : event;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { errors: validationErrors, isValid } = validateForm(formData, validationSchemas.task);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    const submitData = {
      ...formData,
      deadline: formData.deadline ? formData.deadline.toISOString() : null,
      time_required: formData.time_required ? parseInt(formData.time_required) : null,
    };

    onSubmit(submitData);
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      priority: TaskPriority.MEDIUM,
      category: 'general',
      deadline: null,
      time_required: '',
      natural_language_input: '',
      recurring: false,
      rrule_string: '',
    });
    setErrors({});
    setShowAdvanced(false);
    onClose();
  };

  const categories = [
    'general', 'work', 'personal', 'health', 'finance', 'education', 
    'shopping', 'travel', 'family', 'hobby', 'urgent'
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            {/* Basic Information */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Basic Information
              </Typography>
              
              <TextField
                fullWidth
                label="Task Title"
                value={formData.title}
                onChange={handleChange('title')}
                error={!!errors.title}
                helperText={errors.title}
                required
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={handleChange('description')}
                error={!!errors.description}
                helperText={errors.description}
                required
              />
            </Box>

            {/* Natural Language Input */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Natural Language Input (Optional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Describe your task in natural language"
                value={formData.natural_language_input}
                onChange={handleChange('natural_language_input')}
                placeholder="e.g., 'Meeting with John tomorrow at 3pm for 1 hour urgent work'"
                helperText="AI will automatically extract details from your description"
              />
            </Box>

            {/* Task Properties */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Task Properties
              </Typography>
              
              <Box display="flex" gap={2} flexWrap="wrap">
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={handleChange('priority')}
                    label="Priority"
                  >
                    {Object.values(TaskPriority).map(priority => (
                      <MenuItem key={priority} value={priority}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <span>{priority === TaskPriority.LOW ? '🟢' : 
                                 priority === TaskPriority.MEDIUM ? '🟡' :
                                 priority === TaskPriority.HIGH ? '🟠' : '🔴'}</span>
                          {priority}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={handleChange('category')}
                    label="Category"
                  >
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Duration (minutes)"
                  type="number"
                  value={formData.time_required}
                  onChange={handleChange('time_required')}
                  error={!!errors.time_required}
                  helperText={errors.time_required}
                  sx={{ minWidth: 150 }}
                />
              </Box>
            </Box>

            {/* Date and Time */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Schedule
              </Typography>
              
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Deadline"
                  value={formData.deadline}
                  onChange={handleChange('deadline')}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      error={!!errors.deadline}
                      helperText={errors.deadline}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>

            {/* Advanced Options */}
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={showAdvanced}
                    onChange={(e) => setShowAdvanced(e.target.checked)}
                  />
                }
                label="Show Advanced Options"
              />
            </Box>

            {showAdvanced && (
              <Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Advanced Options
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.recurring}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        recurring: e.target.checked 
                      }))}
                    />
                  }
                  label="Recurring Task"
                />
                
                {formData.recurring && (
                  <TextField
                    fullWidth
                    label="Recurrence Rule (RRULE)"
                    value={formData.rrule_string}
                    onChange={handleChange('rrule_string')}
                    placeholder="FREQ=WEEKLY;BYDAY=MO,WE,FR"
                    helperText="Advanced: Specify recurrence pattern using RRULE format"
                    sx={{ mt: 2 }}
                  />
                )}
              </Box>
            )}
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={<Save />}
          >
            {loading ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Quick task creation form
export const QuickTaskForm = ({ onSubmit, loading = false }) => {
  const [text, setText] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { errors: validationErrors, isValid } = validateForm(
      { text }, 
      validationSchemas.naturalLanguage
    );
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({ natural_language_input: text });
    setText('');
    setErrors({});
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <TextField
        fullWidth
        multiline
        rows={2}
        label="Quick Task Creation"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (errors.text) setErrors({});
        }}
        error={!!errors.text}
        helperText={errors.text || "Describe your task in natural language"}
        placeholder="e.g., 'Call dentist tomorrow at 2pm for 30 minutes'"
        InputProps={{
          endAdornment: (
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading || !text.trim()}
              sx={{ ml: 1 }}
            >
              {loading ? 'Creating...' : 'Create'}
            </Button>
          ),
        }}
      />
    </Box>
  );
};

// Comment form component
export const CommentForm = ({ onSubmit, loading = false }) => {
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setErrors({ comment: 'Comment cannot be empty' });
      return;
    }

    onSubmit(comment);
    setComment('');
    setErrors({});
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <TextField
        fullWidth
        multiline
        rows={2}
        label="Add Comment"
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
          if (errors.comment) setErrors({});
        }}
        error={!!errors.comment}
        helperText={errors.comment}
        placeholder="Add a comment or note..."
        InputProps={{
          endAdornment: (
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading || !comment.trim()}
              sx={{ ml: 1 }}
              startIcon={<Comment />}
            >
              {loading ? 'Adding...' : 'Add'}
            </Button>
          ),
        }}
      />
    </Box>
  );
};
