import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LeavePage extends BasePage {
  private readonly leaveDays = this.page.getByRole('spinbutton');
  private readonly startDate = this.page.locator('#start_date');
  private readonly endDate = this.page.locator('#end_date');
  private readonly returnDate = this.page.locator('#return');
  private readonly leaveType = this.page.locator('#leave_type');

  constructor(page: Page) {
    super(page);
  }

  async openCreateRequest(): Promise<void> {
    await this.goto('/apply');
    const quoteDialog = this.page.getByRole('dialog');
    if (await quoteDialog.isVisible().catch(() => false)) {
      await quoteDialog.getByRole('button', { name: 'Close' }).click();
    }
  }

  async applyOneDay(start: string, returnToWork: string): Promise<void> {
    await this.leaveDays.fill('1');
    await this.startDate.fill(start);
    await this.endDate.fill(start);
    await this.returnDate.fill(returnToWork);
    await this.leaveType.selectOption({ label: 'casual leaves' });
    await this.page.getByRole('button', { name: 'Add', exact: true }).click();
  }

  async openAppliedLeaveList(): Promise<void> {
    await this.goto('/leaves');
    const debugBarClose = this.page.locator('.phpdebugbar-close-btn');
    if (await debugBarClose.isVisible().catch(() => false)) {
      await debugBarClose.click();
    }
  }

  appliedLeaveRow(dateLabel: string): Locator {
    return this.page.getByRole('row').filter({ hasText: dateLabel });
  }

  async cancelLeave(dateLabel: string, remarks: string): Promise<Locator> {
    const row = this.appliedLeaveRow(dateLabel)
      .filter({ hasText: 'Pending' })
      .filter({ hasText: 'Casual Leaves' })
      .first();
    await row.getByRole('link', { name: 'Cancel' }).click();

    const cancellationDialog = this.page.getByRole('dialog');
    await cancellationDialog.locator('#leave-remarks').fill(remarks);

    const debugBarClose = this.page.locator('.phpdebugbar-close-btn');
    if (await debugBarClose.isVisible().catch(() => false)) {
      await debugBarClose.click();
    }

    this.page.once('dialog', (dialog) => dialog.accept());
    await cancellationDialog.getByRole('button', { name: 'Confirm' }).click();

    return this.appliedLeaveRow(dateLabel).filter({ hasText: 'Cancelled' }).first();
  }
}