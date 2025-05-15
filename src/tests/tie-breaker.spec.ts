import { test, expect, type Page } from '@playwright/test';
import { generateUUID } from '../utils/uuid';

test.describe('Tie-breaker functionality', () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto('http://localhost:5175', { timeout: 60000 });
        // Wait for the app to be fully loaded by checking for the Team Registration form
        await page.waitForLoadState('networkidle');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForSelector('text=Team Registration', { state: 'visible', timeout: 60000 });
    });

    test('should handle league match tie correctly', async ({ page }: { page: Page }) => {
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

        // Configure tournament
        await page.getByLabel('Matches per team pair').fill('1');
        await page.getByRole('button', { name: 'Start Tournament' }).click();

        // Find the first match and click "Add Score"
        await page.getByRole('button', { name: 'Add Score' }).first().click();

        // Fill match details
        await page.getByLabel('Date').fill('2024-03-20');
        await page.getByLabel('Time').fill('14:00');
        await page.getByLabel('Venue').fill('Test Stadium');

        // Set toss details
        await page.getByLabel('Toss Winner').click();
        await page.getByRole('option', { name: 'Team A' }).click();
        await page.getByLabel('Toss Decision').click();
        await page.getByRole('option', { name: 'Bat' }).click();

        // Click Next
        await page.getByRole('button', { name: 'Next' }).click();

        // Fill first innings score (Team A)
        await page.getByLabel('Runs').fill('150');
        await page.getByLabel('Wickets').fill('8');
        await page.getByLabel('Overs').fill('20');

        // Click Next
        await page.getByRole('button', { name: 'Next' }).click();

        // Fill second innings score (Team B) - same score to force a tie
        await page.getByLabel('Runs').fill('150');
        await page.getByLabel('Wickets').fill('7');
        await page.getByLabel('Overs').fill('20');

        // Submit scores
        await page.getByRole('button', { name: 'Submit' }).click();

        // Verify match status shows as tied
        await expect(page.getByText('Match Tied')).toBeVisible();

        // Verify "Start Super Duper Over" button is visible
        await expect(page.getByRole('button', { name: 'Start Super Duper Over' })).toBeVisible();

        // Check points table
        await page.getByRole('tab', { name: 'Teams' }).click();
        
        // Both teams should have 1 point each
        const teamAPoints = page.getByRole('row', { name: /Team A/ }).getByRole('cell').nth(3);
        const teamBPoints = page.getByRole('row', { name: /Team B/ }).getByRole('cell').nth(3);
        
        await expect(teamAPoints).toHaveText('1');
        await expect(teamBPoints).toHaveText('1');
    });

    test('should handle playoff match tie with super duper over', async ({ page }: { page: Page }) => {
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

        // Configure tournament
        await page.getByLabel('Matches per team pair').fill('1');
        await page.getByRole('button', { name: 'Start Tournament' }).click();

        // Complete league matches to reach playoffs
        // Add tied score for playoff match
        await page.getByRole('button', { name: 'Add Score' }).first().click();

        // Fill match details for playoff
        await page.getByLabel('Date').fill('2024-03-20');
        await page.getByLabel('Time').fill('14:00');
        await page.getByLabel('Venue').fill('Test Stadium');

        // Set toss details
        await page.getByLabel('Toss Winner').click();
        await page.getByRole('option', { name: 'Team A' }).click();
        await page.getByLabel('Toss Decision').click();
        await page.getByRole('option', { name: 'Bat' }).click();

        // Click Next
        await page.getByRole('button', { name: 'Next' }).click();

        // Fill first innings score
        await page.getByLabel('Runs').fill('180');
        await page.getByLabel('Wickets').fill('6');
        await page.getByLabel('Overs').fill('20');

        // Click Next
        await page.getByRole('button', { name: 'Next' }).click();

        // Fill second innings score - same score to force a tie
        await page.getByLabel('Runs').fill('180');
        await page.getByLabel('Wickets').fill('8');
        await page.getByLabel('Overs').fill('20');

        // Submit scores
        await page.getByRole('button', { name: 'Submit' }).click();

        // Verify match status shows as tied
        await expect(page.getByText('Match Tied')).toBeVisible();

        // Start super duper over
        await page.getByRole('button', { name: 'Start Super Duper Over' }).click();

        // Verify super duper over match is created
        await expect(page.getByText('Super Duper Over')).toBeVisible();

        // Add scores for super duper over
        await page.getByRole('button', { name: 'Add Score' }).first().click();

        // Fill super duper over details
        await page.getByLabel('Date').fill('2024-03-20');
        await page.getByLabel('Time').fill('14:30');
        await page.getByLabel('Venue').fill('Test Stadium');

        // Set toss details
        await page.getByLabel('Toss Winner').click();
        await page.getByRole('option', { name: 'Team B' }).click();
        await page.getByLabel('Toss Decision').click();
        await page.getByRole('option', { name: 'Bat' }).click();

        // Click Next
        await page.getByRole('button', { name: 'Next' }).click();

        // Fill first innings score
        await page.getByLabel('Runs').fill('15');
        await page.getByLabel('Wickets').fill('1');
        await page.getByLabel('Overs').fill('2');

        // Click Next
        await page.getByRole('button', { name: 'Next' }).click();

        // Fill second innings score
        await page.getByLabel('Runs').fill('16');
        await page.getByLabel('Wickets').fill('0');
        await page.getByLabel('Overs').fill('1.4');

        // Submit scores
        await page.getByRole('button', { name: 'Submit' }).click();

        // Verify Team A wins the super duper over
        await expect(page.getByText('won by 10 wickets')).toBeVisible();
    });
}); 