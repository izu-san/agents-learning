import { Locator, Page } from '@playwright/test';
import { urls } from '../helpers/app';

export class ReservePage {
  readonly page: Page;
  readonly date: Locator;
  readonly nights: Locator;
  readonly people: Locator;
  readonly breakfast: Locator;
  readonly earlyCheckIn: Locator;
  readonly sightseeing: Locator;
  readonly name: Locator;
  readonly contact: Locator;
  readonly request: Locator;
  readonly submit: Locator;
  readonly total: Locator;

  constructor(page: Page) {
    this.page = page;
    this.date = page.getByRole('textbox', { name: '宿泊日 必須' });
    this.nights = page.getByRole('spinbutton', { name: '宿泊数 必須' });
    this.people = page.getByRole('spinbutton', { name: '人数 必須' });
    this.breakfast = page.getByRole('checkbox', { name: '朝食バイキング' });
    this.earlyCheckIn = page.getByRole('checkbox', { name: '昼からチェックインプラン' });
    this.sightseeing = page.getByRole('checkbox', { name: 'お得な観光プラン' });
    this.name = page.getByRole('textbox', { name: '氏名 必須' });
    this.contact = page.getByRole('combobox', { name: '確認のご連絡 必須' });
    this.request = page.getByRole('textbox', { name: 'ご要望・ご連絡事項等ありましたらご記入ください' });
    this.submit = page.getByRole('button', { name: '予約内容を確認する' });
    this.total = page.getByRole('status');
  }

  async open(planId: number | string) {
    await this.page.goto(urls.reserve(planId));
  }

  async selectContact(value: string) {
    await this.contact.selectOption(value);
  }
}
