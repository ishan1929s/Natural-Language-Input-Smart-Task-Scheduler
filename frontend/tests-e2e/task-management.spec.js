import { test, expect } from '@playwright/test';

// Test data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  fullname: 'Test User',
  password: 'testpassword123',
};

const testTask = {
  title: 'E2E Test Task',
  description: 'This is a test task created during E2E testing',
  priority: 'medium',
  category: 'work',
  time_required: 60,
};

test.describe('Authentication Flow', () => {
  test('should register a new user', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('[data-testid="username-input"]', testUser.username);
    await page.fill('[data-testid="email-input"]', testUser.email);
    await page.fill('[data-testid="fullname-input"]', testUser.fullname);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.fill('[data-testid="confirm-password-input"]', testUser.password);
    
    await page.click('[data-testid="register-button"]');
    
    // Should redirect to tasks page after successful registration
    await expect(page).toHaveURL('/tasks');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should login with existing user', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[data-testid="username-input"]', testUser.username);
    await page.fill('[data-testid="password-input"]', testUser.password);
    
    await page.click('[data-testid="login-button"]');
    
    // Should redirect to tasks page after successful login
    await expect(page).toHaveURL('/tasks');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should logout user', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[data-testid="username-input"]', testUser.username);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');
    
    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');
    
    // Should redirect to login page
    await expect(page).toHaveURL('/login');
  });
});

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[data-testid="username-input"]', testUser.username);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/tasks');
  });

  test('should create a new task', async ({ page }) => {
    await page.click('[data-testid="create-task-button"]');
    
    await page.fill('[data-testid="task-title-input"]', testTask.title);
    await page.fill('[data-testid="task-description-input"]', testTask.description);
    await page.selectOption('[data-testid="task-priority-select"]', testTask.priority);
    await page.fill('[data-testid="task-category-input"]', testTask.category);
    await page.fill('[data-testid="task-duration-input"]', testTask.time_required.toString());
    
    await page.click('[data-testid="save-task-button"]');
    
    // Should show success message and task in list
    await expect(page.locator('[data-testid="success-snackbar"]')).toBeVisible();
    await expect(page.locator(`text=${testTask.title}`)).toBeVisible();
  });

  test('should edit an existing task', async ({ page }) => {
    // First create a task
    await page.click('[data-testid="create-task-button"]');
    await page.fill('[data-testid="task-title-input"]', testTask.title);
    await page.fill('[data-testid="task-description-input"]', testTask.description);
    await page.click('[data-testid="save-task-button"]');
    
    // Wait for task to appear
    await expect(page.locator(`text=${testTask.title}`)).toBeVisible();
    
    // Edit the task
    await page.click('[data-testid="edit-task-button"]');
    await page.fill('[data-testid="task-title-input"]', 'Updated Task Title');
    await page.click('[data-testid="save-task-button"]');
    
    // Should show updated title
    await expect(page.locator('text=Updated Task Title')).toBeVisible();
  });

  test('should mark task as completed', async ({ page }) => {
    // Create a task first
    await page.click('[data-testid="create-task-button"]');
    await page.fill('[data-testid="task-title-input"]', testTask.title);
    await page.fill('[data-testid="task-description-input"]', testTask.description);
    await page.click('[data-testid="save-task-button"]');
    
    // Mark as completed
    await page.click('[data-testid="complete-task-button"]');
    
    // Should show success message
    await expect(page.locator('[data-testid="success-snackbar"]')).toBeVisible();
  });

  test('should delete a task', async ({ page }) => {
    // Create a task first
    await page.click('[data-testid="create-task-button"]');
    await page.fill('[data-testid="task-title-input"]', testTask.title);
    await page.fill('[data-testid="task-description-input"]', testTask.description);
    await page.click('[data-testid="save-task-button"]');
    
    // Delete the task
    await page.click('[data-testid="delete-task-button"]');
    
    // Confirm deletion
    await page.click('[data-testid="confirm-delete-button"]');
    
    // Should show success message
    await expect(page.locator('[data-testid="success-snackbar"]')).toBeVisible();
  });

  test('should filter tasks by status', async ({ page }) => {
    // Create a completed task
    await page.click('[data-testid="create-task-button"]');
    await page.fill('[data-testid="task-title-input"]', 'Completed Task');
    await page.fill('[data-testid="task-description-input"]', testTask.description);
    await page.click('[data-testid="save-task-button"]');
    
    // Mark as completed
    await page.click('[data-testid="complete-task-button"]');
    
    // Filter by completed tasks
    await page.click('[data-testid="completed-tab"]');
    
    // Should only show completed tasks
    await expect(page.locator('text=Completed Task')).toBeVisible();
  });

  test('should search tasks', async ({ page }) => {
    // Create a task with specific title
    await page.click('[data-testid="create-task-button"]');
    await page.fill('[data-testid="task-title-input"]', 'Searchable Task');
    await page.fill('[data-testid="task-description-input"]', testTask.description);
    await page.click('[data-testid="save-task-button"]');
    
    // Search for the task
    await page.fill('[data-testid="search-input"]', 'Searchable');
    
    // Should show only matching tasks
    await expect(page.locator('text=Searchable Task')).toBeVisible();
  });
});

test.describe('Voice Input', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[data-testid="username-input"]', testUser.username);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/tasks');
  });

  test('should navigate to voice page', async ({ page }) => {
    await page.click('[data-testid="voice-nav-link"]');
    await expect(page).toHaveURL('/voice');
    await expect(page.locator('text=Voice Input')).toBeVisible();
  });

  test('should show voice recording controls', async ({ page }) => {
    await page.goto('/voice');
    
    await expect(page.locator('[data-testid="start-recording-button"]')).toBeVisible();
    await expect(page.locator('text=Start Recording')).toBeVisible();
  });

  test('should display voice input instructions', async ({ page }) => {
    await page.goto('/voice');
    
    await expect(page.locator('text=Instructions:')).toBeVisible();
    await expect(page.locator('text=Click "Start Recording" to begin voice input')).toBeVisible();
  });
});

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[data-testid="username-input"]', testUser.username);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/tasks');
  });

  test('should navigate to dashboard', async ({ page }) => {
    await page.click('[data-testid="dashboard-nav-link"]');
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should display dashboard statistics', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page.locator('text=Total Tasks')).toBeVisible();
    await expect(page.locator('text=Completed')).toBeVisible();
    await expect(page.locator('text=Pending')).toBeVisible();
    await expect(page.locator('text=Overdue')).toBeVisible();
  });

  test('should show upcoming tasks', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page.locator('text=Upcoming Tasks')).toBeVisible();
  });
});

test.describe('Admin Panel', () => {
  test('should show access denied for regular users', async ({ page }) => {
    // Login as regular user
    await page.goto('/login');
    await page.fill('[data-testid="username-input"]', testUser.username);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');
    
    // Try to access admin panel
    await page.goto('/admin');
    
    await expect(page.locator('text=Access denied. Admin privileges required.')).toBeVisible();
  });
});

test.describe('Jobs Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[data-testid="username-input"]', testUser.username);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/tasks');
  });

  test('should navigate to jobs page', async ({ page }) => {
    await page.click('[data-testid="jobs-nav-link"]');
    await expect(page).toHaveURL('/jobs');
    await expect(page.locator('text=Background Jobs')).toBeVisible();
  });

  test('should display job statistics', async ({ page }) => {
    await page.goto('/jobs');
    
    await expect(page.locator('text=Total Jobs')).toBeVisible();
    await expect(page.locator('text=Running')).toBeVisible();
    await expect(page.locator('text=Paused')).toBeVisible();
    await expect(page.locator('text=Failed')).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/login');
    await page.fill('[data-testid="username-input"]', testUser.username);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');
    
    // Should still work on mobile
    await expect(page).toHaveURL('/tasks');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should work on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/login');
    await page.fill('[data-testid="username-input"]', testUser.username);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');
    
    // Should work on tablet
    await expect(page).toHaveURL('/tasks');
  });
});

test.describe('Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/api/**', route => route.abort());
    
    await page.goto('/login');
    await page.fill('[data-testid="username-input"]', testUser.username);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');
    
    // Should show error message
    await expect(page.locator('[data-testid="error-snackbar"]')).toBeVisible();
  });

  test('should handle invalid form data', async ({ page }) => {
    await page.goto('/register');
    
    // Try to submit empty form
    await page.click('[data-testid="register-button"]');
    
    // Should show validation errors
    await expect(page.locator('[data-testid="username-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('should load pages quickly', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/login');
    await page.fill('[data-testid="username-input"]', testUser.username);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveURL('/tasks');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
  });
});
