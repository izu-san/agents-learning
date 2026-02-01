import { test as base } from 'playwright-bdd';
import { HomePage } from '../pages/home-page';
import { LoginPage } from '../pages/login-page';
import { SignupPage } from '../pages/signup-page';
import { PlansPage } from '../pages/plans-page';
import { ReservePage } from '../pages/reserve-page';
import { ConfirmPage } from '../pages/confirm-page';
import { MyPage } from '../pages/mypage-page';
import { users } from '../data/users';
import { urls } from '../helpers/app';

export type PageObjects = {
  home: HomePage;
  login: LoginPage;
  signup: SignupPage;
  plans: PlansPage;
  reserve: ReservePage;
  confirm: ConfirmPage;
  mypage: MyPage;
};

export type AuthHelpers = {
  loginAs: (key: keyof typeof users) => Promise<void>;
  logoutIfLoggedIn: () => Promise<void>;
  clearAuth: () => Promise<void>;
};

export const test = base.extend<{ pages: PageObjects; auth: AuthHelpers; avatarPath: string }>(
  {
    pages: async ({ page }, use) => {
      await use({
        home: new HomePage(page),
        login: new LoginPage(page),
        signup: new SignupPage(page),
        plans: new PlansPage(page),
        reserve: new ReservePage(page),
        confirm: new ConfirmPage(page),
        mypage: new MyPage(page),
      });
    },
    auth: async ({ page }, use) => {
      await use({
        loginAs: async (key) => {
          const login = new LoginPage(page);
          await login.open();
          await login.login(users[key].email, users[key].password);
        },
        logoutIfLoggedIn: async () => {
          const logoutButton = page.getByRole('button', { name: 'ログアウト' });
          if ((await logoutButton.count()) > 0) {
            await logoutButton.first().click();
          }
        },
        clearAuth: async () => {
          await page.context().clearCookies();
          await page.goto(urls.home);
          await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
          });
        },
      });
    },
    avatarPath: async ({}, use) => {
      await use('tests/standard/fixtures/avatar.svg');
    },
  },
);
