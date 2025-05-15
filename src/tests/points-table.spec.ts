import { test, expect, type Page } from '@playwright/test';

test.describe('Points Table', () => {
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

        await page.getByRole('button', { name: 'Add Team' }).click();
        await page.getByLabel('Team Name').fill('Team C');
        await page.getByLabel('Team Logo URL').fill('https://example.com/logo-c.png');
        await page.getByRole('button', { name: 'Add' }).click();

        await page.getByRole('button', { name: 'Start Tournament' }).click();
        await page.getByLabel('Matches per team pair').fill('1');
        await page.getByRole('button', { name: 'Start Tournament' }).click();
    });

    test('should initialize points table correctly', async ({ page }) => {
        await page.getByRole('tab', { name: 'POINTS TABLE' }).click();
        
        // Check initial state for all teams
        for (const team of ['Team A', 'Team B', 'Team C']) {
            const row = page.getByRole('row', { name: new RegExp(team) });
            await expect(row.getByRole('cell').nth(1)).toHaveText('0'); // Matches
            await expect(row.getByRole('cell').nth(2)).toHaveText('0'); // Won
            await expect(row.getByRole('cell').nth(3)).toHaveText('0'); // Points
            await expect(row.getByRole('cell').nth(4)).toHaveText('0'); // NRR
        }
    });

    test('should update points after match completion', async ({ page }) => {
        // Complete a match
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

        // Check points table
        await page.getByRole('tab', { name: 'POINTS TABLE' }).click();
        
        // Winner (Team A) should have 2 points
        const teamARow = page.getByRole('row', { name: /Team A/ });
        await expect(teamARow.getByRole('cell').nth(1)).toHaveText('1'); // Matches
        await expect(teamARow.getByRole('cell').nth(2)).toHaveText('1'); // Won
        await expect(teamARow.getByRole('cell').nth(3)).toHaveText('2'); // Points
        await expect(teamARow.getByRole('cell').nth(4)).toHaveText('0.50'); // NRR

        // Loser (Team B) should have 0 points
        const teamBRow = page.getByRole('row', { name: /Team B/ });
        await expect(teamBRow.getByRole('cell').nth(1)).toHaveText('1'); // Matches
        await expect(teamBRow.getByRole('cell').nth(2)).toHaveText('0'); // Won
        await expect(teamBRow.getByRole('cell').nth(3)).toHaveText('0'); // Points
        await expect(teamBRow.getByRole('cell').nth(4)).toHaveText('-0.50'); // NRR
    });

    test('should handle tie correctly in points table', async ({ page }) => {
        // Create a tie
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

        // Check points table
        await page.getByRole('tab', { name: 'POINTS TABLE' }).click();
        
        // Both teams should have 1 point
        const teamARow = page.getByRole('row', { name: /Team A/ });
        await expect(teamARow.getByRole('cell').nth(3)).toHaveText('1'); // Points

        const teamBRow = page.getByRole('row', { name: /Team B/ });
        await expect(teamBRow.getByRole('cell').nth(3)).toHaveText('1'); // Points
    });

    test('should sort points table correctly', async ({ page }) => {
        // Complete first match: Team A beats Team B
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

        // Complete second match: Team C beats Team B
        await page.getByRole('button', { name: 'Add Score' }).nth(1).click();
        await page.getByLabel('Date').fill('2024-03-21');
        await page.getByLabel('Time').fill('14:00');
        await page.getByLabel('Venue').fill('Test Stadium');
        await page.getByLabel('Toss Winner').click();
        await page.getByRole('option', { name: 'Team C' }).click();
        await page.getByLabel('Toss Decision').click();
        await page.getByRole('option', { name: 'Bat' }).click();
        await page.getByRole('button', { name: 'Next' }).click();
        await page.getByLabel('Runs').fill('160');
        await page.getByLabel('Wickets').fill('6');
        await page.getByLabel('Overs').fill('20');
        await page.getByRole('button', { name: 'Next' }).click();
        await page.getByLabel('Runs').fill('140');
        await page.getByLabel('Wickets').fill('8');
        await page.getByLabel('Overs').fill('20');
        await page.getByRole('button', { name: 'Submit' }).click();

        // Check points table order
        await page.getByRole('tab', { name: 'POINTS TABLE' }).click();
        
        const rows = await page.getByRole('row').all();
        const teamOrder = await Promise.all(rows.slice(1).map(row => row.textContent())); // Skip header row

        // Team C should be first (better NRR), then Team A, then Team B
        expect(teamOrder[0]).toContain('Team C');
        expect(teamOrder[1]).toContain('Team A');
        expect(teamOrder[2]).toContain('Team B');
    });

    test('should handle super duper over result in points table', async ({ page }) => {
        // Create a tie
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

        // Complete super duper over
        await page.getByRole('button', { name: 'Start Super Duper Over' }).click();
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

        // Check points table
        await page.getByRole('tab', { name: 'POINTS TABLE' }).click();
        
        // Winner (Team A) should have 2 points
        const teamARow = page.getByRole('row', { name: /Team A/ });
        await expect(teamARow.getByRole('cell').nth(3)).toHaveText('2'); // Points

        // Loser (Team B) should have 0 points
        const teamBRow = page.getByRole('row', { name: /Team B/ });
        await expect(teamBRow.getByRole('cell').nth(3)).toHaveText('0'); // Points
    });
}); 