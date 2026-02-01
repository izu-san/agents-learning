import { Page, Locator } from '@playwright/test';
import { urls } from '../helpers/app';

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly noticeHeading: Locator;
  readonly noticeContent: Locator;
  readonly navHome: Locator;
  readonly navPlans: Locator;
  readonly navSignup: Locator;
  readonly navLogin: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Hotel Planisphere' });
    this.noticeHeading = page.getByRole('heading', { name: 'お知らせ' });
    this.noticeContent = page.getByText('当ウェブサイトは', { exact: false });
    this.navHome = page.getByRole('link', { name: 'ホーム' });
    this.navPlans = page.getByRole('link', { name: '宿泊予約' });
    this.navSignup = page.getByRole('link', { name: '会員登録' });
    this.navLogin = page.getByRole('button', { name: 'ログイン' });
  }

  async open() {
    await this.page.goto(urls.home);
  }
}
