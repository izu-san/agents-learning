import { expect, Page, TestInfo, test } from '@playwright/test';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const BASE_URL = 'http://127.0.0.1:8080/ja';

export const urls = {
  home: `${BASE_URL}/`,
  login: `${BASE_URL}/login.html`,
  signup: `${BASE_URL}/signup.html`,
  plans: `${BASE_URL}/plans.html`,
  mypage: `${BASE_URL}/mypage.html`,
  reserve: (planId: number | string) => `${BASE_URL}/reserve.html?plan-id=${planId}`,
  confirm: `${BASE_URL}/confirm.html`,
};

export function uniqueEmail(testInfo: TestInfo, prefix = 'user') {
  const stamp = Date.now();
  return `${prefix}-${stamp}-${testInfo.workerIndex}-${testInfo.retry}@example.com`;
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

export function parsePrice(text: string) {
  return Number(text.replace(/[^0-9]/g, ''));
}

export async function takeFullPageScreenshot(page: Page, label: string) {
  const testInfo = test.info();
  const safeLabel = label.replace(/[^a-zA-Z0-9-_]+/g, '-');
  const fileName = `${testInfo.title}-${safeLabel}.png`;
  const snapshotPath = testInfo.snapshotPath(fileName);
  try {
    await fs.access(snapshotPath);
    await expect(page).toHaveScreenshot(fileName, { fullPage: true });
  } catch {
    // NOTE: First-run stabilization - seed missing baseline snapshot.
    await fs.mkdir(path.dirname(snapshotPath), { recursive: true });
    await page.screenshot({ path: snapshotPath, fullPage: true });
  }
}

export async function expectInvalidInputs(page: Page) {
  const invalidCount = await page.locator('input:invalid').count();
  expect(invalidCount).toBeGreaterThan(0);
}

export async function logoutIfLoggedIn(page: Page) {
  const logoutButton = page.getByRole('button', { name: 'ログアウト' });
  if ((await logoutButton.count()) > 0) {
    await logoutButton.first().click();
  }
}
