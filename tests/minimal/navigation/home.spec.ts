import { test, expect } from '@playwright/test';
import { gotoHome, expectOnPlansPage } from '../../helpers/app';

test.describe('ナビゲーション/ホーム', () => {
  test('ホームページ初期表示と主要リンクの導線', async ({ page }) => {
    await gotoHome(page);

    await expect(page.getByRole('heading', { name: 'Hotel Planisphere' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'ホーム' })).toBeVisible();
    await expect(page.getByRole('link', { name: '宿泊予約' })).toBeVisible();
    await expect(page.getByRole('link', { name: '会員登録' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible();
    await expect(page.getByRole('link', { name: /hotel-example-site/ })).toBeVisible();

    await page.getByRole('link', { name: '宿泊予約' }).click();
    await expectOnPlansPage(page);

    await page.goBack();
    await expect(page).toHaveURL(/.*\/ja\/?(index\.html)?/);

    await page.getByRole('link', { name: '会員登録' }).click();
    await expect(page).toHaveURL(/.*\/signup\.html/);

    await page.goBack();
    await expect(page).toHaveURL(/.*\/ja\/?(index\.html)?/);

    await page.getByRole('button', { name: 'ログイン' }).click();
    await expect(page).toHaveURL(/.*\/login\.html/);
  });
});
