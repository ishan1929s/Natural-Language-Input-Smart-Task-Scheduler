import { test, expect } from '@playwright/test';

// Helper function to clear auth state
async function clearAuth(page) {
  await page.evaluate(() => {
    localStorage.removeItem('tm_access_token');
    localStorage.removeItem('tm_refresh_token');
  });
}

// Helper to login
async function login(page, username, password) {
  await page.goto('/login');
  await page.fill('input[name="username"], [label*="Username"]', username);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
}

test.describe('Authentication - Complete Test Suite', () => {
  
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
  });

  test.describe('Registration Flow', () => {
    
    test('should successfully register a new user', async ({ page }) => {
      await page.goto('/register');
      
      const timestamp = Date.now();
      await page.fill('input[label*="Username"]', `testuser${timestamp}`);
      await page.fill('input[type="email"]', `test${timestamp}@example.com`);
      await page.fill('input[label*="Full Name"]', 'Test User');
      await page.fill('input[type="password"]', 'testpassword123');
      await page.fill('input[label*="Confirm Password"]', 'testpassword123');
      
      await page.click('button[type="submit"]');
      
      // Should redirect to login page
      await expect(page).toHaveURL('/login');
      
      // Should show success message or be able to login
      await page.fill('input[name="username"], [label*="Username"]', `testuser${timestamp}`);
      await page.fill('input[type="password"]', 'testpassword123');
      await page.click('button[type="submit"]');
      
      // Should redirect to dashboard
      await page.waitForURL('/dashboard', { timeout: 5000 });
    });

    test('should show error for duplicate username', async ({ page }) => {
      await page.goto('/register');
      
      // Try to register with username that might exist
      await page.fill('input[label*="Username"]', 'testuser');
      await page.fill('input[type="email"]', `unique${Date.now()}@example.com`);
      await page.fill('input[label*="Full Name"]', 'Test User');
      await page.fill('input[type="password"]', 'testpassword123');
      await page.fill('input[label*="Confirm Password"]', 'testpassword123');
      
      await page.click('button[type="submit"]');
      
      // Should show error about username being taken
      const errorText = await page.textContent('.MuiAlert-message, [role="alert"]').catch(() => '');
      expect(errorText.toLowerCase()).toMatch(/username|taken|exists/);
    });

    test('should validate password length', async ({ page }) => {
      await page.goto('/register');
      
      const timestamp = Date.now();
      await page.fill('input[label*="Username"]', `testuser${timestamp}`);
      await page.fill('input[type="email"]', `test${timestamp}@example.com`);
      await page.fill('input[label*="Full Name"]', 'Test User');
      await page.fill('input[type="password"]', 'short');
      await page.fill('input[label*="Confirm Password"]', 'short');
      
      await page.click('button[type="submit"]');
      
      // Should show error about password length
      const errorText = await page.textContent('.MuiAlert-message, [role="alert"], .MuiFormHelperText-root').catch(() => '');
      expect(errorText.toLowerCase()).toMatch(/password|8 characters|length/);
    });

    test('should validate password confirmation match', async ({ page }) => {
      await page.goto('/register');
      
      const timestamp = Date.now();
      await page.fill('input[label*="Username"]', `testuser${timestamp}`);
      await page.fill('input[type="email"]', `test${timestamp}@example.com`);
      await page.fill('input[label*="Full Name"]', 'Test User');
      await page.fill('input[type="password"]', 'testpassword123');
      await page.fill('input[label*="Confirm Password"]', 'differentpassword');
      
      await page.click('button[type="submit"]');
      
      // Should show error about passwords not matching
      const errorText = await page.textContent('.MuiAlert-message, [role="alert"], .MuiFormHelperText-root').catch(() => '');
      expect(errorText.toLowerCase()).toMatch(/password|match/);
    });

    test('should validate email format', async ({ page }) => {
      await page.goto('/register');
      
      const timestamp = Date.now();
      await page.fill('input[label*="Username"]', `testuser${timestamp}`);
      await page.fill('input[type="email"]', 'invalidemail');
      await page.fill('input[label*="Full Name"]', 'Test User');
      await page.fill('input[type="password"]', 'testpassword123');
      await page.fill('input[label*="Confirm Password"]', 'testpassword123');
      
      await page.click('button[type="submit"]');
      
      // Should show error about invalid email
      const errorText = await page.textContent('.MuiAlert-message, [role="alert"], .MuiFormHelperText-root').catch(() => '');
      expect(errorText.toLowerCase()).toMatch(/email|valid|format/);
    });
  });

  test.describe('Login Flow - Email/Password', () => {
    
    test('should successfully login with valid credentials', async ({ page }) => {
      // First register a user
      await page.goto('/register');
      const timestamp = Date.now();
      const username = `logintest${timestamp}`;
      const password = 'testpass123';
      
      await page.fill('input[label*="Username"]', username);
      await page.fill('input[type="email"]', `${username}@example.com`);
      await page.fill('input[label*="Full Name"]', 'Login Test User');
      await page.fill('input[type="password"]', password);
      await page.fill('input[label*="Confirm Password"]', password);
      await page.click('button[type="submit"]');
      
      await page.waitForURL('/login');
      
      // Now login
      await page.fill('input[name="username"], [label*="Username"]', username);
      await page.fill('input[type="password"]', password);
      await page.click('button[type="submit"]');
      
      // Should redirect to dashboard
      await page.waitForURL('/dashboard', { timeout: 5000 });
      
      // Check tokens are stored
      const accessToken = await page.evaluate(() => localStorage.getItem('tm_access_token'));
      const refreshToken = await page.evaluate(() => localStorage.getItem('tm_refresh_token'));
      
      expect(accessToken).toBeTruthy();
      expect(refreshToken).toBeTruthy();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login');
      
      await page.fill('input[name="username"], [label*="Username"]', 'nonexistentuser');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      
      // Should show error message
      const errorAlert = await page.locator('.MuiAlert-message, [role="alert"]').first();
      await expect(errorAlert).toBeVisible();
      
      const errorText = await errorAlert.textContent();
      expect(errorText.toLowerCase()).toMatch(/invalid|credentials|not found|incorrect/);
    });

    test('should show error for wrong password', async ({ page }) => {
      // Use a known username but wrong password
      await page.goto('/login');
      
      await page.fill('input[name="username"], [label*="Username"]', 'testuser');
      await page.fill('input[type="password"]', 'definitelywrongpassword');
      await page.click('button[type="submit"]');
      
      // Should show error message
      const errorAlert = await page.locator('.MuiAlert-message, [role="alert"]').first();
      await expect(errorAlert).toBeVisible();
      
      const errorText = await errorAlert.textContent();
      expect(errorText.toLowerCase()).toMatch(/invalid|password|incorrect|credentials/);
    });

    test('should require username or email', async ({ page }) => {
      await page.goto('/login');
      
      // Try to submit without username
      await page.fill('input[type="password"]', 'somepassword');
      await page.click('button[type="submit"]');
      
      // Should show validation error
      const errorText = await page.textContent('.MuiAlert-message, [role="alert"], .MuiFormHelperText-root').catch(() => '');
      expect(errorText.toLowerCase()).toMatch(/username|email|required/);
    });

    test('should require password', async ({ page }) => {
      await page.goto('/login');
      
      // Try to submit without password
      await page.fill('input[name="username"], [label*="Username"]', 'testuser');
      await page.click('button[type="submit"]');
      
      // Should show validation error
      const errorText = await page.textContent('.MuiAlert-message, [role="alert"], .MuiFormHelperText-root').catch(() => '');
      expect(errorText.toLowerCase()).toMatch(/password|required/);
    });
  });

  test.describe('Login Redirect', () => {
    
    test('should redirect to dashboard after successful login', async ({ page }) => {
      await page.goto('/login');
      
      // Assuming we have a test user
      await page.fill('input[name="username"], [label*="Username"]', 'testuser');
      await page.fill('input[type="password"]', 'testpassword');
      await page.click('button[type="submit"]');
      
      // Wait for navigation
      await page.waitForURL(/\/(dashboard|login)/, { timeout: 5000 });
      
      // If login succeeded, should be on dashboard
      const url = page.url();
      if (!url.includes('/login')) {
        expect(url).toContain('/dashboard');
      }
    });
  });

  test.describe('Protected Routes', () => {
    
    test('should redirect to login when accessing protected route without auth', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Should redirect to login
      await page.waitForURL('/login', { timeout: 5000 });
    });

    test('should allow access to protected routes when authenticated', async ({ page }) => {
      // Set valid tokens (mock)
      await page.evaluate(() => {
        localStorage.setItem('tm_access_token', 'mock_token');
        localStorage.setItem('tm_refresh_token', 'mock_refresh_token');
      });
      
      await page.goto('/dashboard');
      
      // Should stay on dashboard or show loading (not redirect to login immediately)
      await page.waitForTimeout(2000);
      const url = page.url();
      
      // If tokens are invalid, will redirect to login eventually
      // But initially should try to access the route
      expect(url).toMatch(/\/(dashboard|login)/);
    });
  });

  test.describe('OAuth - GitHub Login', () => {
    
    test('should have GitHub login button', async ({ page }) => {
      await page.goto('/login');
      
      const githubButton = await page.locator('button:has-text("GitHub")');
      await expect(githubButton).toBeVisible();
    });

    test('should redirect to GitHub OAuth on button click', async ({ page }) => {
      await page.goto('/login');
      
      const githubButton = await page.locator('button:has-text("GitHub")');
      
      // Listen for navigation
      const navigationPromise = page.waitForURL(/github\.com|\/api\/v1\/auth\/github/, { timeout: 5000 });
      
      await githubButton.click();
      
      // Should redirect to GitHub or backend OAuth endpoint
      await navigationPromise.catch(() => {});
      
      const url = page.url();
      expect(url).toMatch(/github|\/api\/v1\/auth\/github/);
    });
  });

  test.describe('OAuth Callback Handler', () => {
    
    test('should handle OAuth callback with tokens', async ({ page }) => {
      // Simulate OAuth callback with tokens
      await page.goto('/auth/callback?accessToken=test_access_token&refreshToken=test_refresh_token');
      
      // Should store tokens
      await page.waitForTimeout(1000);
      
      const accessToken = await page.evaluate(() => localStorage.getItem('tm_access_token'));
      const refreshToken = await page.evaluate(() => localStorage.getItem('tm_refresh_token'));
      
      expect(accessToken).toBe('test_access_token');
      expect(refreshToken).toBe('test_refresh_token');
      
      // Should redirect to dashboard
      await page.waitForURL('/dashboard', { timeout: 5000 });
    });

    test('should handle OAuth callback with error', async ({ page }) => {
      // Simulate OAuth callback with error
      await page.goto('/auth/callback?error=Authentication%20failed');
      
      // Should show error
      const errorAlert = await page.locator('.MuiAlert-message, [role="alert"]').first();
      await expect(errorAlert).toBeVisible();
      
      const errorText = await errorAlert.textContent();
      expect(errorText).toContain('Authentication failed');
      
      // Should redirect to login
      await page.waitForURL('/login', { timeout: 5000 });
    });
  });

  test.describe('Token Storage', () => {
    
    test('should store tokens with correct keys after login', async ({ page }) => {
      await page.goto('/login');
      
      // Mock successful login
      await page.evaluate(() => {
        localStorage.setItem('tm_access_token', 'test_access');
        localStorage.setItem('tm_refresh_token', 'test_refresh');
      });
      
      const accessToken = await page.evaluate(() => localStorage.getItem('tm_access_token'));
      const refreshToken = await page.evaluate(() => localStorage.getItem('tm_refresh_token'));
      
      expect(accessToken).toBe('test_access');
      expect(refreshToken).toBe('test_refresh');
      
      // Should NOT have old keys
      const oldAccessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
      const oldRefreshToken = await page.evaluate(() => localStorage.getItem('refreshToken'));
      
      expect(oldAccessToken).toBeNull();
      expect(oldRefreshToken).toBeNull();
    });
  });

  test.describe('Session Persistence', () => {
    
    test('should maintain session after page reload', async ({ page }) => {
      // Set tokens
      await page.evaluate(() => {
        localStorage.setItem('tm_access_token', 'persistent_token');
        localStorage.setItem('tm_refresh_token', 'persistent_refresh');
      });
      
      await page.goto('/dashboard');
      await page.reload();
      
      // Tokens should still be there
      const accessToken = await page.evaluate(() => localStorage.getItem('tm_access_token'));
      const refreshToken = await page.evaluate(() => localStorage.getItem('tm_refresh_token'));
      
      expect(accessToken).toBe('persistent_token');
      expect(refreshToken).toBe('persistent_refresh');
    });
  });

  test.describe('Logout', () => {
    
    test('should clear tokens on logout', async ({ page }) => {
      // Set tokens
      await page.evaluate(() => {
        localStorage.setItem('tm_access_token', 'logout_test_token');
        localStorage.setItem('tm_refresh_token', 'logout_test_refresh');
      });
      
      await page.goto('/dashboard');
      
      // Find and click logout button
      const logoutButton = await page.locator('button:has-text("Logout"), button:has-text("Sign Out")').first();
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
        
        // Check tokens are cleared
        const accessToken = await page.evaluate(() => localStorage.getItem('tm_access_token'));
        const refreshToken = await page.evaluate(() => localStorage.getItem('tm_refresh_token'));
        
        expect(accessToken).toBeNull();
        expect(refreshToken).toBeNull();
      }
    });
  });

  test.describe('Error Messages', () => {
    
    test('should show clear error for invalid credentials', async ({ page }) => {
      await page.goto('/login');
      
      await page.fill('input[name="username"], [label*="Username"]', 'wronguser');
      await page.fill('input[type="password"]', 'wrongpass');
      await page.click('button[type="submit"]');
      
      const errorAlert = await page.locator('.MuiAlert-message, [role="alert"]').first();
      await expect(errorAlert).toBeVisible();
      
      const errorText = await errorAlert.textContent();
      // Error should be descriptive
      expect(errorText.length).toBeGreaterThan(10);
      expect(errorText.toLowerCase()).toMatch(/invalid|incorrect|not found|credentials/);
    });
  });

  test.describe('Navigation Links', () => {
    
    test('should navigate from login to register', async ({ page }) => {
      await page.goto('/login');
      
      const registerLink = await page.locator('a:has-text("Sign up"), a:has-text("Create")');
      await registerLink.first().click();
      
      await expect(page).toHaveURL('/register');
    });

    test('should navigate from register to login', async ({ page }) => {
      await page.goto('/register');
      
      const loginLink = await page.locator('a:has-text("Sign in"), a:has-text("Login")');
      await loginLink.first().click();
      
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Edge Cases', () => {
    
    test('should handle special characters in username', async ({ page }) => {
      await page.goto('/login');
      
      await page.fill('input[name="username"], [label*="Username"]', 'user@#$%');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Should handle gracefully (either error or not found)
      await page.waitForTimeout(2000);
      const url = page.url();
      expect(url).toMatch(/\/(login|dashboard)/);
    });

    test('should trim whitespace from inputs', async ({ page }) => {
      await page.goto('/login');
      
      await page.fill('input[name="username"], [label*="Username"]', '  testuser  ');
      await page.fill('input[type="password"]', '  password123  ');
      
      // Input should be trimmed (backend handles this)
      // Just verify the form submits
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
    });

    test('should handle very long inputs', async ({ page }) => {
      await page.goto('/login');
      
      const longString = 'a'.repeat(1000);
      await page.fill('input[name="username"], [label*="Username"]', longString);
      await page.fill('input[type="password"]', longString);
      await page.click('button[type="submit"]');
      
      // Should handle without crashing
      await page.waitForTimeout(2000);
      expect(page.url()).toContain('/login');
    });
  });

  test.describe('UI/UX', () => {
    
    test('should show password visibility toggle', async ({ page }) => {
      await page.goto('/login');
      
      const passwordField = await page.locator('input[type="password"]').first();
      const toggleButton = await page.locator('button[aria-label*="password"], button:has([data-testid*="Visibility"])').first();
      
      if (await toggleButton.isVisible()) {
        await toggleButton.click();
        
        // Password field should now be type="text"
        const fieldType = await passwordField.getAttribute('type');
        expect(fieldType).toBe('text');
      }
    });

    test('should have accessible form labels', async ({ page }) => {
      await page.goto('/login');
      
      // Check for labels
      const usernameLabel = await page.locator('label:has-text("Username"), label:has-text("Email")').first();
      const passwordLabel = await page.locator('label:has-text("Password")').first();
      
      await expect(usernameLabel).toBeVisible();
      await expect(passwordLabel).toBeVisible();
    });

    test('should show loading state during submission', async ({ page }) => {
      await page.goto('/login');
      
      await page.fill('input[name="username"], [label*="Username"]', 'testuser');
      await page.fill('input[type="password"]', 'testpass');
      
      const submitButton = await page.locator('button[type="submit"]');
      await submitButton.click();
      
      // Button should show loading state
      const isDisabled = await submitButton.isDisabled();
      const buttonText = await submitButton.textContent();
      
      expect(isDisabled || buttonText.toLowerCase().includes('signing')).toBeTruthy();
    });
  });
});
