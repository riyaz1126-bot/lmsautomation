import { test, expect } from '../fixtures/test';
import { getRequiredEnv } from '../utils/environment';

test('Verify that a user can log in with valid credentials', async ({ loginPage, page }) => {
  await loginPage.open();
  await loginPage.signIn(
    getRequiredEnv('LMS_EMAIL'),
    getRequiredEnv('LMS_PASSWORD'),
  );

  await expect(page).not.toHaveURL(/\/login(?:[/?#]|$)/);
});

test('Verify validation message for valid email and wrong password', async ({ loginPage, page }) => {
  await loginPage.open();
  await loginPage.signIn('Dhaneshemployee1@gmail.com', '23232');

  await expect(page).toHaveURL(/\/login(?:[/?#]|$)/);
  await expect(page.getByText('These credentials do not match our records.')).toBeVisible();
});

test('Verify validation messages when email and password are empty', async ({ loginPage, page }) => {
  await loginPage.open();
  await loginPage.signIn('', '');

  await expect(page).toHaveURL(/\/login(?:[/?#]|$)/);
  await expect(page.getByText('The email field is required.')).toBeVisible();
  await expect(page.getByText('The password field is required.')).toBeVisible();
});

