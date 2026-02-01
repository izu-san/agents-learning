import { test } from '@playwright/test';
import { urls, expectOnReservePage, expectInvalidInputs } from '../../helpers/app';

test.describe('宿泊予約', () => {
  test('予約フォームのバリデーション', async ({ page }) => {
    await page.goto(urls.reserve(0));
    await page.getByRole('button', { name: '予約内容を確認する' }).click();
    await expectOnReservePage(page);
    await expectInvalidInputs(page);

    await page.goto(urls.reserve(0));
    await page.getByRole('textbox', { name: '宿泊日 必須' }).fill('2099/01/01');
    await page.getByRole('textbox', { name: '氏名 必須' }).fill('無効日付');
    await page.getByRole('combobox', { name: '確認のご連絡 必須' }).selectOption('希望しない');
    await page.getByRole('button', { name: '予約内容を確認する' }).click();
    await expectOnReservePage(page);

    await page.goto(urls.reserve(0));
    await page.getByRole('spinbutton', { name: '宿泊数 必須' }).fill('0');
    await page.getByRole('textbox', { name: '氏名 必須' }).fill('宿泊数0');
    await page.getByRole('combobox', { name: '確認のご連絡 必須' }).selectOption('希望しない');
    await page.getByRole('button', { name: '予約内容を確認する' }).click();
    await expectOnReservePage(page);

    await page.goto(urls.reserve(0));
    await page.getByRole('spinbutton', { name: '人数 必須' }).fill('0');
    await page.getByRole('textbox', { name: '氏名 必須' }).fill('人数0');
    await page.getByRole('combobox', { name: '確認のご連絡 必須' }).selectOption('希望しない');
    await page.getByRole('button', { name: '予約内容を確認する' }).click();
    await expectOnReservePage(page);

    await page.goto(urls.reserve(8));
    await page.getByRole('spinbutton', { name: '人数 必須' }).fill('1');
    await page.getByRole('textbox', { name: '氏名 必須' }).fill('カップル');
    await page.getByRole('combobox', { name: '確認のご連絡 必須' }).selectOption('希望しない');
    await page.getByRole('button', { name: '予約内容を確認する' }).click();
    await expectOnReservePage(page);
  });
});
