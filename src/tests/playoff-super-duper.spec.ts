import { test, expect } from '@playwright/test';

test.describe('Playoff Super Duper Over', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        
        // Add teams
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
    });

    test('should handle multiple super duper overs in playoffs until winner is decided', async ({ page }) => {
        // Navigate to knockout stage
        await page.getByRole('tab', { name: 'Knockout Stage' }).click();

        // Add tied score for playoff match
        await page.getByRole('button', { name: 'Add Score' }).first().click();
        await page.getByLabel('Date').fill('2024-03-20');
        await page.getByLabel('Time').fill('14:00');
        await page.getByLabel('Venue').fill('Test Stadium');
        await page.getByLabel('Toss Winner').click();
        await page.getByRole('option', { name: 'Team A' }).click();
        await page.getByLabel('Toss Decision').click();
        await page.getByRole('option', { name: 'Bat' }).click();
        await page.getByRole('button', { name: 'Next' }).click();

        // First innings score
        await page.getByLabel('Runs').fill('180');
        await page.getByLabel('Wickets').fill('6');
        await page.getByLabel('Overs').fill('20');
        await page.getByRole('button', { name: 'Next' }).click();

        // Second innings score - same to force tie
        await page.getByLabel('Runs').fill('180');
        await page.getByLabel('Wickets').fill('8');
        await page.getByLabel('Overs').fill('20');
        await page.getByRole('button', { name: 'Submit' }).click();

        // Verify match is tied
        await expect(page.getByText('Match Tied')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Start Super Duper Over' })).toBeVisible();

        // Start first super duper over
        await page.getByRole('button', { name: 'Start Super Duper Over' }).click();
        await expect(page.getByText('Super Duper Over')).toBeVisible();

        // Add scores for first super duper over - another tie
        await page.getByRole('button', { name: 'Add Score' }).first().click();
        await page.getByLabel('Date').fill('2024-03-20');
        await page.getByLabel('Time').fill('14:30');
        await page.getByLabel('Venue').fill('Test Stadium');
        await page.getByLabel('Toss Winner').click();
        await page.getByRole('option', { name: 'Team B' }).click();
        await page.getByLabel('Toss Decision').click();
        await page.getByRole('option', { name: 'Bat' }).click();
        await page.getByRole('button', { name: 'Next' }).click();

        // First innings of super duper over
        await page.getByLabel('Runs').fill('20');
        await page.getByLabel('Wickets').fill('1');
        await page.getByLabel('Overs').fill('2');
        await page.getByRole('button', { name: 'Next' }).click();

        // Second innings of super duper over - tie again
        await page.getByLabel('Runs').fill('20');
        await page.getByLabel('Wickets').fill('1');
        await page.getByLabel('Overs').fill('2');
        await page.getByRole('button', { name: 'Submit' }).click();

        // Verify first super duper over is tied
        await expect(page.getByText('Match Tied')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Start Super Duper Over' })).toBeVisible();

        // Start second super duper over
        await page.getByRole('button', { name: 'Start Super Duper Over' }).click();
        await expect(page.getByText('Super Duper Over')).toBeVisible();

        // Add scores for second super duper over - decisive
        await page.getByRole('button', { name: 'Add Score' }).first().click();
        await page.getByLabel('Date').fill('2024-03-20');
        await page.getByLabel('Time').fill('15:00');
        await page.getByLabel('Venue').fill('Test Stadium');
        await page.getByLabel('Toss Winner').click();
        await page.getByRole('option', { name: 'Team A' }).click();
        await page.getByLabel('Toss Decision').click();
        await page.getByRole('option', { name: 'Bat' }).click();
        await page.getByRole('button', { name: 'Next' }).click();

        // First innings of second super duper over
        await page.getByLabel('Runs').fill('25');
        await page.getByLabel('Wickets').fill('0');
        await page.getByLabel('Overs').fill('2');
        await page.getByRole('button', { name: 'Next' }).click();

        // Second innings of second super duper over
        await page.getByLabel('Runs').fill('20');
        await page.getByLabel('Wickets').fill('2');
        await page.getByLabel('Overs').fill('1.4');
        await page.getByRole('button', { name: 'Submit' }).click();

        // Verify Team A wins the second super duper over
        await expect(page.getByText('Team A won')).toBeVisible();
    });

    test('should validate super duper over overs limit', async ({ page }) => {
        // Navigate to knockout stage
        await page.getByRole('tab', { name: 'Knockout Stage' }).click();

        // Create a tied match first
        await page.getByRole('button', { name: 'Add Score' }).first().click();
        await page.getByLabel('Date').fill('2024-03-20');
        await page.getByLabel('Time').fill('14:00');
        await page.getByLabel('Venue').fill('Test Stadium');
        await page.getByLabel('Toss Winner').click();
        await page.getByRole('option', { name: 'Team A' }).click();
        await page.getByLabel('Toss Decision').click();
        await page.getByRole('option', { name: 'Bat' }).click();
        await page.getByRole('button', { name: 'Next' }).click();

        // First innings score
        await page.getByLabel('Runs').fill('150');
        await page.getByLabel('Wickets').fill('8');
        await page.getByLabel('Overs').fill('20');
        await page.getByRole('button', { name: 'Next' }).click();

        // Second innings score - tie
        await page.getByLabel('Runs').fill('150');
        await page.getByLabel('Wickets').fill('7');
        await page.getByLabel('Overs').fill('20');
        await page.getByRole('button', { name: 'Submit' }).click();

        // Start super duper over
        await page.getByRole('button', { name: 'Start Super Duper Over' }).click();

        // Try to enter more than 2 overs
        await page.getByRole('button', { name: 'Add Score' }).first().click();
        await page.getByLabel('Date').fill('2024-03-20');
        await page.getByLabel('Time').fill('14:30');
        await page.getByLabel('Venue').fill('Test Stadium');
        await page.getByLabel('Toss Winner').click();
        await page.getByRole('option', { name: 'Team B' }).click();
        await page.getByLabel('Toss Decision').click();
        await page.getByRole('option', { name: 'Bat' }).click();
        await page.getByRole('button', { name: 'Next' }).click();

        // Try to enter 3 overs
        await page.getByLabel('Overs').fill('3');
        
        // Should be automatically limited to 2 overs
        await expect(page.getByLabel('Overs')).toHaveValue('2');
    });
}); 