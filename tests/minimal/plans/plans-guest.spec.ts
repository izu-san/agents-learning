import { test, expect } from '@playwright/test';
import { urls, expectOnPlansPage } from '../../helpers/app';

test.describe('宿泊プラン一覧', () => {
  test('未ログインのプラン一覧表示', async ({ page }) => {
    await page.goto(urls.plans);
    await expectOnPlansPage(page);

    await expect(page.getByText('⭐おすすめプラン⭐')).toBeVisible();
    await expect(page.getByText('会員限定')).toHaveCount(0);
    await expect(page.getByText('プレミアム会員限定')).toHaveCount(0);

    const links = page.getByRole('link', { name: 'このプランで予約' });
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i += 1) {
      await expect(links.nth(i)).toHaveAttribute('href', /reserve\.html\?plan-id=\d+/);
    }
  });
});
