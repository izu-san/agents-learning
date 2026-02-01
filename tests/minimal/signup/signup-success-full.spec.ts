import { test, expect } from '@playwright/test';
import {
  urls,
  uniqueEmail,
  fillSignupRequired,
  submitSignup,
  login,
  expectOnMyPage,
  logoutIfLoggedIn,
} from '../../helpers/app';

test.describe('会員登録', () => {
  test('会員登録の正常系（任意項目含む）', async ({ page }, testInfo) => {
    const email = uniqueEmail(testInfo, 'full');
    const password = 'password1';

    await page.goto(urls.signup);
    await fillSignupRequired(page, {
      email,
      password,
      confirmPassword: password,
      name: '詳細花子',
      membership: 'プレミアム会員',
    });

    await page.getByRole('textbox', { name: '住所' }).fill('東京都新宿区');
    await page.getByRole('textbox', { name: '電話番号' }).fill('01133335555');
    await page.getByLabel('性別').selectOption('女性');
    await page.getByRole('textbox', { name: '生年月日' }).fill('1990-01-01');
    await page.getByRole('checkbox', { name: 'お知らせを受け取る' }).check();

    await submitSignup(page);
    await logoutIfLoggedIn(page);
    await login(page, email, password);
    await expectOnMyPage(page);
    await expect(page.getByText(email)).toBeVisible();
    await expect(page.getByText('東京都新宿区')).toBeVisible();
    await expect(page.getByText('01133335555')).toBeVisible();
    await expect(page.getByText('女性')).toBeVisible();
  });
});
