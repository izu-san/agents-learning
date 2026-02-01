import { test, expect } from '@playwright/test';
import { login, users, expectOnMyPage } from '../helpers/app';

test.describe('認証（ログイン/ログアウト）', () => {
  test('既存会員でログイン成功→マイページ表示', async ({ page }) => {
    await login(page, users.premium.email, users.premium.password);

    await expectOnMyPage(page);
    await expect(page.getByText(users.premium.email)).toBeVisible();
    await expect(page.getByText(users.premium.name)).toBeVisible();
    await expect(page.getByText(users.premium.rank)).toBeVisible();
    await expect(page.getByRole('link', { name: 'マイページ' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ログアウト' })).toBeVisible();
  });
});
