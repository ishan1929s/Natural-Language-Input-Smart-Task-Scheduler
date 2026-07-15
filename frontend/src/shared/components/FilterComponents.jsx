import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Paper,
  Typography,
  Stack,
  Divider,
  Collapse,
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  ExpandMore,
  ExpandLess,
  Sort,
  ViewList,
  ViewModule,
  CalendarToday,
  Flag,
  Category,
  Archive,
} from '@mui/icons-material';
import { TaskPriority, TaskStatus } from '../api/types';

// Filter and search component
export const TaskFilters = ({ 
  onFiltersChange, 
  onSortChange, 
  onViewChange,
  viewMode = 'card',
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    status: initialFilters.status || 'all',
    priority: initialFilters.priority || 'all',
    category: initialFilters.category || 'all',
    archived: initialFilters.archived || false,
    recurring: initialFilters.recurring || 'all',
    ...initialFilters
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'created');
  const [sortOrder, setSortOrder] = useState(initialFilters.sortOrder || 'desc');

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    onSortChange?.({ field, order });
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      status: 'all',
      priority: 'all',
      category: 'all',
      archived: false,
      recurring: 'all',
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== 'all' && value !== false
  );

  const categories = [
    'general', 'work', 'personal', 'health', 'finance', 'education', 
    'shopping', 'travel', 'family', 'hobby', 'urgent'
  ];

  const sortOptions = [
    { value: 'created', label: 'Created Date' },
    { value: 'deadline', label: 'Deadline' },
    { value: 'priority', label: 'Priority' },
    { value: 'title', label: 'Title' },
    { value: 'time_required', label: 'Duration' },
  ];

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack spacing={2}>
        {/* Search and Basic Filters */}
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              endAdornment: filters.search && (
                <IconButton 
                  size="small" 
                  onClick={() => handleFilterChange('search', '')}
                >
                  <Clear />
                </IconButton>
              ),
            }}
            sx={{ flex: 1, minWidth: 200 }}
          />

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value={TaskStatus.PENDING}>Pending</MenuItem>
              <MenuItem value={TaskStatus.COMPLETED}>Completed</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              label="Priority"
            >
              <MenuItem value="all">All</MenuItem>
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
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              label="Category"
            >
              <MenuItem value="all">All</MenuItem>
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? <ExpandLess /> : <ExpandMore />}
            Advanced
          </Button>

          <Button
            variant="outlined"
            startIcon={<Sort />}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            Sort
          </Button>

          <Box display="flex" gap={1}>
            <Tooltip title="Card View">
              <IconButton
                color={viewMode === 'card' ? 'primary' : 'default'}
                onClick={() => onViewChange?.('card')}
              >
                <ViewModule />
              </IconButton>
            </Tooltip>
            <Tooltip title="List View">
              <IconButton
                color={viewMode === 'list' ? 'primary' : 'default'}
                onClick={() => onViewChange?.('list')}
              >
                <ViewList />
              </IconButton>
            </Tooltip>
          </Box>

          {hasActiveFilters && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Clear />}
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </Box>

        {/* Advanced Filters */}
        <Collapse in={showAdvanced}>
          <Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Advanced Filters & Sorting
            </Typography>
            
            <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Recurring</InputLabel>
                <Select
                  value={filters.recurring}
                  onChange={(e) => handleFilterChange('recurring', e.target.value)}
                  label="Recurring"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="true">Recurring Only</MenuItem>
                  <MenuItem value="false">Non-Recurring Only</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Archived</InputLabel>
                <Select
                  value={filters.archived ? 'true' : 'false'}
                  onChange={(e) => handleFilterChange('archived', e.target.value === 'true')}
                  label="Archived"
                >
                  <MenuItem value="false">Active</MenuItem>
                  <MenuItem value="true">Archived</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value, sortOrder)}
                  label="Sort By"
                >
                  {sortOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Order</InputLabel>
                <Select
                  value={sortOrder}
                  onChange={(e) => handleSortChange(sortBy, e.target.value)}
                  label="Order"
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Collapse>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Active Filters:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {filters.search && (
                <Chip
                  label={`Search: "${filters.search}"`}
                  onDelete={() => handleFilterChange('search', '')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.status !== 'all' && (
                <Chip
                  label={`Status: ${filters.status}`}
                  onDelete={() => handleFilterChange('status', 'all')}
                  color="secondary"
                  variant="outlined"
                />
              )}
              {filters.priority !== 'all' && (
                <Chip
                  label={`Priority: ${filters.priority}`}
                  onDelete={() => handleFilterChange('priority', 'all')}
                  color="warning"
                  variant="outlined"
                />
              )}
              {filters.category !== 'all' && (
                <Chip
                  label={`Category: ${filters.category}`}
                  onDelete={() => handleFilterChange('category', 'all')}
                  color="info"
                  variant="outlined"
                />
              )}
              {filters.recurring !== 'all' && (
                <Chip
                  label={`Recurring: ${filters.recurring === 'true' ? 'Yes' : 'No'}`}
                  onDelete={() => handleFilterChange('recurring', 'all')}
                  color="success"
                  variant="outlined"
                />
              )}
              {filters.archived && (
                <Chip
                  label="Archived"
                  onDelete={() => handleFilterChange('archived', false)}
                  color="error"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

// Quick filter chips
export const QuickFilters = ({ onFilterSelect, activeFilters = {} }) => {
  const quickFilters = [
    { key: 'urgent', label: 'Urgent', icon: '🔴', color: 'error' },
    { key: 'today', label: 'Due Today', icon: '📅', color: 'warning' },
    { key: 'overdue', label: 'Overdue', icon: '⚠️', color: 'error' },
    { key: 'completed', label: 'Completed', icon: '✅', color: 'success' },
    { key: 'recurring', label: 'Recurring', icon: '🔄', color: 'info' },
  ];

  return (
    <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
      {quickFilters.map(filter => (
        <Chip
          key={filter.key}
          label={`${filter.icon} ${filter.label}`}
          onClick={() => onFilterSelect?.(filter.key)}
          color={activeFilters[filter.key] ? filter.color : 'default'}
          variant={activeFilters[filter.key] ? 'filled' : 'outlined'}
          clickable
        />
      ))}
    </Box>
  );
};
