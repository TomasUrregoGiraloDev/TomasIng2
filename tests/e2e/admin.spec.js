import { test, expect } from '@playwright/test';
import { login, USERS } from './helpers.js';

test.describe('Administrador', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, USERS.admin);
  });

  test('panel admin muestra KPIs', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Panel de administracion' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Actividades por categoria' })).toBeVisible();
    // KPI cards (label + value)
    await expect(page.locator('p', { hasText: /^Voluntarios$/ })).toBeVisible();
    await expect(page.locator('p', { hasText: /^Inscripciones$/ })).toBeVisible();
  });

  test('lista organizaciones y muestra estado de verificacion', async ({ page }) => {
    await page.goto('/admin/organizaciones');
    await expect(page.getByTestId('lista-organizaciones')).toBeVisible();
    await expect(page.getByText('Asociacion Comunitaria Renacer')).toBeVisible();
    await expect(page.getByText('Fundacion Ambiental Verde')).toBeVisible();
  });

  test('admin verifica organizacion pendiente y desaparece el boton', async ({ page }) => {
    await page.goto('/admin/organizaciones');
    const fila = page.locator('li', { hasText: 'Asociacion Comunitaria Renacer' });
    await fila.getByRole('button', { name: /Verificar/ }).click();
    await expect(fila.getByRole('button', { name: /Verificar/ })).toHaveCount(0);
  });

  test('reporte IA: muestra mensaje claro si no hay GROQ_API_KEY', async ({ page }) => {
    await page.goto('/admin/reportes');
    await expect(page.getByTestId('btn-generar-reporte')).toBeVisible();
    await page.getByTestId('btn-generar-reporte').click();
    const exito = page.getByTestId('reporte-resultado');
    const error = page.getByTestId('reporte-error');
    await expect(exito.or(error)).toBeVisible({ timeout: 20_000 });
  });
});
