import { test, expect } from '@playwright/test';
import { urls, expectOnLoginPage, expectInvalidInputs } from '../helpers/app';

test.describe('認証（ログイン/ログアウト）', () => {
  test('ログイン失敗（未入力/不正値）', async ({ page }) => {
    await page.goto(urls.login);

    await page.locator('#login-button').click();
    await expectOnLoginPage(page);
    await expectInvalidInputs(page);

    await page.getByRole('textbox', { name: 'メールアドレス' }).fill('no-user@example.com');
    await page.getByRole('textbox', { name: 'パスワード' }).fill('wrong-password');
    await page.locator('#login-button').click();

    await expectOnLoginPage(page);
    await expect(page.locator('#login-button')).toBeVisible();
  });
});
