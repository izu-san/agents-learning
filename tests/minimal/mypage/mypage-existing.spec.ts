import { test, expect } from '@playwright/test';
import { login, users, expectOnMyPage } from '../../helpers/app';

test.describe('マイページ', () => {
  test('マイページの表示内容（既存会員）', async ({ page }) => {
    await login(page, users.premium.email, users.premium.password);
    await expectOnMyPage(page);

    await expect(page.getByText(users.premium.email)).toBeVisible();
    await expect(page.getByText(users.premium.name)).toBeVisible();
    await expect(page.getByText(users.premium.rank)).toBeVisible();
    await expect(page.getByRole('button', { name: 'アイコン設定' })).toBeDisabled();
    await expect(page.getByRole('button', { name: '退会する' })).toBeDisabled();
  });
});
