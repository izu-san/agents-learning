import { test, expect } from '@playwright/test';
import { urls } from '../../helpers/app';

test.describe('宿泊予約', () => {
  test('予約確認→予約完了ダイアログ', async ({ page }) => {
    await page.goto(urls.reserve(0));

    await page.getByRole('textbox', { name: '氏名 必須' }).fill('テスト太郎');
    await page.getByRole('combobox', { name: '確認のご連絡 必須' }).selectOption('メールでのご連絡');
    await page.getByRole('textbox', { name: 'メールアドレス 必須' }).fill('taro@example.com');

    await page.getByRole('button', { name: '予約内容を確認する' }).click();
    await expect(page).toHaveURL(/.*\/confirm\.html/);
    await expect(page.getByText('宿泊予約確認')).toBeVisible();

    await page.getByRole('button', { name: 'この内容で予約する' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('予約を完了しました')).toBeVisible();

    await page.getByRole('button', { name: '閉じる' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});
