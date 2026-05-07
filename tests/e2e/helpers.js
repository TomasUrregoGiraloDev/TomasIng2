import { expect } from '@playwright/test';

export const USERS = {
  voluntario: { email: 'voluntario@demo.com', password: 'Demo1234' },
  org: { email: 'org@demo.com', password: 'Demo1234' },
  orgPendiente: { email: 'org.pendiente@demo.com', password: 'Demo1234' },
  admin: { email: 'admin@demo.com', password: 'Demo1234' },
};

export async function login(page, user) {
  await page.goto('/login');
  await page.getByTestId('input-email').fill(user.email);
  await page.getByTestId('input-password').fill(user.password);
  await page.getByTestId('btn-submit-login').click();
  await expect(page).not.toHaveURL(/\/login$/);
}

export async function logout(page) {
  await page.getByTestId('btn-logout').click();
  await expect(page).toHaveURL(/\/login$/);
}

export function uniqueEmail(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}@test.local`;
}
