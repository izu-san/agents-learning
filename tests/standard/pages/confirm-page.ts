import { Locator, Page } from '@playwright/test';
import { urls } from '../helpers/app';

export class ConfirmPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly total: Locator;
  readonly planName: Locator;
  readonly submit: Locator;
  readonly dialog: Locator;
  readonly dialogClose: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: '宿泊予約確認' });
    this.total = page.getByRole('heading', { name: /合計/ });
    this.planName = page.getByRole('heading', { level: 4 });
    this.submit = page.getByRole('button', { name: 'この内容で予約する' });
    this.dialog = page.getByRole('dialog');
    this.dialogClose = page.getByRole('button', { name: '閉じる' });
  }

  async openDirect() {
    await this.page.goto(urls.confirm);
  }
}
