# Test info

- Name: Team Management >> should add a team successfully with valid data
- Location: /Users/wireless/cricket-tournament-manager/src/tests/team-management.spec.ts:11:5

# Error details

```
Error: locator.click: Test ended.
Call log:
  - waiting for getByRole('button', { name: 'Add Team' })

    at /Users/wireless/cricket-tournament-manager/src/tests/team-management.spec.ts:15:62
```

# Test source

```ts
   1 | import { test, expect, type Page } from '@playwright/test';
   2 |
   3 | test.describe('Team Management', () => {
   4 |     test.beforeEach(async ({ page }: { page: Page }) => {
   5 |         await page.goto('http://localhost:5175', { timeout: 60000 });
   6 |         await page.waitForLoadState('networkidle');
   7 |         await page.waitForLoadState('domcontentloaded');
   8 |         await page.waitForSelector('text=Team Registration', { state: 'visible', timeout: 60000 });
   9 |     });
  10 |
  11 |     test('should add a team successfully with valid data', async ({ page }) => {
  12 |         const teamName = 'Test Team';
  13 |         const logoUrl = 'https://example.com/logo.png';
  14 |
> 15 |         await page.getByRole('button', { name: 'Add Team' }).click();
     |                                                              ^ Error: locator.click: Test ended.
  16 |         await page.getByLabel('Team Name').fill(teamName);
  17 |         await page.getByLabel('Team Logo URL').fill(logoUrl);
  18 |         await page.getByRole('button', { name: 'Add' }).click();
  19 |
  20 |         // Verify team is added
  21 |         await expect(page.getByText(teamName)).toBeVisible();
  22 |     });
  23 |
  24 |     test('should prevent adding team with duplicate name', async ({ page }) => {
  25 |         const teamName = 'Duplicate Team';
  26 |         const logoUrl = 'https://example.com/logo.png';
  27 |
  28 |         // Add first team
  29 |         await page.getByRole('button', { name: 'Add Team' }).click();
  30 |         await page.getByLabel('Team Name').fill(teamName);
  31 |         await page.getByLabel('Team Logo URL').fill(logoUrl);
  32 |         await page.getByRole('button', { name: 'Add' }).click();
  33 |
  34 |         // Try to add team with same name
  35 |         await page.getByRole('button', { name: 'Add Team' }).click();
  36 |         await page.getByLabel('Team Name').fill(teamName);
  37 |         await page.getByLabel('Team Logo URL').fill(logoUrl);
  38 |         
  39 |         // Verify error message
  40 |         await expect(page.getByText('Team name already exists')).toBeVisible();
  41 |         await expect(page.getByRole('button', { name: 'Add' })).toBeDisabled();
  42 |     });
  43 |
  44 |     test('should prevent adding team with invalid name length', async ({ page }) => {
  45 |         // Try with short name
  46 |         await page.getByRole('button', { name: 'Add Team' }).click();
  47 |         await page.getByLabel('Team Name').fill('AB');
  48 |         await expect(page.getByText('Name must be at least 3 characters')).toBeVisible();
  49 |         await expect(page.getByRole('button', { name: 'Add' })).toBeDisabled();
  50 |     });
  51 |
  52 |     test('should remove team successfully', async ({ page }) => {
  53 |         // Add a team first
  54 |         await page.getByRole('button', { name: 'Add Team' }).click();
  55 |         await page.getByLabel('Team Name').fill('Team to Remove');
  56 |         await page.getByLabel('Team Logo URL').fill('https://example.com/logo.png');
  57 |         await page.getByRole('button', { name: 'Add' }).click();
  58 |
  59 |         // Remove the team
  60 |         await page.getByRole('button', { name: 'Delete' }).click();
  61 |         
  62 |         // Verify team is removed
  63 |         await expect(page.getByText('Team to Remove')).not.toBeVisible();
  64 |     });
  65 |
  66 |     test('should handle invalid image URL gracefully', async ({ page }) => {
  67 |         await page.getByRole('button', { name: 'Add Team' }).click();
  68 |         await page.getByLabel('Team Name').fill('Valid Team');
  69 |         await page.getByLabel('Team Logo URL').fill('invalid-url');
  70 |         
  71 |         // Should show default cricket player silhouette
  72 |         const logoImg = page.locator('img[alt="Valid Team"]');
  73 |         await expect(logoImg).toHaveAttribute('src', /data:image\/svg\+xml/);
  74 |     });
  75 |
  76 |     test('should disable team management when tournament is in progress', async ({ page }) => {
  77 |         // Add minimum required teams
  78 |         await page.getByRole('button', { name: 'Add Team' }).click();
  79 |         await page.getByLabel('Team Name').fill('Team A');
  80 |         await page.getByLabel('Team Logo URL').fill('https://example.com/logo-a.png');
  81 |         await page.getByRole('button', { name: 'Add' }).click();
  82 |         
  83 |         await page.getByRole('button', { name: 'Add Team' }).click();
  84 |         await page.getByLabel('Team Name').fill('Team B');
  85 |         await page.getByLabel('Team Logo URL').fill('https://example.com/logo-b.png');
  86 |         await page.getByRole('button', { name: 'Add' }).click();
  87 |
  88 |         // Start tournament
  89 |         await page.getByRole('button', { name: 'Start Tournament' }).click();
  90 |         await page.getByLabel('Matches per team pair').fill('1');
  91 |         await page.getByRole('button', { name: 'Start Tournament' }).click();
  92 |
  93 |         // Verify team management is disabled
  94 |         await expect(page.getByText('Tournament in Progress')).toBeVisible();
  95 |         await expect(page.getByRole('button', { name: 'Add Team' })).not.toBeVisible();
  96 |     });
  97 | }); 
```