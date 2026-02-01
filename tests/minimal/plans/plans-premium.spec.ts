import { test, expect } from '@playwright/test';
import { login, users, expectOnPlansPage } from '../../helpers/app';

test.describe('宿泊プラン一覧', () => {
  test('プレミアム会員のプラン一覧表示', async ({ page }) => {
    await login(page, users.premium.email, users.premium.password);
    await page.getByRole('link', { name: '宿泊予約' }).click();
    await expectOnPlansPage(page);

    await expect(page.getByText('会員限定').first()).toBeVisible();
    await expect(page.getByText('プレミアム会員限定').first()).toBeVisible();
  });
});
