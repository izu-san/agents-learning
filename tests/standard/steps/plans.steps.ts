import { expect } from '@playwright/test';
import { createBdd, test } from 'playwright-bdd';
import { PlansPage } from '../pages/plans-page';
import { LoginPage } from '../pages/login-page';
import { users } from '../data/users';
import { urls } from '../helpers/app';

// NOTE: Use createBdd for playwright-bdd v7 API.
const { Given, When, Then } = createBdd(test);

Given('新しいブラウザ状態で宿泊プラン一覧を開く', async ({ page }) => {
  const plans = new PlansPage(page);
  await plans.open();
});

Then('プラン一覧とおすすめプランが表示される', async ({ page }) => {
  const plans = new PlansPage(page);
  await expect(plans.title).toBeVisible();
  await expect(plans.recommendedLabel).toBeVisible();
});

When('任意の「このプランで予約」をクリックする', async ({ page, context }) => {
  const plans = new PlansPage(page);
  const popupPromise = context.waitForEvent('page');
  await plans.clickFirstReserveLink();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(/reserve\.html\?plan-id=\d+/);
});

Then('宿泊予約画面が新しいタブで開く', async ({ page, context }) => {
  const pages = context.pages();
  const hasReserve = pages.some((p) => p.url().includes('reserve.html'));
  expect(hasReserve).toBeTruthy();
  await expect(page).toHaveURL(urls.plans);
});

Given('一般会員でログインし宿泊プラン一覧を開く', async ({ page }) => {
  // NOTE: Clear auth state to avoid login redirect issues.
  await page.context().clearCookies();
  await page.goto(urls.home);
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  const login = new LoginPage(page);
  await login.open();
  await login.login(users.standard.email, users.standard.password);
  await page.getByRole('link', { name: '宿泊予約' }).click();
});

Then('一般会員向けのプランが表示される', async ({ page }) => {
  await expect(page.getByText('会員限定').first()).toBeVisible();
  await expect(page.getByText('プレミアム会員限定')).toHaveCount(0);
});

Given('プレミアム会員でログインし宿泊プラン一覧を開く', async ({ page }) => {
  // NOTE: Clear auth state to avoid login redirect issues.
  await page.context().clearCookies();
  await page.goto(urls.home);
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  const login = new LoginPage(page);
  await login.open();
  await login.login(users.premium.email, users.premium.password);
  await page.getByRole('link', { name: '宿泊予約' }).click();
});

Then('プレミアム会員向けのプランが表示される', async ({ page }) => {
  await expect(page.getByText('会員限定').first()).toBeVisible();
  await expect(page.getByText('プレミアム会員限定').first()).toBeVisible();
});

Then('プランカードのレイアウトが崩れていない', async ({ page }) => {
  await expect(page.getByRole('heading', { name: '宿泊プラン一覧' })).toBeVisible();
});
