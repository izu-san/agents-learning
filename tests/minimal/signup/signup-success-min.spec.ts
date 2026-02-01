import { test, expect } from '@playwright/test';
import {
  urls,
  uniqueEmail,
  fillSignupRequired,
  submitSignup,
  expectOnMyPage,
  login,
  logoutIfLoggedIn,
} from '../../helpers/app';

test.describe('会員登録', () => {
  test('会員登録の正常系（必須項目のみ）', async ({ page }, testInfo) => {
    const email = uniqueEmail(testInfo, 'min');
    const password = 'password1';

    await page.goto(urls.signup);
    await fillSignupRequired(page, {
      email,
      password,
      confirmPassword: password,
      name: '最小太郎',
      membership: '一般会員',
    });
    await submitSignup(page);
    await logoutIfLoggedIn(page);
    await login(page, email, password);
    await expectOnMyPage(page);
    await expect(page.getByText(email)).toBeVisible();
  });
});
