import { expect, test } from '@playwright/test';

test.describe('Command Center Web — Smoke Test', () => {
  test('loads development foundation landing page with shell and QA controls', async ({ page }) => {
    await page.goto('/');

    // Verify page title
    await expect(page).toHaveTitle(/XTREME Concierge — Admin Web Command Center/i);

    // Verify main header
    await expect(
      page.getByRole('heading', { name: 'Admin Web Command Center', level: 1 }),
    ).toBeVisible();

    // Verify QA Preview disclaimer banner
    await expect(page.getByText(/Command Center QA Preview Mode/i)).toBeVisible();

    // Verify Brand Logo in sidebar
    const logo = page.locator('img[alt="XTREME Concierge"]');
    await expect(logo).toBeVisible();

    // Verify Sidebar navigation items
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Customers' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Bookings' })).toBeVisible();

    // Verify KPI cards
    await expect(page.getByText('Role-Scoped Bookings')).toBeVisible();
    await expect(page.getByText('Assignments / Work')).toBeVisible();
    await expect(page.getByText('Concierge Requests')).toBeVisible();

    // Verify TopBar Search Input
    await expect(page.getByPlaceholder('Search / command')).toBeVisible();
  });
});
