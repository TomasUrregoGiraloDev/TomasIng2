import { test, expect } from '@playwright/test';
import { login, USERS } from './helpers.js';

// BUG-03: el texto de un mensaje aparece dos veces en la pantalla (en el hilo y en la
// vista previa de la lista de conversaciones), de modo que un getByText suelto viola el
// modo estricto de Playwright de forma intermitente, segun cual de los dos renderice
// antes. Las aserciones se acotan al contenedor del hilo.
const TEXTO = 'Hola, vengo a la actividad del sabado.';

test.describe('Mensajes', () => {
  test('voluntario puede buscar destinatario y enviar un mensaje', async ({ page }) => {
    await login(page, USERS.voluntario);
    await page.goto('/mensajes');
    await page.getByTestId('input-buscar-destinatario').fill('org@demo');
    const lista = page.getByTestId('lista-destinatarios');
    await expect(lista).toBeVisible();
    await lista.locator('button').first().click();
    await page.getByTestId('input-mensaje').fill(TEXTO);
    await page.getByTestId('btn-enviar').click();
    await expect(page.getByTestId('hilo-mensajes').getByText(TEXTO)).toBeVisible();
  });

  test('organizacion ve la conversacion creada por el voluntario', async ({ page }) => {
    await login(page, USERS.org);
    await page.goto('/mensajes');
    await expect(page.getByTestId('lista-conversaciones')).toBeVisible();
    await page.getByText('voluntario@demo.com').first().click();
    await expect(page.getByTestId('hilo-mensajes').getByText(TEXTO)).toBeVisible();
  });
});
