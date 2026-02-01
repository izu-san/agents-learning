import { test, expect, Page } from '@playwright/test';
import { urls, formatDate, nextDayOfWeek } from '../../helpers/app';

const getTotal = async (page: Page) => {
  const text = await page.getByRole('status').innerText();
  return Number(text.replace(/[^0-9]/g, ''));
};

test.describe('宿泊予約', () => {
  test('料金計算の動的更新', async ({ page }) => {
    await page.goto(urls.reserve(0));

    const baseTotal = await getTotal(page);

    await page.getByRole('spinbutton', { name: '宿泊数 必須' }).fill('2');
    await page.getByRole('spinbutton', { name: '人数 必須' }).fill('2');
    const updatedTotal = await getTotal(page);
    expect(updatedTotal).not.toBe(baseTotal);

    await page.getByRole('checkbox', { name: '朝食バイキング' }).check();
    const breakfastTotal = await getTotal(page);
    expect(breakfastTotal).not.toBe(updatedTotal);

    await page.getByRole('checkbox', { name: '朝食バイキング' }).uncheck();
    await page.getByRole('checkbox', { name: '昼からチェックインプラン' }).check();
    const checkinTotal = await getTotal(page);
    expect(checkinTotal).not.toBe(updatedTotal);

    await page.getByRole('checkbox', { name: '昼からチェックインプラン' }).uncheck();
    await page.getByRole('checkbox', { name: 'お得な観光プラン' }).check();
    const tourTotal = await getTotal(page);
    expect(tourTotal).not.toBe(updatedTotal);

    await page.getByRole('checkbox', { name: 'お得な観光プラン' }).uncheck();
    await page.getByRole('spinbutton', { name: '宿泊数 必須' }).fill('1');
    await page.getByRole('spinbutton', { name: '人数 必須' }).fill('1');

    const nextMonday = nextDayOfWeek(new Date(), 1);
    const nextSaturday = nextDayOfWeek(new Date(), 6);

    await page.getByRole('textbox', { name: '宿泊日 必須' }).fill(formatDate(nextMonday));
    await page.getByRole('textbox', { name: '宿泊日 必須' }).press('Tab');
    const weekdayTotal = await getTotal(page);

    await page.getByRole('textbox', { name: '宿泊日 必須' }).fill(formatDate(nextSaturday));
    await page.getByRole('textbox', { name: '宿泊日 必須' }).press('Tab');
    await expect.poll(async () => getTotal(page), { timeout: 2000 }).not.toBe(weekdayTotal);
  });
});
