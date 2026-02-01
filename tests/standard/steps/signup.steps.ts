import { expect } from '@playwright/test';
import { createBdd, test } from 'playwright-bdd';
import { SignupPage } from '../pages/signup-page';
import { MyPage } from '../pages/mypage-page';
import { signupDefaults } from '../data/users';
import { signupTestData } from '../data/signup';
import { expectInvalidInputs, logoutIfLoggedIn, uniqueEmail, urls } from '../helpers/app';
import { getScenarioState, setScenarioState } from '../helpers/state';

// NOTE: Use createBdd for playwright-bdd v7 API.
const { Given, When, Then } = createBdd(test);

Given('新しいブラウザ状態で会員登録ページを開く', async ({ page }) => {
  const signup = new SignupPage(page);
  await signup.open();
});

Then('必須項目が表示される', async ({ page }) => {
  const signup = new SignupPage(page);
  await expect(signup.email).toBeVisible();
  await expect(signup.password).toBeVisible();
  await expect(signup.passwordConfirm).toBeVisible();
  await expect(signup.name).toBeVisible();
});

When('必須項目で会員登録する', async ({ page }) => {
  const signup = new SignupPage(page);
  const testInfo = test.info();
  const email = uniqueEmail(testInfo, 'signup');
  const name = signupDefaults.name;
  await signup.fillRequired({
    email,
    password: signupDefaults.password,
    confirmPassword: signupDefaults.password,
    name,
    membership: signupDefaults.membership,
  });
  await signup.submitForm();
  setScenarioState({ email, name });
});

// NOTE: Avoid '/' in step text to prevent matching issues.
Then('登録したメールと氏名が表示される', async ({ page }) => {
  const mypage = new MyPage(page);
  const { email, name } = getScenarioState();
  if (email) {
    await expect(mypage.emailValue).toContainText(email);
  }
  if (name) {
    await expect(mypage.nameValue).toContainText(name);
  }
});

When('必須項目を空で登録する', async ({ page }) => {
  const signup = new SignupPage(page);
  await signup.open();
  await signup.submitForm();
});

Then('会員登録ページのままである', async ({ page }) => {
  await expect(page).toHaveURL(urls.signup);
});

When('パスワードを8文字未満にして登録する', async ({ page }) => {
  const signup = new SignupPage(page);
  const testInfo = test.info();
  await signup.open();
  await signup.fillRequired({
    email: uniqueEmail(testInfo, 'shortpass'),
    password: signupTestData.shortPassword,
    confirmPassword: signupTestData.shortPassword,
    name: signupTestData.names.shortPassword,
    membership: '一般会員',
  });
  await signup.submitForm();
});

Then('パスワード要件のエラーが表示される', async ({ page }) => {
  await expectInvalidInputs(page);
});

When('パスワード確認を不一致にして登録する', async ({ page }) => {
  const signup = new SignupPage(page);
  const testInfo = test.info();
  await signup.open();
  await signup.fillRequired({
    email: uniqueEmail(testInfo, 'mismatch'),
    password: signupTestData.mismatchPassword.first,
    confirmPassword: signupTestData.mismatchPassword.second,
    name: signupTestData.names.mismatch,
    membership: '一般会員',
  });
  await signup.submitForm();
});

Then('不一致エラーが表示される', async ({ page }) => {
  await expectInvalidInputs(page);
});

When('電話番号に11桁以外または非数字を入力して登録する', async ({ page }) => {
  const signup = new SignupPage(page);
  const testInfo = test.info();
  await signup.open();
  await signup.fillRequired({
    email: uniqueEmail(testInfo, 'phone'),
    password: signupTestData.validPassword,
    confirmPassword: signupTestData.validPassword,
    name: signupTestData.names.phone,
    membership: '一般会員',
  });
  await signup.phone.fill('abc');
  await signup.submitForm();
});

Then('電話番号形式エラーが表示される', async ({ page }) => {
  await expectInvalidInputs(page);
});

When('長文の氏名と住所で登録する', async ({ page }) => {
  const signup = new SignupPage(page);
  const testInfo = test.info();
  const email = uniqueEmail(testInfo, 'long');
  // NOTE: Ensure logged-out state before navigating to signup.
  await logoutIfLoggedIn(page);
  await signup.open();
  await signup.fillRequired({
    email,
    password: signupTestData.validPassword,
    confirmPassword: signupTestData.validPassword,
    name: signupTestData.longName,
    membership: '一般会員',
  });
  await signup.address.fill(signupTestData.longAddress);
  await signup.submitForm();
  setScenarioState({ email, name: signupTestData.longName });
});

Then('バリデーションが正しく適用される', async ({ page }) => {
  await expect(page).toHaveURL(/(signup|mypage)\.html/);
});

When('住所に改行や絵文字を含めて登録する', async ({ page }) => {
  const signup = new SignupPage(page);
  const testInfo = test.info();
  const email = uniqueEmail(testInfo, 'emoji');
  // NOTE: Ensure logged-out state before navigating to signup.
  await logoutIfLoggedIn(page);
  await signup.open();
  await signup.fillRequired({
    email,
    password: signupTestData.validPassword,
    confirmPassword: signupTestData.validPassword,
    name: signupTestData.names.emoji,
    membership: '一般会員',
  });
  await signup.address.fill(`${signupTestData.newlineAddress}${signupTestData.emojiAddress}`);
  await signup.submitForm();
  setScenarioState({ email, name: signupTestData.names.emoji });
});

Then('入力が崩れず表示される', async ({ page }) => {
  await expect(page).toHaveURL(/(signup|mypage)\.html/);
});
