import { test, expect } from '@playwright/test';

test('smoke - landing shows login page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/TaskMaster/);
});
