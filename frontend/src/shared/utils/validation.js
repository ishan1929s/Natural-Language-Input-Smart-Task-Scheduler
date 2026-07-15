// Validation utilities using Zod-like patterns
export const validationSchemas = {
  login: {
    username: { min: 3, max: 50, required: true },
    password: { min: 6, required: true },
  },
  register: {
    username: { min: 3, max: 16, required: true },
    email: { pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, required: true },
    fullname: { min: 1, max: 50, required: true },
    password: { min: 8, required: true },
  },
  task: {
    title: { min: 1, max: 100, required: true },
    description: { min: 1, max: 1000, required: true },
    priority: { enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    status: { enum: ['pending', 'completed'], default: 'pending' },
    category: { default: 'general' },
    time_required: { min: 1, max: 10080 }, // Max 1 week in minutes
  },
};

export const validateField = (value, rules) => {
  if (rules.required && (!value || value.toString().trim() === '')) {
    return 'This field is required';
  }

  if (value && rules.min && value.toString().length < rules.min) {
    return `Minimum length is ${rules.min} characters`;
  }

  if (value && rules.max && value.toString().length > rules.max) {
    return `Maximum length is ${rules.max} characters`;
  }

  if (value && rules.pattern && !rules.pattern.test(value)) {
    return 'Invalid format';
  }

  if (value && rules.enum && !rules.enum.includes(value)) {
    return `Must be one of: ${rules.enum.join(', ')}`;
  }

  if (value && rules.min && typeof value === 'number' && value < rules.min) {
    return `Minimum value is ${rules.min}`;
  }

  if (value && rules.max && typeof value === 'number' && value > rules.max) {
    return `Maximum value is ${rules.max}`;
  }

  return null;
};

export const validateForm = (data, schema) => {
  const errors = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(schema)) {
    const error = validateField(data[field], rules);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  }

  return { errors, isValid };
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

export const formatError = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return 'An unexpected error occurred';
};