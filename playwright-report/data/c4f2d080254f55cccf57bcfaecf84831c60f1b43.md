# Test info

- Name: Points Table >> should sort points table correctly
- Location: /Users/wireless/cricket-tournament-manager/src/tests/points-table.spec.ts:117:5

# Error details

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Add Team' })

    at /Users/wireless/cricket-tournament-manager/src/tests/points-table.spec.ts:11:62
```

# Page snapshot

```yaml
- banner:
  - img "RFCL25 Logo"
  - heading "RC Friends Cricket League" [level=6]
  - button "TEAMS"
  - button "SCHEDULE"
  - button "POINTS TABLE"
  - button "KNOCKOUT"
  - button "ABOUT"
- heading "Team Registration" [level=5]
- img
- button "upload picture"
- text: Team Name
- textbox "Team Name"
- paragraph
```

# Test source

```ts
   1 | import { test, expect, type Page } from '@playwright/test';
   2 |
   3 | test.describe('Points Table', () => {
   4 |     test.beforeEach(async ({ page }: { page: Page }) => {
   5 |         await page.goto('http://localhost:5175', { timeout: 60000 });
   6 |         await page.waitForLoadState('networkidle');
   7 |         await page.waitForLoadState('domcontentloaded');
   8 |         await page.waitForSelector('text=Team Registration', { state: 'visible', timeout: 60000 });
   9 |
   10 |         // Setup: Add teams and start tournament
>  11 |         await page.getByRole('button', { name: 'Add Team' }).click();
      |                                                              ^ Error: locator.click: Test timeout of 30000ms exceeded.
   12 |         await page.getByLabel('Team Name').fill('Team A');
   13 |         await page.getByLabel('Team Logo URL').fill('https://example.com/logo-a.png');
   14 |         await page.getByRole('button', { name: 'Add' }).click();
   15 |         
   16 |         await page.getByRole('button', { name: 'Add Team' }).click();
   17 |         await page.getByLabel('Team Name').fill('Team B');
   18 |         await page.getByLabel('Team Logo URL').fill('https://example.com/logo-b.png');
   19 |         await page.getByRole('button', { name: 'Add' }).click();
   20 |
   21 |         await page.getByRole('button', { name: 'Add Team' }).click();
   22 |         await page.getByLabel('Team Name').fill('Team C');
   23 |         await page.getByLabel('Team Logo URL').fill('https://example.com/logo-c.png');
   24 |         await page.getByRole('button', { name: 'Add' }).click();
   25 |
   26 |         await page.getByRole('button', { name: 'Start Tournament' }).click();
   27 |         await page.getByLabel('Matches per team pair').fill('1');
   28 |         await page.getByRole('button', { name: 'Start Tournament' }).click();
   29 |     });
   30 |
   31 |     test('should initialize points table correctly', async ({ page }) => {
   32 |         await page.getByRole('tab', { name: 'POINTS TABLE' }).click();
   33 |         
   34 |         // Check initial state for all teams
   35 |         for (const team of ['Team A', 'Team B', 'Team C']) {
   36 |             const row = page.getByRole('row', { name: new RegExp(team) });
   37 |             await expect(row.getByRole('cell').nth(1)).toHaveText('0'); // Matches
   38 |             await expect(row.getByRole('cell').nth(2)).toHaveText('0'); // Won
   39 |             await expect(row.getByRole('cell').nth(3)).toHaveText('0'); // Points
   40 |             await expect(row.getByRole('cell').nth(4)).toHaveText('0'); // NRR
   41 |         }
   42 |     });
   43 |
   44 |     test('should update points after match completion', async ({ page }) => {
   45 |         // Complete a match
   46 |         await page.getByRole('button', { name: 'Add Score' }).first().click();
   47 |         await page.getByLabel('Date').fill('2024-03-20');
   48 |         await page.getByLabel('Time').fill('14:00');
   49 |         await page.getByLabel('Venue').fill('Test Stadium');
   50 |         await page.getByLabel('Toss Winner').click();
   51 |         await page.getByRole('option', { name: 'Team A' }).click();
   52 |         await page.getByLabel('Toss Decision').click();
   53 |         await page.getByRole('option', { name: 'Bat' }).click();
   54 |         await page.getByRole('button', { name: 'Next' }).click();
   55 |
   56 |         await page.getByLabel('Runs').fill('150');
   57 |         await page.getByLabel('Wickets').fill('8');
   58 |         await page.getByLabel('Overs').fill('20');
   59 |         await page.getByRole('button', { name: 'Next' }).click();
   60 |
   61 |         await page.getByLabel('Runs').fill('140');
   62 |         await page.getByLabel('Wickets').fill('7');
   63 |         await page.getByLabel('Overs').fill('20');
   64 |         await page.getByRole('button', { name: 'Submit' }).click();
   65 |
   66 |         // Check points table
   67 |         await page.getByRole('tab', { name: 'POINTS TABLE' }).click();
   68 |         
   69 |         // Winner (Team A) should have 2 points
   70 |         const teamARow = page.getByRole('row', { name: /Team A/ });
   71 |         await expect(teamARow.getByRole('cell').nth(1)).toHaveText('1'); // Matches
   72 |         await expect(teamARow.getByRole('cell').nth(2)).toHaveText('1'); // Won
   73 |         await expect(teamARow.getByRole('cell').nth(3)).toHaveText('2'); // Points
   74 |         await expect(teamARow.getByRole('cell').nth(4)).toHaveText('0.50'); // NRR
   75 |
   76 |         // Loser (Team B) should have 0 points
   77 |         const teamBRow = page.getByRole('row', { name: /Team B/ });
   78 |         await expect(teamBRow.getByRole('cell').nth(1)).toHaveText('1'); // Matches
   79 |         await expect(teamBRow.getByRole('cell').nth(2)).toHaveText('0'); // Won
   80 |         await expect(teamBRow.getByRole('cell').nth(3)).toHaveText('0'); // Points
   81 |         await expect(teamBRow.getByRole('cell').nth(4)).toHaveText('-0.50'); // NRR
   82 |     });
   83 |
   84 |     test('should handle tie correctly in points table', async ({ page }) => {
   85 |         // Create a tie
   86 |         await page.getByRole('button', { name: 'Add Score' }).first().click();
   87 |         await page.getByLabel('Date').fill('2024-03-20');
   88 |         await page.getByLabel('Time').fill('14:00');
   89 |         await page.getByLabel('Venue').fill('Test Stadium');
   90 |         await page.getByLabel('Toss Winner').click();
   91 |         await page.getByRole('option', { name: 'Team A' }).click();
   92 |         await page.getByLabel('Toss Decision').click();
   93 |         await page.getByRole('option', { name: 'Bat' }).click();
   94 |         await page.getByRole('button', { name: 'Next' }).click();
   95 |
   96 |         await page.getByLabel('Runs').fill('150');
   97 |         await page.getByLabel('Wickets').fill('8');
   98 |         await page.getByLabel('Overs').fill('20');
   99 |         await page.getByRole('button', { name: 'Next' }).click();
  100 |
  101 |         await page.getByLabel('Runs').fill('150');
  102 |         await page.getByLabel('Wickets').fill('7');
  103 |         await page.getByLabel('Overs').fill('20');
  104 |         await page.getByRole('button', { name: 'Submit' }).click();
  105 |
  106 |         // Check points table
  107 |         await page.getByRole('tab', { name: 'POINTS TABLE' }).click();
  108 |         
  109 |         // Both teams should have 1 point
  110 |         const teamARow = page.getByRole('row', { name: /Team A/ });
  111 |         await expect(teamARow.getByRole('cell').nth(3)).toHaveText('1'); // Points
```