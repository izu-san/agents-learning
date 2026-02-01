import { Locator, Page } from '@playwright/test';
import { urls } from '../helpers/app';

export class MyPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly logout: Locator;
  readonly iconButton: Locator;
  readonly withdrawButton: Locator;
  readonly emailValue: Locator;
  readonly nameValue: Locator;
  readonly rankValue: Locator;
  readonly iconFile: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'マイページ' });
    this.logout = page.getByRole('button', { name: 'ログアウト' });
    this.iconButton = page.getByRole('button', { name: 'アイコン設定' });
    this.withdrawButton = page.getByRole('button', { name: '退会する' });
    this.emailValue = page.getByRole('heading', { name: 'メールアドレス' }).locator('..').locator('p');
    this.nameValue = page.getByRole('heading', { name: '氏名' }).locator('..').locator('p');
    this.rankValue = page.getByRole('heading', { name: '会員ランク' }).locator('..').locator('p');
    this.iconFile = page.locator('input[type="file"]');
  }

  async openDirect() {
    await this.page.goto(urls.mypage);
  }
}
