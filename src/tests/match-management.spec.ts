import { test, expect, type Page } from '@playwright/test';

test.describe('Match Management', () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto('http://localhost:5175', { timeout: 60000 });
        await page.waitForLoadState('networkidle');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForSelector('text=Team Registration', { state: 'visible', timeout: 60000 });

        // Setup: Add teams and start tournament
        await page.getByRole('button', { name: 'Add Team' }).click();
        await page.getByLabel('Team Name').fill('Team A');
        await page.getByLabel('Team Logo URL').fill('https://example.com/logo-a.png');
        await page.getByRole('button', { name: 'Add' }).click();
        
        await page.getByRole('button', { name: 'Add Team' }).click();
        await page.getByLabel('Team Name').fill('Team B');
        await page.getByLabel('Team Logo URL').fill('https://example.com/logo-b.png');
        await page.getByRole('button', { name: 'Add' }).click();

        await page.getByRole('button', { name: 'Start Tournament' }).click();
        await page.getByLabel('Matches per team pair').fill('1');
        await page.getByRole('button', { name: 'Start Tournament' }).click();
    });

    test('should validate match date and time', async ({ page }) => {
        await page.getByRole('button', { name: 'Add Score' }).first().click();
        
        // Try invalid date (past date)
        await page.getByLabel('Date').fill('2020-01-01');
        await page.getByLabel('Time').fill('14:00');
        await expect(page.getByText('Date must not be in the past')).toBeVisible();
        
        // Try invalid time format
        await page.getByLabel('Date').fill('2024-03-20');
        await page.getByLabel('Time').fill('25:00');
        await expect(page.getByText('Invalid time format')).toBeVisible();
    });

    test('should validate overs input', async ({ page }) => {
        await page.getByRole('button', { name: 'Add Score' }).first().click();
        
        // Fill required fields
        await page.getByLabel('Date').fill('2024-03-20');
        await page.getByLabel('Time').fill('14:00');
        await page.getByLabel('Venue').fill('Test Stadium');
        await page.getByLabel('Toss Winner').click();
        await page.getByRole('option', { name: 'Team A' }).click();
        await page.getByLabel('Toss Decision').click();
        await page.getByRole('option', { name: 'Bat' }).click();
        await page.getByRole('button', { name: 'Next' }).click();

        // Try invalid overs
        await page.getByLabel('Overs').fill('20.7');
        await expect(page.getByText('Invalid overs format')).toBeVisible();

        await page.getByLabel('Overs').fill('-1');
        await expect(page.getByText('Overs must be positive')).toBeVisible();

        await page.getByLabel('Overs').fill('21');
        await expect(page.getByText('Maximum 20 overs allowed')).toBeVisible();
    });

    test('should validate wickets input', async ({ page }) => {
        await page.getByRole('button', { name: 'Add Score' }).first().click();
        
        // Fill required fields
        await page.getByLabel('Date').fill('2024-03-20');
        await page.getByLabel('Time').fill('14:00');
        await page.getByLabel('Venue').fill('Test Stadium');
        await page.getByLabel('Toss Winner').click();
        await page.getByRole('option', { name: 'Team A' }).click();
        await page.getByLabel('Toss Decision').click();
        await page.getByRole('option', { name: 'Bat' }).click();
        await page.getByRole('button', { name: 'Next' }).click();

        // Try invalid wickets
        await page.getByLabel('Wickets').fill('11');
        await expect(page.getByText('Maximum 10 wickets allowed')).toBeVisible();

        await page.getByLabel('Wickets').fill('-1');
        await expect(page.getByText('Wickets must be positive')).toBeVisible();
    });

    test('should handle match result calculation correctly', async ({ page }) => {
        await page.getByRole('button', { name: 'Add Score' }).first().click();
        
        // Fill match details
        await page.getByLabel('Date').fill('2024-03-20');
        await page.getByLabel('Time').fill('14:00');
        await page.getByLabel('Venue').fill('Test Stadium');
        await page.getByLabel('Toss Winner').click();
        await page.getByRole('option', { name: 'Team A' }).click();
        await page.getByLabel('Toss Decision').click();
        await page.getByRole('option', { name: 'Bat' }).click();
        await page.getByRole('button', { name: 'Next' }).click();

        // Team A scores 150/8 in 20 overs
        await page.getByLabel('Runs').fill('150');
        await page.getByLabel('Wickets').fill('8');
        await page.getByLabel('Overs').fill('20');
        await page.getByRole('button', { name: 'Next' }).click();

        // Team B scores 140/7 in 20 overs
        await page.getByLabel('Runs').fill('140');
        await page.getByLabel('Wickets').fill('7');
        await page.getByLabel('Overs').fill('20');
        await page.getByRole('button', { name: 'Submit' }).click();

        // Verify result
        await expect(page.getByText('Team A won by 10 runs')).toBeVisible();
    });

    test('should handle super duper over correctly', async ({ page }) => {
        await page.getByRole('button', { name: 'Add Score' }).first().click();
        
        // Create a tie
        await page.getByLabel('Date').fill('2024-03-20');
        await page.getByLabel('Time').fill('14:00');
        await page.getByLabel('Venue').fill('Test Stadium');
        await page.getByLabel('Toss Winner').click();
        await page.getByRole('option', { name: 'Team A' }).click();
        await page.getByLabel('Toss Decision').click();
        await page.getByRole('option', { name: 'Bat' }).click();
        await page.getByRole('button', { name: 'Next' }).click();

        await page.getByLabel('Runs').fill('150');
        await page.getByLabel('Wickets').fill('8');
        await page.getByLabel('Overs').fill('20');
        await page.getByRole('button', { name: 'Next' }).click();

        await page.getByLabel('Runs').fill('150');
        await page.getByLabel('Wickets').fill('7');
        await page.getByLabel('Overs').fill('20');
        await page.getByRole('button', { name: 'Submit' }).click();

        // Verify tie and super duper over option
        await expect(page.getByText('Match Tied')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Start Super Duper Over' })).toBeVisible();

        // Start super duper over
        await page.getByRole('button', { name: 'Start Super Duper Over' }).click();
        await expect(page.getByText('Super Duper Over')).toBeVisible();

        // Add super duper over scores
        await page.getByRole('button', { name: 'Add Score' }).first().click();
        await page.getByLabel('Date').fill('2024-03-20');
        await page.getByLabel('Time').fill('14:30');
        await page.getByLabel('Venue').fill('Test Stadium');
        await page.getByLabel('Toss Winner').click();
        await page.getByRole('option', { name: 'Team B' }).click();
        await page.getByLabel('Toss Decision').click();
        await page.getByRole('option', { name: 'Bat' }).click();
        await page.getByRole('button', { name: 'Next' }).click();

        await page.getByLabel('Runs').fill('15');
        await page.getByLabel('Wickets').fill('1');
        await page.getByLabel('Overs').fill('1');
        await page.getByRole('button', { name: 'Next' }).click();

        await page.getByLabel('Runs').fill('16');
        await page.getByLabel('Wickets').fill('0');
        await page.getByLabel('Overs').fill('0.5');
        await page.getByRole('button', { name: 'Submit' }).click();

        // Verify super duper over result
        await expect(page.getByText('Team A won by 10 wickets')).toBeVisible();
    });

    test('should validate super duper over overs limit', async ({ page }) => {
        // Create a tie first
        await page.getByRole('button', { name: 'Add Score' }).first().click();
        await page.getByLabel('Date').fill('2024-03-20');
        await page.getByLabel('Time').fill('14:00');
        await page.getByLabel('Venue').fill('Test Stadium');
        await page.getByLabel('Toss Winner').click();
        await page.getByRole('option', { name: 'Team A' }).click();
        await page.getByLabel('Toss Decision').click();
        await page.getByRole('option', { name: 'Bat' }).click();
        await page.getByRole('button', { name: 'Next' }).click();

        await page.getByLabel('Runs').fill('150');
        await page.getByLabel('Wickets').fill('8');
        await page.getByLabel('Overs').fill('20');
        await page.getByRole('button', { name: 'Next' }).click();

        await page.getByLabel('Runs').fill('150');
        await page.getByLabel('Wickets').fill('7');
        await page.getByLabel('Overs').fill('20');
        await page.getByRole('button', { name: 'Submit' }).click();

        // Start super duper over
        await page.getByRole('button', { name: 'Start Super Duper Over' }).click();
        await page.getByRole('button', { name: 'Add Score' }).first().click();

        // Fill details
        await page.getByLabel('Date').fill('2024-03-20');
        await page.getByLabel('Time').fill('14:30');
        await page.getByLabel('Venue').fill('Test Stadium');
        await page.getByLabel('Toss Winner').click();
        await page.getByRole('option', { name: 'Team B' }).click();
        await page.getByLabel('Toss Decision').click();
        await page.getByRole('option', { name: 'Bat' }).click();
        await page.getByRole('button', { name: 'Next' }).click();

        // Try to exceed 2 overs limit
        await page.getByLabel('Overs').fill('2.1');
        await expect(page.getByText('Maximum 2 overs allowed in Super Duper Over')).toBeVisible();
    });
}); 