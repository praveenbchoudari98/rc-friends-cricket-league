# Test info

- Name: Match Management >> should validate match date and time
- Location: /Users/wireless/cricket-tournament-manager/src/tests/match-management.spec.ts:26:5

# Error details

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Add Team' })

    at /Users/wireless/cricket-tournament-manager/src/tests/match-management.spec.ts:11:62
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
   3 | test.describe('Match Management', () => {
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
   21 |         await page.getByRole('button', { name: 'Start Tournament' }).click();
   22 |         await page.getByLabel('Matches per team pair').fill('1');
   23 |         await page.getByRole('button', { name: 'Start Tournament' }).click();
   24 |     });
   25 |
   26 |     test('should validate match date and time', async ({ page }) => {
   27 |         await page.getByRole('button', { name: 'Add Score' }).first().click();
   28 |         
   29 |         // Try invalid date (past date)
   30 |         await page.getByLabel('Date').fill('2020-01-01');
   31 |         await page.getByLabel('Time').fill('14:00');
   32 |         await expect(page.getByText('Date must not be in the past')).toBeVisible();
   33 |         
   34 |         // Try invalid time format
   35 |         await page.getByLabel('Date').fill('2024-03-20');
   36 |         await page.getByLabel('Time').fill('25:00');
   37 |         await expect(page.getByText('Invalid time format')).toBeVisible();
   38 |     });
   39 |
   40 |     test('should validate overs input', async ({ page }) => {
   41 |         await page.getByRole('button', { name: 'Add Score' }).first().click();
   42 |         
   43 |         // Fill required fields
   44 |         await page.getByLabel('Date').fill('2024-03-20');
   45 |         await page.getByLabel('Time').fill('14:00');
   46 |         await page.getByLabel('Venue').fill('Test Stadium');
   47 |         await page.getByLabel('Toss Winner').click();
   48 |         await page.getByRole('option', { name: 'Team A' }).click();
   49 |         await page.getByLabel('Toss Decision').click();
   50 |         await page.getByRole('option', { name: 'Bat' }).click();
   51 |         await page.getByRole('button', { name: 'Next' }).click();
   52 |
   53 |         // Try invalid overs
   54 |         await page.getByLabel('Overs').fill('20.7');
   55 |         await expect(page.getByText('Invalid overs format')).toBeVisible();
   56 |
   57 |         await page.getByLabel('Overs').fill('-1');
   58 |         await expect(page.getByText('Overs must be positive')).toBeVisible();
   59 |
   60 |         await page.getByLabel('Overs').fill('21');
   61 |         await expect(page.getByText('Maximum 20 overs allowed')).toBeVisible();
   62 |     });
   63 |
   64 |     test('should validate wickets input', async ({ page }) => {
   65 |         await page.getByRole('button', { name: 'Add Score' }).first().click();
   66 |         
   67 |         // Fill required fields
   68 |         await page.getByLabel('Date').fill('2024-03-20');
   69 |         await page.getByLabel('Time').fill('14:00');
   70 |         await page.getByLabel('Venue').fill('Test Stadium');
   71 |         await page.getByLabel('Toss Winner').click();
   72 |         await page.getByRole('option', { name: 'Team A' }).click();
   73 |         await page.getByLabel('Toss Decision').click();
   74 |         await page.getByRole('option', { name: 'Bat' }).click();
   75 |         await page.getByRole('button', { name: 'Next' }).click();
   76 |
   77 |         // Try invalid wickets
   78 |         await page.getByLabel('Wickets').fill('11');
   79 |         await expect(page.getByText('Maximum 10 wickets allowed')).toBeVisible();
   80 |
   81 |         await page.getByLabel('Wickets').fill('-1');
   82 |         await expect(page.getByText('Wickets must be positive')).toBeVisible();
   83 |     });
   84 |
   85 |     test('should handle match result calculation correctly', async ({ page }) => {
   86 |         await page.getByRole('button', { name: 'Add Score' }).first().click();
   87 |         
   88 |         // Fill match details
   89 |         await page.getByLabel('Date').fill('2024-03-20');
   90 |         await page.getByLabel('Time').fill('14:00');
   91 |         await page.getByLabel('Venue').fill('Test Stadium');
   92 |         await page.getByLabel('Toss Winner').click();
   93 |         await page.getByRole('option', { name: 'Team A' }).click();
   94 |         await page.getByLabel('Toss Decision').click();
   95 |         await page.getByRole('option', { name: 'Bat' }).click();
   96 |         await page.getByRole('button', { name: 'Next' }).click();
   97 |
   98 |         // Team A scores 150/8 in 20 overs
   99 |         await page.getByLabel('Runs').fill('150');
  100 |         await page.getByLabel('Wickets').fill('8');
  101 |         await page.getByLabel('Overs').fill('20');
  102 |         await page.getByRole('button', { name: 'Next' }).click();
  103 |
  104 |         // Team B scores 140/7 in 20 overs
  105 |         await page.getByLabel('Runs').fill('140');
  106 |         await page.getByLabel('Wickets').fill('7');
  107 |         await page.getByLabel('Overs').fill('20');
  108 |         await page.getByRole('button', { name: 'Submit' }).click();
  109 |
  110 |         // Verify result
  111 |         await expect(page.getByText('Team A won by 10 runs')).toBeVisible();
```