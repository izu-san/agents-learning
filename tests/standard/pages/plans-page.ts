import { Locator, Page } from '@playwright/test';
import { urls } from '../helpers/app';

export class PlansPage {
  readonly page: Page;
  readonly title: Locator;
  readonly recommendedLabel: Locator;
  readonly reserveLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole('heading', { name: '宿泊プラン一覧' });
    this.recommendedLabel = page.getByText('⭐おすすめプラン⭐');
    this.reserveLinks = page.getByRole('link', { name: 'このプランで予約' });
  }

  async open() {
    await this.page.goto(urls.plans);
  }

  async clickFirstReserveLink() {
    await this.reserveLinks.first().click();
  }
}
