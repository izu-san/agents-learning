import { test, expect } from '@playwright/test';
import { login, users, expectOnMyPage, expectLoggedOutNav } from '../helpers/app';

test.describe('認証（ログイン/ログアウト）', () => {
  test('ログアウト', async ({ page }) => {
    await login(page, users.premium.email, users.premium.password);
    await expectOnMyPage(page);

    await page.getByRole('button', { name: 'ログアウト' }).click();
    await expectLoggedOutNav(page);
  });
});
