import { test, expect } from '@playwright/test';
import { login, USERS } from './helpers.js';

test.describe('Mensajes', () => {
  test('voluntario puede buscar destinatario y enviar un mensaje', async ({ page }) => {
    await login(page, USERS.voluntario);
    await page.goto('/mensajes');
    await page.getByTestId('input-buscar-destinatario').fill('org@demo');
    const lista = page.getByTestId('lista-destinatarios');
    await expect(lista).toBeVisible();
    await lista.locator('button').first().click();
    await page.getByTestId('input-mensaje').fill('Hola, vengo a la actividad del sabado.');
    await page.getByTestId('btn-enviar').click();
    await expect(page.getByText('Hola, vengo a la actividad del sabado.')).toBeVisible();
  });

  test('organizacion ve la conversacion creada por el voluntario', async ({ page }) => {
    await login(page, USERS.org);
    await page.goto('/mensajes');
    await expect(page.getByTestId('lista-conversaciones')).toBeVisible();
    await page.getByText('voluntario@demo.com').first().click();
    await expect(page.getByText('Hola, vengo a la actividad del sabado.')).toBeVisible();
  });
});
