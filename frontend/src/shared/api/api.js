import { api } from './client';

// ============================================================================
// AUTH API
// ============================================================================
export const authApi = {
  register: (data) => api.post('/api/v1/auth/register', data),
  login: (data) => api.post('/api/v1/auth/login', data),
  logout: () => api.post('/api/v1/auth/logout'),
  refresh: (refreshToken) => api.post('/api/v1/auth/refresh', { refreshToken }),
  getMe: () => api.get('/api/v1/auth/me'),
  changePassword: (data) => api.patch('/api/v1/auth/change-password', data),
  updateDetails: (data) => api.patch('/api/v1/auth/update', data),
  updateEmailConfig: (emailConfig) => api.patch('/api/v1/auth/email-config', { emailConfig }),
  forgotPassword: (data) => api.post('/api/v1/auth/forgot-password', data),
  resetPassword: (data) => api.post('/api/v1/auth/reset-password', data),
  deleteAccount: () => api.delete('/api/v1/auth/delete'),
};

// ============================================================================
// TASK API
// ============================================================================
export const taskApi = {
  // Basic CRUD
  create: (data) => api.post('/api/v1/tasks', data),
  getAll: (params) => api.get('/api/v1/tasks', { params }),
  getById: (taskId) => api.get(`/api/v1/tasks/${taskId}`),
  update: (taskId, data) => api.patch(`/api/v1/tasks/${taskId}`, data),
  delete: (taskId) => api.delete(`/api/v1/tasks/${taskId}`),
  
  // Status updates
  complete: (taskId) => api.patch(`/api/v1/tasks/${taskId}/complete`),
  pending: (taskId) => api.patch(`/api/v1/tasks/${taskId}/pending`),
  archive: (taskId) => api.patch(`/api/v1/tasks/${taskId}/archive`),
  unarchive: (taskId) => api.patch(`/api/v1/tasks/${taskId}/unarchive`),
  
  // Comments
  addComment: (taskId, comment) => api.post(`/api/v1/tasks/${taskId}/comments`, { comment }),
  getComments: (taskId) => api.get(`/api/v1/tasks/${taskId}/comments`),
  
  // Search & Filter
  search: (query) => api.get('/api/v1/tasks/search', { params: { query } }),
  filterByCategory: (category) => api.get(`/api/v1/tasks/category/${category}`),
  
  // Sorting
  sortByDeadlineAsc: () => api.get('/api/v1/tasks/sort/deadline'),
  sortByPriority: () => api.get('/api/v1/tasks/sort/priority'),
  sortByCreated: () => api.get('/api/v1/tasks/sort/created'),
  sortByTimeRequired: () => api.get('/api/v1/tasks/sort/time-required'),
  
  // NLP
  parseNaturalLanguage: (text) => api.post('/api/v1/tasks/nlp/parse', { text }),
  
  // Recurring Tasks
  createRecurring: (data) => api.post('/api/v1/tasks/recurring', data),
  getRecurring: () => api.get('/api/v1/tasks/recurring'),
  getRecurringInstances: (taskId) => api.get(`/api/v1/tasks/recurring/${taskId}/instances`),
  updateRecurring: (taskId, data) => api.put(`/api/v1/tasks/recurring/${taskId}`, data),
  deleteRecurring: (taskId, deleteType) => api.delete(`/api/v1/tasks/recurring/${taskId}`, { data: { delete_type: deleteType } }),
  
  // Reminders
  scheduleReminder: (taskId, reminderTime) => api.post(`/api/v1/tasks/${taskId}/reminder`, { reminderTime }),
  getReminderStats: () => api.get('/api/v1/tasks/reminders/stats'),
  checkDeadlines: () => api.get('/api/v1/tasks/deadlines/check'),
  
  // Email
  sendWelcomeEmail: (email, emailConfig) => api.post('/api/v1/tasks/send-welcome-email', { email, emailConfig }),
  
  // Analytics and Statistics
  getAnalytics: () => api.get('/api/v1/tasks/analytics'),
  
  // Bulk Operations
  bulkUpdate: (taskIds, updates) => api.patch('/api/v1/tasks/bulk-update', { taskIds, updates }),
  bulkDelete: (taskIds) => api.delete('/api/v1/tasks/bulk-delete', { data: { taskIds } }),
  bulkArchive: (taskIds) => api.patch('/api/v1/tasks/bulk-archive', { taskIds }),
  
  // Advanced Features
  getTimeSlots: (duration, window = 7) => api.get('/api/v1/tasks/time-slots', { 
    params: { duration, window } 
  }),
  detectConflicts: (deadline, duration) => api.post('/api/v1/tasks/detect-conflicts', { 
    deadline, duration 
  }),
  
  // Export/Import
  exportTasks: (format = 'json') => api.get('/api/v1/tasks/export', { 
    params: { format },
    responseType: 'blob'
  }),
  importTasks: (file, format = 'json') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);
    return api.post('/api/v1/tasks/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// ============================================================================
// VOICE API
// ============================================================================
export const voiceApi = {
  transcribe: (audioFile, options = {}) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    Object.entries(options).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return api.post('/api/v1/voice/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  parse: (audioFile, options = {}) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    Object.entries(options).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return api.post('/api/v1/voice/parse', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  createTask: (audioFile, options = {}) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    Object.entries(options).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return api.post('/api/v1/voice/create-task', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
