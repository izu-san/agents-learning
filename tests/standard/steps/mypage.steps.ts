import { expect } from '@playwright/test';
import { createBdd, test } from 'playwright-bdd';
import { LoginPage } from '../pages/login-page';
import { MyPage } from '../pages/mypage-page';
import { SignupPage } from '../pages/signup-page';
import { users, signupDefaults } from '../data/users';
import { signupTestData } from '../data/signup';
import { logoutIfLoggedIn, uniqueEmail, urls } from '../helpers/app';
import { getScenarioState, setScenarioState } from '../helpers/state';

// NOTE: Use createBdd for playwright-bdd v7 API.
const { Given, When, Then } = createBdd(test);

const avatarPath = 'tests/standard/fixtures/avatar.svg';

Given('新しいブラウザ状態で既存ユーザでログインする', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login(users.premium.email, users.premium.password);
});

When('「ログアウト」を押す', async ({ page }) => {
  const mypage = new MyPage(page);
  await mypage.logout.click();
});

Then('ホームまたはログイン画面へ遷移する', async ({ page }) => {
  await expect(page).toHaveURL(/(index|login)\.html/);
});

Then('再度 mypage.html に直接アクセスすると未ログイン扱いになる', async ({ page }) => {
  await page.goto(urls.mypage);
  // NOTE: The site may redirect to home instead of login when logged out.
  await expect(page).toHaveURL(/(login|index)\.html/);
});

When('ログアウトを実行する', async ({ page }) => {
  await logoutIfLoggedIn(page);
});

// NOTE: Avoid '/' in step text to prevent matching issues.
Then('Cookie・SessionStorage・LocalStorage のログイン情報が削除される', async ({ page, context }) => {
  const cookies = await context.cookies();
  const cookieNames = cookies.map((cookie) => cookie.name);
  const localKeys = await page.evaluate(() => Object.keys(localStorage));
  const sessionKeys = await page.evaluate(() => Object.keys(sessionStorage));
  const hasLoginKey = [...cookieNames, ...localKeys, ...sessionKeys].some((key) =>
    key.toLowerCase().includes('login'),
  );
  expect(hasLoginKey).toBeFalsy();
});

Given('新しいブラウザ状態で会員登録しマイページへ遷移する', async ({ page }) => {
  const signup = new SignupPage(page);
  const testInfo = test.info();
  const email = uniqueEmail(testInfo, 'newuser');
  const password = signupDefaults.password;
  await signup.open();
  await signup.fillRequired({
    email,
    password,
    confirmPassword: password,
    name: signupTestData.names.newUser,
    membership: signupDefaults.membership,
  });
  await signup.submitForm();
  setScenarioState({ email, password, name: signupTestData.names.newUser });
});

Then('登録情報が表示される', async ({ page }) => {
  const mypage = new MyPage(page);
  const { email, name } = getScenarioState();
  if (email) {
    await expect(mypage.emailValue).toContainText(email);
  }
  if (name) {
    await expect(mypage.nameValue).toContainText(name);
  }
});

Then('アイコン設定や退会の操作が有効になる', async ({ page }) => {
  const mypage = new MyPage(page);
  await expect(mypage.iconButton).toBeEnabled();
  await expect(mypage.withdrawButton).toBeEnabled();
});

When('アイコン設定で画像を設定する', async ({ page }) => {
  const mypage = new MyPage(page);
  await mypage.iconButton.click();
  await expect(page).toHaveURL(/icon\.html/);
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
});

Then('マイページにアイコンが表示される', async ({ page }) => {
  await expect(page.locator('img')).toHaveCount(1);
});

When('退会操作を実行する', async ({ page }) => {
  page.once('dialog', (dialog) => dialog.accept());
  const mypage = new MyPage(page);
  await mypage.withdrawButton.click();
});

Then('ユーザ情報が削除されログインできなくなる', async ({ page }) => {
  const { email, password } = getScenarioState();
  const login = new LoginPage(page);
  await login.open();
  if (email && password) {
    await login.login(email, password);
  }
  await expect(page).toHaveURL(urls.login);
});
