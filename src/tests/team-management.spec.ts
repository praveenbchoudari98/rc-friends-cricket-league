import { test, expect, type Page } from '@playwright/test';

test.describe('Team Management', () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto('http://localhost:5175', { timeout: 60000 });
        await page.waitForLoadState('networkidle');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForSelector('text=Team Registration', { state: 'visible', timeout: 60000 });
    });

    test('should add a team successfully with valid data', async ({ page }) => {
        const teamName = 'Test Team';
        const logoUrl = 'https://example.com/logo.png';

        await page.getByRole('button', { name: 'Add Team' }).click();
        await page.getByLabel('Team Name').fill(teamName);
        await page.getByLabel('Team Logo URL').fill(logoUrl);
        await page.getByRole('button', { name: 'Add' }).click();

        // Verify team is added
        await expect(page.getByText(teamName)).toBeVisible();
    });

    test('should prevent adding team with duplicate name', async ({ page }) => {
        const teamName = 'Duplicate Team';
        const logoUrl = 'https://example.com/logo.png';

        // Add first team
        await page.getByRole('button', { name: 'Add Team' }).click();
        await page.getByLabel('Team Name').fill(teamName);
        await page.getByLabel('Team Logo URL').fill(logoUrl);
        await page.getByRole('button', { name: 'Add' }).click();

        // Try to add team with same name
        await page.getByRole('button', { name: 'Add Team' }).click();
        await page.getByLabel('Team Name').fill(teamName);
        await page.getByLabel('Team Logo URL').fill(logoUrl);
        
        // Verify error message
        await expect(page.getByText('Team name already exists')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Add' })).toBeDisabled();
    });

    test('should prevent adding team with invalid name length', async ({ page }) => {
        // Try with short name
        await page.getByRole('button', { name: 'Add Team' }).click();
        await page.getByLabel('Team Name').fill('AB');
        await expect(page.getByText('Name must be at least 3 characters')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Add' })).toBeDisabled();
    });

    test('should remove team successfully', async ({ page }) => {
        // Add a team first
        await page.getByRole('button', { name: 'Add Team' }).click();
        await page.getByLabel('Team Name').fill('Team to Remove');
        await page.getByLabel('Team Logo URL').fill('https://example.com/logo.png');
        await page.getByRole('button', { name: 'Add' }).click();

        // Remove the team
        await page.getByRole('button', { name: 'Delete' }).click();
        
        // Verify team is removed
        await expect(page.getByText('Team to Remove')).not.toBeVisible();
    });

    test('should handle invalid image URL gracefully', async ({ page }) => {
        await page.getByRole('button', { name: 'Add Team' }).click();
        await page.getByLabel('Team Name').fill('Valid Team');
        await page.getByLabel('Team Logo URL').fill('invalid-url');
        
        // Should show default cricket player silhouette
        const logoImg = page.locator('img[alt="Valid Team"]');
        await expect(logoImg).toHaveAttribute('src', /data:image\/svg\+xml/);
    });

    test('should disable team management when tournament is in progress', async ({ page }) => {
        // Add minimum required teams
        await page.getByRole('button', { name: 'Add Team' }).click();
        await page.getByLabel('Team Name').fill('Team A');
        await page.getByLabel('Team Logo URL').fill('https://example.com/logo-a.png');
        await page.getByRole('button', { name: 'Add' }).click();
        
        await page.getByRole('button', { name: 'Add Team' }).click();
        await page.getByLabel('Team Name').fill('Team B');
        await page.getByLabel('Team Logo URL').fill('https://example.com/logo-b.png');
        await page.getByRole('button', { name: 'Add' }).click();

        // Start tournament
        await page.getByRole('button', { name: 'Start Tournament' }).click();
        await page.getByLabel('Matches per team pair').fill('1');
        await page.getByRole('button', { name: 'Start Tournament' }).click();

        // Verify team management is disabled
        await expect(page.getByText('Tournament in Progress')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Add Team' })).not.toBeVisible();
    });
}); 