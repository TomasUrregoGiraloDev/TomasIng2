import { test, expect } from '@playwright/test';
import { login, logout, USERS, uniqueEmail } from './helpers.js';

test.describe('Auth', () => {
  test('home muestra el selector de roles', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('card-voluntario')).toBeVisible();
    await expect(page.getByTestId('card-organizacion')).toBeVisible();
    await expect(page.getByTestId('card-admin')).toBeVisible();
  });

  test('login con credenciales validas abre el panel del rol', async ({ page }) => {
    await login(page, USERS.voluntario);
    await expect(page).toHaveURL(/\/voluntario\/buscar/);
  });

  test('login con credenciales invalidas muestra error', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('input-email').fill('no-existe@demo.com');
    await page.getByTestId('input-password').fill('claveMala');
    await page.getByTestId('btn-submit-login').click();
    await expect(page.getByTestId('login-error')).toBeVisible();
  });

  test('logout limpia la sesion y vuelve a login', async ({ page }) => {
    await login(page, USERS.voluntario);
    await logout(page);
  });

  test('registro de voluntario crea cuenta y entra al buscador', async ({ page }) => {
    await page.goto('/registro/voluntario');
    await page.getByTestId('input-nombre').fill('Test');
    await page.getByTestId('input-apellido').fill('Voluntario');
    await page.getByTestId('input-email').fill(uniqueEmail('vol'));
    await page.getByTestId('input-password').fill('TestPass123');
    await page.getByTestId('btn-submit-registro').click();
    await expect(page).toHaveURL(/\/voluntario\/buscar/);
  });

  test('registro de organizacion crea cuenta y entra al panel', async ({ page }) => {
    await page.goto('/registro/organizacion');
    await page.getByTestId('input-nombre-org').fill(`Org Test ${Date.now()}`);
    await page.getByTestId('input-nit').fill(`9009${Date.now() % 100000}`);
    await page.getByTestId('input-email').fill(uniqueEmail('org'));
    await page.getByTestId('input-password').fill('TestPass123');
    await page.getByTestId('btn-submit-registro').click();
    await expect(page).toHaveURL(/\/organizacion/);
  });
});
