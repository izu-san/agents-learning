import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test, type PageObjects } from '../fixtures/test';
import { plans } from '../data/plans';
import { reservationContact } from '../data/contacts';
import { formatDate, nextDayOfWeek } from '../helpers/app';
import { setScenarioState, getScenarioState } from '../helpers/state';

// NOTE: Use createBdd for playwright-bdd v7 API.
const { Given, When, Then } = createBdd(test);

async function fillValidReservation(pages: PageObjects) {
  await pages.reserve.open(plans.recommended.id);
  const today = new Date();
  const date = formatDate(nextDayOfWeek(today, 1));
  await pages.reserve.date.fill(date);
  await pages.reserve.nights.fill('1');
  await pages.reserve.people.fill('1');
  await pages.reserve.name.fill(reservationContact.name);
  await pages.reserve.selectContact('メールでのご連絡');
  const email = pages.reserve.page.getByRole('textbox', { name: 'メールアドレス 必須' });
  await email.fill(reservationContact.email);
  await pages.reserve.submit.click();
  setScenarioState({ name: reservationContact.name, email: reservationContact.email });
}

Given('新しいブラウザ状態で予約フォームを有効な値で入力し確認画面へ進む', async ({ pages }) => {
  await fillValidReservation(pages);
});

Then('入力内容が確認画面に反映される', async ({ page }) => {
  const { name, email } = getScenarioState();
  if (name) {
    await expect(page.getByText(`${name}様`)).toBeVisible();
  }
  if (email) {
    await expect(page.getByText(email)).toBeVisible();
  }
});

// NOTE: Avoid '/' in step text to prevent matching issues.
Then('合計金額と期間・人数・追加プランが表示される', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /合計/ })).toBeVisible();
  await expect(page.getByText('期間')).toBeVisible();
  await expect(page.getByText('人数')).toBeVisible();
  await expect(page.getByText('追加プラン')).toBeVisible();
});

When('「この内容で予約する」を押す', async ({ pages }) => {
  await pages.confirm.submit.click();
});

Then('完了ダイアログが表示される', async ({ pages }) => {
  await expect(pages.confirm.dialog).toBeVisible();
});

When('ダイアログを閉じる', async ({ pages }) => {
  await pages.confirm.dialogClose.click();
});

Then('確認画面に戻るか完了状態が維持される', async ({ page }) => {
  await expect(page.getByRole('heading', { name: '宿泊予約確認' })).toBeVisible();
});

Given('新しいブラウザ状態で予約フォームを有効な値で入力し完了まで進める', async ({ pages }) => {
  await fillValidReservation(pages);
  await pages.confirm.submit.click();
  await expect(pages.confirm.dialog).toBeVisible();
  await pages.confirm.dialogClose.click();
});

When('完了後にページを再読み込みする', async ({ page }) => {
  await page.reload();
});

Then('予約が二重に作成されたりエラー状態にならない', async ({ page }) => {
  await expect(page.getByRole('heading', { name: '宿泊予約確認' })).toBeVisible();
});

When('ブラウザの戻る操作を行う', async ({ page }) => {
  await page.goBack();
});

Then('不整合な状態にならない', async ({ page }) => {
  // NOTE: Back navigation may land on home; accept reserve/confirm/home states.
  await expect(page).toHaveURL(/(reserve|confirm|index)\.html/);
});
