import { expect, Page, TestInfo } from '@playwright/test';

export const BASE_URL = 'http://127.0.0.1:8080/ja';

export const urls = {
  home: `${BASE_URL}/`,
  login: `${BASE_URL}/login.html`,
  signup: `${BASE_URL}/signup.html`,
  plans: `${BASE_URL}/plans.html`,
  mypage: `${BASE_URL}/mypage.html`,
  reserve: (planId: number) => `${BASE_URL}/reserve.html?plan-id=${planId}`,
  confirm: `${BASE_URL}/confirm.html`,
};

export const users = {
  premium: {
    email: 'ichiro@example.com',
    password: 'password',
    name: '山田一郎',
    rank: 'プレミアム会員',
  },
  standard: {
    email: 'sakura@example.com',
    password: 'pass1234',
    rank: '一般会員',
  },
};

export async function gotoHome(page: Page) {
  await page.goto(urls.home);
}

export async function login(page: Page, email: string, password: string) {
  await page.goto(urls.login);
  await page.getByRole('textbox', { name: 'メールアドレス' }).fill(email);
  await page.getByRole('textbox', { name: 'パスワード' }).fill(password);
  await page.locator('#login-button').click();
}

export async function logoutIfLoggedIn(page: Page) {
  const logoutButton = page.getByRole('button', { name: 'ログアウト' });
  if ((await logoutButton.count()) > 0) {
    await logoutButton.first().click();
  }
}

export async function expectLoggedOutNav(page: Page) {
  await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible();
  await expect(page.getByRole('link', { name: '会員登録' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'マイページ' })).toHaveCount(0);
}

export function uniqueEmail(testInfo: TestInfo, prefix = 'user') {
  const stamp = Date.now();
  return `${prefix}-${stamp}-${testInfo.workerIndex}-${testInfo.retry}@example.com`;
}

export async function fillSignupRequired(
  page: Page,
  data: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    membership?: 'プレミアム会員' | '一般会員';
  },
) {
  await page.getByRole('textbox', { name: 'メールアドレス 必須' }).fill(data.email);
  await page.getByRole('textbox', { name: 'パスワード 必須' }).fill(data.password);
  await page.getByRole('textbox', { name: 'パスワード（確認） 必須' }).fill(data.confirmPassword);
  await page.getByRole('textbox', { name: '氏名 必須' }).fill(data.name);
  if (data.membership) {
    await page.getByRole('radio', { name: data.membership }).check();
  }
}

export async function submitSignup(page: Page) {
  await page.getByRole('button', { name: '登録' }).click();
}

export async function expectOnMyPage(page: Page) {
  await expect(page).toHaveURL(/.*\/mypage\.html/);
  await expect(page.getByRole('heading', { name: 'マイページ' })).toBeVisible();
}

export async function expectOnLoginPage(page: Page) {
  await expect(page).toHaveURL(/.*\/login\.html/);
}

export async function expectOnSignupPage(page: Page) {
  await expect(page).toHaveURL(/.*\/signup\.html/);
}

export async function expectOnReservePage(page: Page) {
  await expect(page).toHaveURL(/.*\/reserve\.html/);
}

export async function expectOnPlansPage(page: Page) {
  await expect(page).toHaveURL(/.*\/plans\.html/);
}

export async function expectInvalidInputs(page: Page) {
  const invalidCount = await page.locator('input:invalid').count();
  expect(invalidCount).toBeGreaterThan(0);
}

export function formatDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}/${mm}/${dd}`;
}

export function nextDayOfWeek(from: Date, day: number) {
  const date = new Date(from);
  const diff = (day + 7 - date.getDay()) % 7 || 7;
  date.setDate(date.getDate() + diff);
  return date;
}
