import { test, expect } from '@playwright/test';
import {
  urls,
  uniqueEmail,
  fillSignupRequired,
  submitSignup,
  expectOnSignupPage,
  expectInvalidInputs,
} from '../../helpers/app';

test.describe('会員登録', () => {
  test('会員登録のバリデーション', async ({ page }, testInfo) => {
    await page.goto(urls.signup);
    await submitSignup(page);
    await expectOnSignupPage(page);
    await expectInvalidInputs(page);

    await page.goto(urls.signup);
    await fillSignupRequired(page, {
      email: uniqueEmail(testInfo, 'shortpass'),
      password: 'short7',
      confirmPassword: 'short7',
      name: '短いパス',
      membership: '一般会員',
    });
    await submitSignup(page);
    await expectOnSignupPage(page);

    await page.goto(urls.signup);
    await fillSignupRequired(page, {
      email: uniqueEmail(testInfo, 'mismatch'),
      password: 'password1',
      confirmPassword: 'password2',
      name: '不一致太郎',
      membership: '一般会員',
    });
    await submitSignup(page);
    await expectOnSignupPage(page);

    await page.goto(urls.signup);
    await fillSignupRequired(page, {
      email: uniqueEmail(testInfo, 'phone'),
      password: 'password1',
      confirmPassword: 'password1',
      name: '電話太郎',
      membership: '一般会員',
    });
    await page.getByRole('textbox', { name: '電話番号' }).fill('abc');
    await submitSignup(page);
    await expectOnSignupPage(page);

    await page.goto(urls.signup);
    await fillSignupRequired(page, {
      email: uniqueEmail(testInfo, 'birth'),
      password: 'password1',
      confirmPassword: 'password1',
      name: '日付太郎',
      membership: '一般会員',
    });
    await page.evaluate(() => {
      const input = document.querySelector<HTMLInputElement>('#birthday');
      if (input) {
        input.value = '1990-13-40';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await expect(page.locator('#birthday')).toHaveValue('');
  });
});
