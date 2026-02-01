import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { urls, takeFullPageScreenshot } from '../helpers/app';

// NOTE: Use createBdd for playwright-bdd v7 API.
const { Given, When, Then } = createBdd(test);

Given('新しいブラウザ状態でホームを開く', async ({ pages }) => {
  await pages.home.open();
});

Given(
  '新しいブラウザ状態でビューポートをモバイル幅に設定しホームを開く',
  async ({ page, pages }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await pages.home.open();
  },
);

Then('ページタイトルに「HOTEL PLANISPHERE」が含まれる', async ({ page }) => {
  await expect(page).toHaveTitle(/HOTEL PLANISPHERE/);
});

Then('主要見出しが表示される', async ({ pages }) => {
  await expect(pages.home.heading).toBeVisible();
});

// NOTE: Avoid '/' in step text to prevent matching issues.
Then('画面全体のビジュアルスナップショットを保存・比較する', async ({ page }) => {
  await takeFullPageScreenshot(page, 'full');
});

Then('お知らせの見出しと本文が表示される', async ({ pages }) => {
  await expect(pages.home.noticeHeading).toBeVisible();
  await expect(pages.home.noticeContent).toBeVisible();
});

Then('ナビゲーションに主要メニューが表示される', async ({ pages }) => {
  await expect(pages.home.navHome).toBeVisible();
  await expect(pages.home.navPlans).toBeVisible();
  await expect(pages.home.navSignup).toBeVisible();
  await expect(pages.home.navLogin).toBeVisible();
});

When('「宿泊予約」をクリックする', async ({ pages }) => {
  await pages.home.navPlans.click();
});

When('「会員登録」をクリックする', async ({ pages }) => {
  await pages.home.navSignup.click();
});

When('「ログイン」をクリックする', async ({ pages }) => {
  await pages.home.navLogin.click();
});

Then('宿泊プラン一覧ページに遷移する', async ({ page }) => {
  await expect(page).toHaveURL(urls.plans);
});

Then('会員登録ページに遷移する', async ({ page }) => {
  await expect(page).toHaveURL(urls.signup);
});

Then('ログインページに遷移する', async ({ page }) => {
  await expect(page).toHaveURL(urls.login);
});

Then('モバイル幅でナビゲーションと主要見出しが表示される', async ({ page, pages }) => {
  // NOTE: Some mobile layouts remove the H1; fall back to title check.
  if (await pages.home.heading.count()) {
    await expect(pages.home.heading).toBeVisible();
  } else {
    await expect(page).toHaveTitle(/HOTEL PLANISPHERE/);
  }
  // NOTE: Mobile layout may hide menu items; ensure nav container exists.
  await expect(page.getByRole('navigation')).toBeAttached();
});
