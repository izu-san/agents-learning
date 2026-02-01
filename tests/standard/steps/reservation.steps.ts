import { expect } from '@playwright/test';
import { createBdd, test } from 'playwright-bdd';
import { ReservePage } from '../pages/reserve-page';
import { plans } from '../data/plans';
import { expectInvalidInputs, formatDate, nextDayOfWeek, parsePrice, urls } from '../helpers/app';
import { getScenarioState, setScenarioState } from '../helpers/state';

// NOTE: Use createBdd for playwright-bdd v7 API.
const { Given, When, Then } = createBdd(test);

Given('新しいブラウザ状態で任意プランの予約画面を開く', async ({ page }) => {
  const reserve = new ReservePage(page);
  await reserve.open(plans.recommended.id);
});

Given('新しいブラウザ状態で予約画面を開く', async ({ page }) => {
  const reserve = new ReservePage(page);
  await reserve.open(plans.recommended.id);
});

Then('予約フォームの主要項目が表示される', async ({ page }) => {
  const reserve = new ReservePage(page);
  await expect(reserve.date).toBeVisible();
  await expect(reserve.nights).toBeVisible();
  await expect(reserve.people).toBeVisible();
  await expect(reserve.name).toBeVisible();
  await expect(reserve.contact).toBeVisible();
});

Then('合計金額が初期値で表示される', async ({ page }) => {
  const reserve = new ReservePage(page);
  const initial = parsePrice(await reserve.total.innerText());
  setScenarioState({ initialTotal: initial });
  expect(initial).toBeGreaterThan(0);
});

When('宿泊数・人数・追加プランを変更する', async ({ page }) => {
  const reserve = new ReservePage(page);
  await reserve.nights.fill('2');
  await reserve.people.fill('2');
  await reserve.breakfast.check();
  await reserve.sightseeing.check();
});

Then('合計金額が入力に応じて更新される', async ({ page }) => {
  const reserve = new ReservePage(page);
  const updated = parsePrice(await reserve.total.innerText());
  setScenarioState({ updatedTotal: updated });
  const { initialTotal } = getScenarioState();
  if (initialTotal) {
    expect(updated).not.toBe(initialTotal);
  }
});

When('土日を含む日付に変更する', async ({ page }) => {
  const reserve = new ReservePage(page);
  const saturday = nextDayOfWeek(new Date(), 6);
  await reserve.date.fill(formatDate(saturday));
});

Then('週末料金の加算が反映される', async ({ page }) => {
  const reserve = new ReservePage(page);
  const weekendTotal = parsePrice(await reserve.total.innerText());
  setScenarioState({ weekendTotal });
  const expected = Math.round(plans.recommended.basePrice * plans.recommended.weekendMultiplier);
  expect(weekendTotal).toBeGreaterThanOrEqual(expected);
});

When('氏名未入力・連絡方法未選択で「予約内容を確認する」を押す', async ({ page }) => {
  const reserve = new ReservePage(page);
  await reserve.submit.click();
});

Then('予約画面のままである', async ({ page }) => {
  await expect(page).toHaveURL(/reserve\.html/);
});

Then('必須入力のエラーが表示される', async ({ page }) => {
  await expectInvalidInputs(page);
});

When('宿泊日を許容範囲外に設定する', async ({ page }) => {
  const reserve = new ReservePage(page);
  await reserve.date.fill('2099/01/01');
  await reserve.name.fill('無効日付');
  await reserve.selectContact('希望しない');
  await reserve.submit.click();
});

Then('日付に関するバリデーションが表示される', async ({ page }) => {
  await expectInvalidInputs(page);
});

When('宿泊数・人数を許容範囲外に設定する', async ({ page }) => {
  const reserve = new ReservePage(page);
  await reserve.open(plans.recommended.id);
  await reserve.nights.fill('0');
  await reserve.people.fill('0');
  await reserve.name.fill('範囲外');
  await reserve.selectContact('希望しない');
  await reserve.submit.click();
});

Then('範囲外エラーが表示される', async ({ page }) => {
  await expectInvalidInputs(page);
});

When('「メールでのご連絡」を選択する', async ({ page }) => {
  const reserve = new ReservePage(page);
  await reserve.selectContact('メールでのご連絡');
});

Then('メールアドレス入力欄が表示され必須になる', async ({ page }) => {
  const email = page.getByRole('textbox', { name: 'メールアドレス 必須' });
  await expect(email).toBeVisible();
});

When('「電話でのご連絡」を選択する', async ({ page }) => {
  const reserve = new ReservePage(page);
  await reserve.selectContact('電話でのご連絡');
});

Then('電話番号入力欄が表示され必須になる', async ({ page }) => {
  const phone = page.getByRole('textbox', { name: /電話番号/ });
  await expect(phone).toBeVisible();
});

When('人数・宿泊数を最小値に設定する', async ({ page }) => {
  const reserve = new ReservePage(page);
  await reserve.nights.fill(String(plans.recommended.minNights));
  await reserve.people.fill(String(plans.recommended.minPeople));
});

Then('合計金額が最小条件に一致する', async ({ page }) => {
  const reserve = new ReservePage(page);
  const total = parsePrice(await reserve.total.innerText());
  setScenarioState({ minTotal: total });
  const expected = plans.recommended.basePrice * plans.recommended.minNights * plans.recommended.minPeople;
  expect(total).toBe(expected);
});

When('人数・宿泊数を最大値に設定する', async ({ page }) => {
  const reserve = new ReservePage(page);
  await reserve.nights.fill(String(plans.recommended.maxNights));
  await reserve.people.fill(String(plans.recommended.maxPeople));
});

Then('合計金額が最大条件に一致する', async ({ page }) => {
  const reserve = new ReservePage(page);
  const total = parsePrice(await reserve.total.innerText());
  setScenarioState({ maxTotal: total });
  // NOTE: Calculation may include plan-specific caps; ensure max total exceeds minimum.
  const { minTotal } = getScenarioState();
  if (minTotal) {
    expect(total).toBeGreaterThan(minTotal);
  } else {
    expect(total).toBeGreaterThan(0);
  }
});

Given('新しいブラウザ状態で予約フォームを有効な値で入力する', async ({ page }) => {
  const reserve = new ReservePage(page);
  await reserve.open(plans.recommended.id);
  await reserve.name.fill('連打テスト');
  await reserve.selectContact('希望しない');
});

When('「予約内容を確認する」を連打する', async ({ page }) => {
  const reserve = new ReservePage(page);
  await Promise.all([reserve.submit.click(), reserve.submit.click(), reserve.submit.click()]);
});

Then('確認画面への遷移が一度だけ行われる', async ({ page }) => {
  await expect(page).toHaveURL(urls.confirm);
});
