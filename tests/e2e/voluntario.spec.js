import { test, expect } from '@playwright/test';
import { login, USERS } from './helpers.js';

test.describe('Voluntario', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, USERS.voluntario);
  });

  test('buscador lista actividades semilla', async ({ page }) => {
    await expect(page).toHaveURL(/\/voluntario\/buscar/);
    await expect(page.getByTestId('lista-actividades')).toBeVisible();
    await expect(page.getByText('Jornada de Reforestacion en Parque Arvi')).toBeVisible();
  });

  test('filtro de busqueda por palabra clave', async ({ page }) => {
    await page.getByTestId('input-busqueda').fill('Limpieza');
    await page.getByTestId('btn-buscar').click();
    await expect(page.getByText('Limpieza del Rio Medellin')).toBeVisible();
    await expect(page.getByText('Jornada de Reforestacion en Parque Arvi')).toHaveCount(0);
  });

  test('detalle de actividad muestra cupos y boton de inscripcion', async ({ page }) => {
    await page.getByText('Limpieza del Rio Medellin').click();
    await expect(page.getByRole('heading', { name: 'Limpieza del Rio Medellin' })).toBeVisible();
    await expect(page.getByText(/disponibles/)).toBeVisible();
    await expect(page.getByTestId('btn-inscribirme')).toBeVisible();
  });

  test('flujo completo de inscripcion con modal de confirmacion', async ({ page }) => {
    await page.getByText('Limpieza del Rio Medellin').click();
    await page.getByTestId('btn-inscribirme').click();
    await page.getByTestId('btn-confirmar-inscripcion').click();
    await expect(page.getByTestId('exito-inscripcion')).toBeVisible();
  });

  test('mis inscripciones muestra la inscripcion existente', async ({ page }) => {
    await page.goto('/voluntario/mis-inscripciones');
    await expect(page.getByTestId('lista-mis-inscripciones')).toBeVisible();
    await expect(page.getByText('Jornada de Reforestacion en Parque Arvi')).toBeVisible();
  });

  test('detalle de actividad expone link a Google Maps con la direccion', async ({ page }) => {
    await page.getByText('Jornada de Reforestacion en Parque Arvi').click();
    const link = page.getByTestId('link-google-maps');
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toContain('https://www.google.com/maps/search/');
    expect(href).toContain(encodeURIComponent('Parque Arvi'));
    expect(href).toContain(encodeURIComponent('Medellin'));
  });
});
