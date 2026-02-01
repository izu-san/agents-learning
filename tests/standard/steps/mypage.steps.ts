import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { signupDefaults } from '../data/users';
import { signupTestData } from '../data/signup';
import { uniqueEmail, urls } from '../helpers/app';
import { getScenarioState, setScenarioState } from '../helpers/state';

// NOTE: Use createBdd for playwright-bdd v7 API.
const { Given, When, Then } = createBdd(test);

Given('新しいブラウザ状態で既存ユーザでログインする', async ({ auth }) => {
  await auth.loginAs('premium');
});

When('「ログアウト」を押す', async ({ pages }) => {
  await pages.mypage.logout.click();
});

Then('ホームまたはログイン画面へ遷移する', async ({ page }) => {
  await expect(page).toHaveURL(/(index|login)\.html/);
});

Then('再度 mypage.html に直接アクセスすると未ログイン扱いになる', async ({ page }) => {
  await page.goto(urls.mypage);
  // NOTE: The site may redirect to home instead of login when logged out.
  await expect(page).toHaveURL(/(login|index)\.html/);
});

When('ログアウトを実行する', async ({ auth }) => {
  await auth.logoutIfLoggedIn();
});

// NOTE: Avoid '/' in step text to prevent matching issues.
Then(
  'Cookie・SessionStorage・LocalStorage のログイン情報が削除される',
  async ({ page, context }) => {
    const cookies = await context.cookies();
    const cookieNames = cookies.map((cookie) => cookie.name);
    const localKeys = await page.evaluate(() => Object.keys(localStorage));
    const sessionKeys = await page.evaluate(() => Object.keys(sessionStorage));
    const hasLoginKey = [...cookieNames, ...localKeys, ...sessionKeys].some((key) =>
      key.toLowerCase().includes('login'),
    );
    expect(hasLoginKey).toBeFalsy();
  },
);

Given('新しいブラウザ状態で会員登録しマイページへ遷移する', async ({ pages }) => {
  const testInfo = test.info();
  const email = uniqueEmail(testInfo, 'newuser');
  const password = signupDefaults.password;
  await pages.signup.open();
  await pages.signup.fillRequired({
    email,
    password,
    confirmPassword: password,
    name: signupTestData.names.newUser,
    membership: signupDefaults.membership,
  });
  await pages.signup.submitForm();
  setScenarioState({ email, password, name: signupTestData.names.newUser });
});

Then('登録情報が表示される', async ({ pages }) => {
  const { email, name } = getScenarioState();
  if (email) {
    await expect(pages.mypage.emailValue).toContainText(email);
  }
  if (name) {
    await expect(pages.mypage.nameValue).toContainText(name);
  }
});

Then('アイコン設定や退会の操作が有効になる', async ({ pages }) => {
  await expect(pages.mypage.iconButton).toBeEnabled();
  await expect(pages.mypage.withdrawButton).toBeEnabled();
});

When('アイコン設定で画像を設定する', async ({ page, pages, avatarPath }) => {
  await pages.mypage.iconButton.click();
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

When('退会操作を実行する', async ({ page, pages }) => {
  page.once('dialog', (dialog) => dialog.accept());
  await pages.mypage.withdrawButton.click();
});

Then('ユーザ情報が削除されログインできなくなる', async ({ pages }) => {
  const { email, password } = getScenarioState();
  await pages.login.open();
  if (email && password) {
    await pages.login.login(email, password);
  }
  await expect(pages.login.page).toHaveURL(urls.login);
});

Then('【追加】マイページに性別が表示される', async ({ pages }) => {
  await expect(pages.mypage.genderValue).toBeVisible();
  await expect(pages.mypage.genderValue).toHaveText(/.+/);
});

Then('【追加】年齢が未登録の場合「未登録」と表示される', async ({ pages }) => {
  await expect(pages.mypage.ageValue).toContainText('未登録');
});

When('【追加】新規会員登録時に性別と年齢を入力してログインする', async ({ pages, auth }) => {
  const testInfo = test.info();
  const email = uniqueEmail(testInfo, 'mypage-gender-age');
  const password = signupDefaults.password;
  await auth.logoutIfLoggedIn();
  await pages.signup.open();
  await pages.signup.fillRequired({
    email,
    password,
    confirmPassword: password,
    name: signupTestData.names.newUser,
    membership: signupDefaults.membership,
  });
  await pages.signup.gender.selectOption('女性');
  await pages.signup.age.fill('28');
  await pages.signup.submitForm();
  setScenarioState({
    email,
    password,
    name: signupTestData.names.newUser,
    gender: '女性',
    age: '28',
  });
});

Then('【追加】マイページに入力した性別と年齢が表示される', async ({ pages }) => {
  const { gender, age } = getScenarioState();
  if (gender) {
    await expect(pages.mypage.genderValue).toContainText(gender);
  }
  if (age) {
    await expect(pages.mypage.ageValue).toContainText(age);
  }
});
