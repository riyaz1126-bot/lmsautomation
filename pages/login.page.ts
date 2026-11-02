import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto('');
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Email' }).fill(email);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Sign In' }).click();
  }
}