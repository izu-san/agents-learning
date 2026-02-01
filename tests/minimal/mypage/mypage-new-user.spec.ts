import { test, expect } from '@playwright/test';
import {
  urls,
  uniqueEmail,
  fillSignupRequired,
  submitSignup,
  login,
  expectOnMyPage,
  expectLoggedOutNav,
  logoutIfLoggedIn,
} from '../../helpers/app';

const avatarPath = 'tests/fixtures/avatar.svg';

test.describe('マイページ', () => {
  test('新規会員のアイコン設定と退会', async ({ page }, testInfo) => {
    const email = uniqueEmail(testInfo, 'mypage');
    const password = 'password1';

    await page.goto(urls.signup);
    await fillSignupRequired(page, {
      email,
      password,
      confirmPassword: password,
      name: '新規会員',
      membership: '一般会員',
    });
    await submitSignup(page);
    await logoutIfLoggedIn(page);
    await login(page, email, password);
    await expectOnMyPage(page);

    await expect(page.getByRole('button', { name: 'アイコン設定' })).toBeEnabled();
    await expect(page.getByRole('button', { name: '退会する' })).toBeEnabled();

    await page.getByRole('button', { name: 'アイコン設定' }).click();
    await expect(page).toHaveURL(/.*\/icon\.html/);
    await expect(page.getByRole('heading', { name: 'アイコン設定' })).toBeVisible();

    const fileInput = page.locator('input[type="file"]');
    if ((await fileInput.count()) > 0) {
      await fileInput.setInputFiles(avatarPath);
    } else {
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.getByRole('button', { name: 'アイコン画像' }).click(),
      ]);
      await fileChooser.setFiles(avatarPath);
    }

    await page.getByRole('button', { name: '確定' }).click();
    await page.getByRole('link', { name: 'マイページ' }).click();
    await expectOnMyPage(page);

    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: '退会する' }).click();
    await expectLoggedOutNav(page);
  });
});
