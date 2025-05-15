import { test, expect, type Page } from '@playwright/test';

test.describe('Tournament Management', () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto('http://localhost:5175', { timeout: 60000 });
        await page.waitForLoadState('networkidle');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForSelector('text=Team Registration', { state: 'visible', timeout: 60000 });
    });

    test('should prevent tournament start with insufficient teams', async ({ page }) => {
        // Try to start with no teams
        await page.getByRole('button', { name: 'Start Tournament' }).click();
        await expect(page.getByText('Need at least 2 teams to start the tournament')).toBeVisible();

        // Add one team
        await page.getByRole('button', { name: 'Add Team' }).click();
        await page.getByLabel('Team Name').fill('Team A');
        await page.getByLabel('Team Logo URL').fill('https://example.com/logo-a.png');
        await page.getByRole('button', { name: 'Add' }).click();

        // Try to start with one team
        await page.getByRole('button', { name: 'Start Tournament' }).click();
        await expect(page.getByText('Need at least 2 teams to start the tournament')).toBeVisible();
    });

    test('should validate matches per team pair input', async ({ page }) => {
        // Add minimum teams
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

        // Try invalid values
        await page.getByLabel('Matches per team pair').fill('0');
        await expect(page.getByLabel('Matches per team pair')).toHaveValue('1');

        await page.getByLabel('Matches per team pair').fill('6');
        await expect(page.getByLabel('Matches per team pair')).toHaveValue('5');
    });

    test('should generate correct number of league matches', async ({ page }) => {
        // Add three teams
        await page.getByRole('button', { name: 'Add Team' }).click();
        await page.getByLabel('Team Name').fill('Team A');
        await page.getByLabel('Team Logo URL').fill('https://example.com/logo-a.png');
        await page.getByRole('button', { name: 'Add' }).click();
        
        await page.getByRole('button', { name: 'Add Team' }).click();
        await page.getByLabel('Team Name').fill('Team B');
        await page.getByLabel('Team Logo URL').fill('https://example.com/logo-b.png');
        await page.getByRole('button', { name: 'Add' }).click();

        await page.getByRole('button', { name: 'Add Team' }).click();
        await page.getByLabel('Team Name').fill('Team C');
        await page.getByLabel('Team Logo URL').fill('https://example.com/logo-c.png');
        await page.getByRole('button', { name: 'Add' }).click();

        // Start tournament with 2 matches per pair
        await page.getByRole('button', { name: 'Start Tournament' }).click();
        await page.getByLabel('Matches per team pair').fill('2');
        await page.getByRole('button', { name: 'Start Tournament' }).click();

        // For 3 teams with 2 matches each, total matches should be 6
        await page.getByRole('tab', { name: 'SCHEDULE' }).click();
        const matches = await page.locator('button:has-text("Add Score")').count();
        expect(matches).toBe(6);
    });

    test('should handle tournament completion correctly', async ({ page }) => {
        // Add two teams
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

        // Complete the match
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
        await page.getByLabel('Runs').fill('140');
        await page.getByLabel('Wickets').fill('7');
        await page.getByLabel('Overs').fill('20');
        await page.getByRole('button', { name: 'Submit' }).click();

        // Verify tournament completion
        await expect(page.getByText('Tournament Complete!')).toBeVisible();
        await expect(page.getByText('Congratulations to Team A!')).toBeVisible();
        await expect(page.getByRole('button', { name: 'New Teams' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Keep Same Teams' })).toBeVisible();
    });

    test('should handle tournament reset correctly', async ({ page }) => {
        // Add teams and complete a tournament first
        await page.getByRole('button', { name: 'Add Team' }).click();
        await page.getByLabel('Team Name').fill('Team A');
        await page.getByLabel('Team Logo URL').fill('https://example.com/logo-a.png');
        await page.getByRole('button', { name: 'Add' }).click();
        
        await page.getByRole('button', { name: 'Add Team' }).click();
        await page.getByLabel('Team Name').fill('Team B');
        await page.getByLabel('Team Logo URL').fill('https://example.com/logo-b.png');
        await page.getByRole('button', { name: 'Add' }).click();

        // Start and complete tournament
        await page.getByRole('button', { name: 'Start Tournament' }).click();
        await page.getByLabel('Matches per team pair').fill('1');
        await page.getByRole('button', { name: 'Start Tournament' }).click();

        // Complete the match
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
        await page.getByLabel('Runs').fill('140');
        await page.getByLabel('Wickets').fill('7');
        await page.getByLabel('Overs').fill('20');
        await page.getByRole('button', { name: 'Submit' }).click();

        // Test New Teams option
        await page.getByRole('button', { name: 'New Teams' }).click();
        await expect(page.getByText('Team Registration')).toBeVisible();
        await expect(page.locator('text=Team A')).not.toBeVisible();
        await expect(page.locator('text=Team B')).not.toBeVisible();

        // Test Keep Same Teams option (need to complete tournament again)
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
        await page.getByLabel('Runs').fill('140');
        await page.getByLabel('Wickets').fill('7');
        await page.getByLabel('Overs').fill('20');
        await page.getByRole('button', { name: 'Submit' }).click();

        await page.getByRole('button', { name: 'Keep Same Teams' }).click();
        await expect(page.getByText('Team Registration')).toBeVisible();
        await expect(page.locator('text=Team A')).toBeVisible();
        await expect(page.locator('text=Team B')).toBeVisible();
    });
}); 