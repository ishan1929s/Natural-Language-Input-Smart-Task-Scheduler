// User types
export const UserRoles = {
  USER: 'user',
  ADMIN: 'admin'
};

export const TaskStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed'
};

export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// API Response structure
export const createApiResponse = (statusCode, message, data, success = true) => ({
  statusCode,
  message,
  data,
  success
});

// Validation schemas using Zod
export const userSchema = {
  username: { min: 3, max: 16, required: true },
  email: { pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, required: true },
  fullname: { min: 1, max: 50, required: true },
  password: { min: 8, required: true }
};

export const taskSchema = {
  title: { min: 1, max: 50, required: true },
  description: { min: 1, max: 1000, required: true },
  priority: { enum: Object.values(TaskPriority), default: TaskPriority.MEDIUM },
  status: { enum: Object.values(TaskStatus), default: TaskStatus.PENDING },
  category: { default: 'general' },
  time_required: { min: 1, max: 10080 } // Max 1 week in minutes
};

// Default configurations
export const defaultConfigs = {
  pagination: {
    pageSize: 10,
    maxPageSize: 100
  },
  workingHours: {
    start: 9,
    end: 17
  },
  reminderIntervals: {
    urgent: 2, // hours
    upcoming: 24 // hours
  },
  fileUpload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['audio/*']
  }
};
