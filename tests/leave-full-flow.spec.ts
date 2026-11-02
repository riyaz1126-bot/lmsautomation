import { test, expect } from '../fixtures/test';
import { getRequiredEnv } from '../utils/environment';

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateLabel(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

test('Verify that a user can apply for and cancel a one-day leave request', async ({
  loginPage,
  leavePage,
  page,
}) => {
  test.setTimeout(120_000);

  await loginPage.open();
  await loginPage.signIn(
    getRequiredEnv('LMS_EMAIL'),
    getRequiredEnv('LMS_PASSWORD'),
  );
  await expect(page).not.toHaveURL(/\/login(?:[/?#]|$)/);

  const leaveDay = new Date();
  leaveDay.setDate(leaveDay.getDate() + 5 + Math.floor(Math.random() * 25));
  while (leaveDay.getDay() === 0 || leaveDay.getDay() === 6) {
    leaveDay.setDate(leaveDay.getDate() + 1);
  }
  const returnDay = new Date(leaveDay);
  returnDay.setDate(returnDay.getDate() + 1);
  const leaveDateLabel = formatDateLabel(leaveDay);

  await leavePage.openCreateRequest();
  await leavePage.applyOneDay(formatDate(leaveDay), formatDate(returnDay));
  await leavePage.openAppliedLeaveList();

  const requestRow = leavePage.appliedLeaveRow(leaveDateLabel);
  await expect(requestRow).toContainText('1 Day');
  await expect(requestRow).toContainText('Casual Leaves');

  const remarks = `Automated cancellation ${Date.now()}`;
  await leavePage.cancelLeave(leaveDateLabel, remarks);
  await expect(requestRow).toContainText('Cancelled');
});

test('Verify that an applied casual leave appears in the leave table', async ({
  loginPage,
  leavePage,
  page,
}) => {
  test.setTimeout(120_000);

  await loginPage.open();
  await loginPage.signIn(
    getRequiredEnv('LMS_EMAIL'),
    getRequiredEnv('LMS_PASSWORD'),
  );
  await expect(page).not.toHaveURL(/\/login(?:[/?#]|$)/);

  const leaveDay = new Date();
  leaveDay.setDate(leaveDay.getDate() + 5 + Math.floor(Math.random() * 25));
  while (leaveDay.getDay() === 0 || leaveDay.getDay() === 6) {
    leaveDay.setDate(leaveDay.getDate() + 1);
  }
  const returnDay = new Date(leaveDay);
  returnDay.setDate(returnDay.getDate() + 1);
  const leaveDateLabel = formatDateLabel(leaveDay);

  await leavePage.openCreateRequest();
  await leavePage.applyOneDay(formatDate(leaveDay), formatDate(returnDay));
  await leavePage.openAppliedLeaveList();

  const requestRow = leavePage.appliedLeaveRow(leaveDateLabel);
  await expect(requestRow).toBeVisible();
  await expect(requestRow).toContainText('1 Day');
  await expect(requestRow).toContainText('Casual Leaves');
});