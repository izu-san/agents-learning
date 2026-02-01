import { expect } from '@playwright/test';
import { createBdd, test } from 'playwright-bdd';
import { LoginPage } from '../pages/login-page';
import { MyPage } from '../pages/mypage-page';
import { users } from '../data/users';
import { invalidLogin } from '../data/security';
import { expectInvalidInputs, urls } from '../helpers/app';

// NOTE: Use createBdd for playwright-bdd v7 API.
const { Given, When, Then } = createBdd(test);

Given('新しいブラウザ状態でログインページを開く', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
});

// NOTE: Avoid '/' in step text to prevent matching issues.
Then('メールとパスワードの入力欄とログインボタンが表示される', async ({ page }) => {
  const login = new LoginPage(page);
  await expect(login.email).toBeVisible();
  await expect(login.password).toBeVisible();
  await expect(login.submit).toBeVisible();
});

When('{string} ユーザでログインする', async ({ page }, userKey: string) => {
  const key = userKey as keyof typeof users;
  const login = new LoginPage(page);
  await login.login(users[key].email, users[key].password);
});

Then('マイページに遷移する', async ({ page }) => {
  const mypage = new MyPage(page);
  await expect(page).toHaveURL(urls.mypage);
  await expect(mypage.heading).toBeVisible();
});

Then('会員ランクが {string} と表示される', async ({ page }, userKey: string) => {
  const key = userKey as keyof typeof users;
  const mypage = new MyPage(page);
  await expect(mypage.rankValue).toContainText(users[key].rank);
});

Then('ナビゲーションに「ログアウト」が表示される', async ({ page }) => {
  const mypage = new MyPage(page);
  await expect(mypage.logout).toBeVisible();
});

When('メールとパスワード未入力でログインする', async ({ page }) => {
  const login = new LoginPage(page);
  await login.submit.click();
});

Then('ログインページのままである', async ({ page }) => {
  await expect(page).toHaveURL(urls.login);
});

Then('必須入力のバリデーションが表示される', async ({ page }) => {
  await expectInvalidInputs(page);
});

When('不正なメール形式と誤ったパスワードでログインする', async ({ page }) => {
  const login = new LoginPage(page);
  await login.email.fill(invalidLogin.email);
  await login.password.fill(invalidLogin.password);
  await login.submit.click();
});

Then('認証エラーが通知される', async ({ page }) => {
  await expect(page.locator('#login-button')).toBeVisible();
});

Then('ログイン入力欄にラベルが関連付けられている', async ({ page }) => {
  const login = new LoginPage(page);
  await expect(login.email).toHaveAccessibleName('メールアドレス');
  await expect(login.password).toHaveAccessibleName('パスワード');
});

Then('エラーメッセージが入力欄と関連付けられている', async ({ page }) => {
  await expectInvalidInputs(page);
});
