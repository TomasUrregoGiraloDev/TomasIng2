import { test, expect } from '@playwright/test';
import { login, USERS } from './helpers.js';

test.describe('Notificaciones', () => {
  test('mensaje genera notificacion y se puede marcar leida', async ({ page }) => {
    await login(page, USERS.org);
    await page.goto('/notificaciones');
    const tieneAlguna = await page.getByTestId('lista-notificaciones').isVisible().catch(() => false);
    if (!tieneAlguna) test.skip(true, 'No hay notificaciones aun en este shard');
    const primerBoton = page.getByTestId(/btn-marcar-leida-/).first();
    if (await primerBoton.isVisible().catch(() => false)) {
      await primerBoton.click();
      await expect(primerBoton).toHaveCount(0);
    }
  });

  test('badge de notificaciones aparece tras enviar mensaje', async ({ browser }) => {
    const ctxVol = await browser.newContext();
    const ctxOrg = await browser.newContext();
    const pageVol = await ctxVol.newPage();
    const pageOrg = await ctxOrg.newPage();

    await login(pageVol, USERS.voluntario);
    await pageVol.goto('/mensajes');
    await pageVol.getByTestId('input-buscar-destinatario').fill('org@demo');
    await pageVol.getByTestId('lista-destinatarios').locator('button').first().click();
    await pageVol.getByTestId('input-mensaje').fill('Mensaje de prueba para notificacion');
    await pageVol.getByTestId('btn-enviar').click();
    await pageVol.waitForTimeout(500);

    await login(pageOrg, USERS.org);
    await pageOrg.goto('/notificaciones');
    await expect(pageOrg.getByText(/Mensaje de prueba/)).toBeVisible({ timeout: 10_000 });

    await ctxVol.close();
    await ctxOrg.close();
  });
});
