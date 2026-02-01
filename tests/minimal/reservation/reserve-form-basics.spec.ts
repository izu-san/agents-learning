import { test, expect } from '@playwright/test';
import { urls, expectOnReservePage } from '../../helpers/app';

test.describe('宿泊予約', () => {
  test('予約フォームの初期表示と必須項目', async ({ page }) => {
    await page.goto(urls.reserve(0));
    await expectOnReservePage(page);

    await expect(page.getByRole('textbox', { name: '宿泊日 必須' })).toBeVisible();
    await expect(page.getByRole('spinbutton', { name: '宿泊数 必須' })).toBeVisible();
    await expect(page.getByRole('spinbutton', { name: '人数 必須' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '氏名 必須' })).toBeVisible();
    await expect(page.getByRole('combobox', { name: '確認のご連絡 必須' })).toBeVisible();
    await expect(page.getByRole('status')).toBeVisible();

    await page
      .getByRole('combobox', { name: '確認のご連絡 必須' })
      .selectOption('メールでのご連絡');
    await expect(page.getByRole('textbox', { name: 'メールアドレス 必須' })).toBeVisible();

    await page.getByRole('combobox', { name: '確認のご連絡 必須' }).selectOption('電話でのご連絡');
    await expect(page.getByRole('textbox', { name: '電話番号 必須' })).toBeVisible();

    await page.getByRole('combobox', { name: '確認のご連絡 必須' }).selectOption('希望しない');
    await expect(page.getByRole('textbox', { name: 'メールアドレス 必須' })).toHaveCount(0);
    await expect(page.getByRole('textbox', { name: '電話番号 必須' })).toHaveCount(0);
  });
});
