import { Locator, Page } from '@playwright/test';
import { urls } from '../helpers/app';

export class LoginPage {
  readonly page: Page;
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = page.getByRole('textbox', { name: 'メールアドレス' });
    this.password = page.getByRole('textbox', { name: 'パスワード' });
    this.submit = page.locator('#login-button');
  }

  async open() {
    await this.page.goto(urls.login);
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
}
