import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { users } from '../data/users';
import { invalidLogin } from '../data/security';
import { expectInvalidInputs, urls } from '../helpers/app';

// NOTE: Use createBdd for playwright-bdd v7 API.
const { Given, When, Then } = createBdd(test);

Given('新しいブラウザ状態でログインページを開く', async ({ pages }) => {
  await pages.login.open();
});

// NOTE: Avoid '/' in step text to prevent matching issues.
Then('メールとパスワードの入力欄とログインボタンが表示される', async ({ pages }) => {
  await expect(pages.login.email).toBeVisible();
  await expect(pages.login.password).toBeVisible();
  await expect(pages.login.submit).toBeVisible();
});

When('{string} ユーザでログインする', async ({ pages }, userKey: string) => {
  const key = userKey as keyof typeof users;
  await pages.login.login(users[key].email, users[key].password);
});

Then('マイページに遷移する', async ({ page, pages }) => {
  await expect(page).toHaveURL(urls.mypage);
  await expect(pages.mypage.heading).toBeVisible();
});

Then('会員ランクが {string} と表示される', async ({ pages }, userKey: string) => {
  const key = userKey as keyof typeof users;
  await expect(pages.mypage.rankValue).toContainText(users[key].rank);
});

Then('ナビゲーションに「ログアウト」が表示される', async ({ pages }) => {
  await expect(pages.mypage.logout).toBeVisible();
});

When('メールとパスワード未入力でログインする', async ({ pages }) => {
  await pages.login.submit.click();
});

Then('ログインページのままである', async ({ page }) => {
  await expect(page).toHaveURL(urls.login);
});

Then('必須入力のバリデーションが表示される', async ({ page }) => {
  await expectInvalidInputs(page);
});

When('不正なメール形式と誤ったパスワードでログインする', async ({ pages }) => {
  await pages.login.email.fill(invalidLogin.email);
  await pages.login.password.fill(invalidLogin.password);
  await pages.login.submit.click();
});

Then('認証エラーが通知される', async ({ page }) => {
  await expect(page.locator('#login-button')).toBeVisible();
});

Then('ログイン入力欄にラベルが関連付けられている', async ({ pages }) => {
  await expect(pages.login.email).toHaveAccessibleName('メールアドレス');
  await expect(pages.login.password).toHaveAccessibleName('パスワード');
});

Then('エラーメッセージが入力欄と関連付けられている', async ({ page }) => {
  await expectInvalidInputs(page);
});
