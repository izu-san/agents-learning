import { Locator, Page } from '@playwright/test';
import { urls } from '../helpers/app';

export class SignupPage {
  readonly page: Page;
  readonly email: Locator;
  readonly password: Locator;
  readonly passwordConfirm: Locator;
  readonly name: Locator;
  readonly membershipPremium: Locator;
  readonly membershipStandard: Locator;
  readonly address: Locator;
  readonly phone: Locator;
  readonly gender: Locator;
  readonly birthday: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = page.getByRole('textbox', { name: 'メールアドレス 必須' });
    this.password = page.getByRole('textbox', { name: 'パスワード 必須' });
    this.passwordConfirm = page.getByRole('textbox', { name: 'パスワード（確認） 必須' });
    this.name = page.getByRole('textbox', { name: '氏名 必須' });
    this.membershipPremium = page.getByRole('radio', { name: 'プレミアム会員' });
    this.membershipStandard = page.getByRole('radio', { name: '一般会員' });
    this.address = page.getByRole('textbox', { name: '住所' });
    this.phone = page.getByRole('textbox', { name: '電話番号' });
    this.gender = page.getByRole('combobox', { name: '性別' });
    this.birthday = page.getByRole('textbox', { name: '生年月日' });
    this.submit = page.getByRole('button', { name: '登録' });
  }

  async open() {
    await this.page.goto(urls.signup);
  }

  async fillRequired(data: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    membership?: 'プレミアム会員' | '一般会員';
  }) {
    await this.email.fill(data.email);
    await this.password.fill(data.password);
    await this.passwordConfirm.fill(data.confirmPassword);
    await this.name.fill(data.name);
    if (data.membership === 'プレミアム会員') {
      await this.membershipPremium.check();
    }
    if (data.membership === '一般会員') {
      await this.membershipStandard.check();
    }
  }

  async submitForm() {
    await this.submit.click();
  }
}
