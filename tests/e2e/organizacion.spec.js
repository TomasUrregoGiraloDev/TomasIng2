import { test, expect } from '@playwright/test';
import { login, USERS } from './helpers.js';

test.describe('Organizacion', () => {
  test('organizacion verificada puede publicar una actividad', async ({ page }) => {
    await login(page, USERS.org);
    await page.goto('/organizacion/publicar');
    await page.getByTestId('input-titulo').fill('Test E2E - Plantatón');
    await page.getByTestId('input-descripcion').fill('Sembramos arboles nativos en la cuenca media del rio Medellin.');
    await page.getByTestId('select-categoria').selectOption({ index: 1 });
    await page.getByTestId('select-ciudad').selectOption({ index: 1 });
    await page.getByTestId('input-direccion').fill('Parque del Rio, Medellin');
    await page.getByTestId('input-fecha').fill('2026-09-01T08:00');
    await page.getByTestId('input-cupos').fill('20');
    await page.getByTestId('btn-publicar').click();
    await expect(page).toHaveURL(/\/organizacion\/actividades/);
    await expect(page.getByText('Test E2E - Plantatón')).toBeVisible();
  });

  test('mis actividades lista las actividades de la organizacion', async ({ page }) => {
    await login(page, USERS.org);
    await page.goto('/organizacion/actividades');
    await expect(page.getByTestId('lista-mis-actividades')).toBeVisible();
    await expect(page.getByText('Jornada de Reforestacion en Parque Arvi')).toBeVisible();
  });

  test('solicitudes muestra la inscripcion semilla en pestaña Aprobadas', async ({ page }) => {
    await login(page, USERS.org);
    await page.goto('/organizacion/inscripciones');
    await page.getByRole('button', { name: /Aprobadas/ }).click();
    await expect(page.getByTestId('lista-inscripciones')).toBeVisible();
    await expect(page.getByText('Maria Lopez')).toBeVisible();
  });

  test('organizacion sin verificar ve banner y no puede publicar', async ({ page }) => {
    await login(page, USERS.orgPendiente);
    await expect(page.getByTestId('banner-no-verificada')).toBeVisible();
    await expect(page.getByTestId('btn-publicar')).toHaveCount(0);
  });
});
