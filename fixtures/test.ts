import { test as base, expect } from '@playwright/test';
import { BasePage } from '../pages/base.page';
import { LoginPage } from '../pages/login.page';
import { LeavePage } from '../pages/leave.page';

type FrameworkFixtures = {
  basePage: BasePage;
  loginPage: LoginPage;
  leavePage: LeavePage;
};

export const test = base.extend<FrameworkFixtures>({
  basePage: async ({ page }, use) => {
    await use(new BasePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  leavePage: async ({ page }, use) => {
    await use(new LeavePage(page));
  },
});

export { expect };