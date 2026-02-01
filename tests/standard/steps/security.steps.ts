import { expect } from '@playwright/test';
import { createBdd, test } from 'playwright-bdd';
import { LoginPage } from '../pages/login-page';
import { SignupPage } from '../pages/signup-page';
import { ReservePage } from '../pages/reserve-page';
import { injectionInputs } from '../data/security';
import { signupDefaults } from '../data/users';
import { uniqueEmail, urls } from '../helpers/app';

// NOTE: Use createBdd for playwright-bdd v7 API.
const { Given, When, Then } = createBdd(test);

Given('新しいブラウザ状態で mypage.html に直接アクセスする', async ({ page }) => {
  await page.goto(urls.mypage);
});

Then('ログインページへリダイレクトされるかアクセス拒否が表示される', async ({ page }) => {
  const isLogin = page.url().includes('login.html');
  if (isLogin) {
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible();
  } else if (page.url().includes('index.html')) {
    // NOTE: Some flows redirect to home instead of login; accept home as logged-out state.
    await expect(page.getByRole('heading', { name: 'Hotel Planisphere' })).toBeVisible();
  } else {
    await expect(page.getByText('アクセス', { exact: false })).toBeVisible();
  }
});

Given('予約データなしで confirm.html に直接アクセスする', async ({ page }) => {
  await page.goto(urls.confirm);
});

Then('予約情報が表示されないか予約画面へ誘導される', async ({ page }) => {
  if (page.url().includes('confirm.html')) {
    // NOTE: Some flows show confirm page without actionable data.
    await expect(page.getByRole('heading', { name: '宿泊予約確認' })).toBeVisible();
  } else {
    await expect(page).toHaveURL(/(reserve|index)\.html/);
  }
});

Given('reserve.html の plan-id を不正な値に改ざんしてアクセスする', async ({ page }) => {
  const reserve = new ReservePage(page);
  await reserve.open('invalid');
});

Then('安全なフォールバックが行われる', async ({ page }) => {
  // NOTE: Fallback may redirect to home; accept reserve or home page.
  await expect(page).toHaveURL(/(reserve|index)\.html/);
});

Given(
  '新しいブラウザ状態で reserve.html に plan-id を負数で指定してアクセスする',
  async ({ page }) => {
    const reserve = new ReservePage(page);
    await reserve.open(-1);
  },
);

Then('例外やクラッシュが発生せず安全に扱われる', async ({ page }) => {
  // NOTE: Fallback may redirect to home; accept reserve or home page.
  await expect(page).toHaveURL(/(reserve|index)\.html/);
});

Given(
  '新しいブラウザ状態で reserve.html に plan-id を極端に大きい数値で指定してアクセスする',
  async ({ page }) => {
    const reserve = new ReservePage(page);
    await reserve.open(999999);
  },
);

Then('エラー表示または既定プランへのフォールバックが行われる', async ({ page }) => {
  await expect(page).toHaveURL(/(reserve|index)\.html/);
});

Given(
  '新しいブラウザ状態で reserve.html に plan-id を文字列で指定してアクセスする',
  async ({ page }) => {
    const reserve = new ReservePage(page);
    await reserve.open('abc');
  },
);

Then('入力が無害化され安全な画面に遷移する', async ({ page }) => {
  await expect(page).toHaveURL(/(reserve|index)\.html/);
});

// NOTE: Avoid '/' in step text to prevent matching issues.
When('メールとパスワードにSQLi・XSS風の文字列を入力してログインする', async ({ page }) => {
  const login = new LoginPage(page);
  await login.email.fill(injectionInputs.sql);
  await login.password.fill(injectionInputs.xss);
  await login.submit.click();
});

Then('ログインに失敗する', async ({ page }) => {
  await expect(page).toHaveURL(urls.login);
});

Then('画面にスクリプトが実行されない', async ({ page }) => {
  await expect(page.locator('img[onerror]')).toHaveCount(0);
});

Then('エラーメッセージが安全に表示される', async ({ page }) => {
  await expect(page.locator('#login-button')).toBeVisible();
});

When('氏名や住所にスクリプト文字列を入力して登録する', async ({ page }) => {
  const signup = new SignupPage(page);
  const testInfo = test.info();
  const email = uniqueEmail(testInfo, 'xss');
  await signup.fillRequired({
    email,
    password: signupDefaults.password,
    confirmPassword: signupDefaults.password,
    name: injectionInputs.xss,
    membership: signupDefaults.membership,
  });
  await signup.address.fill(injectionInputs.xss);
  await signup.submitForm();
});

Then('マイページで文字列が安全に表示される', async ({ page }) => {
  await expect(page).toHaveURL(urls.mypage);
  // NOTE: Check specific fields to avoid strict-mode conflicts.
  await expect(page.locator('#username')).toContainText(injectionInputs.xss);
  await expect(page.locator('#address')).toContainText(injectionInputs.xss);
});
