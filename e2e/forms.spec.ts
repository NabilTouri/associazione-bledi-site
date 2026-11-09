import { expect, test } from '@playwright/test'

test.describe('donation demo', () => {
  test('completes the whole flow without charging anything', async ({ page }) => {
    await page.goto('/it/dona')
    await expect(page.getByText('Modalità dimostrativa')).toBeVisible()

    const flow = page.getByTestId('donation-flow')
    // Step 1: amount
    await flow.getByText('Una tantum').click()
    await flow.getByText('50 €').click()
    await expect(page.getByTestId('donation-total')).toHaveText('50 €')
    await flow.getByRole('button', { name: 'Continua' }).click()

    // Step 2: details (validation first)
    await flow.getByRole('button', { name: 'Continua' }).click()
    await expect(flow.getByText('Campo obbligatorio').first()).toBeVisible()
    await flow.getByRole('textbox', { name: 'Nome', exact: true }).fill('Yacine')
    await flow.getByRole('textbox', { name: 'Cognome', exact: true }).fill('Test')
    await flow.getByRole('textbox', { name: 'Email', exact: true }).fill('yacine@example.com')
    await flow.getByRole('button', { name: 'Continua' }).click()

    // Step 3: demo card
    await flow.getByLabel('Titolare della carta').fill('Yacine Test')
    await flow.getByLabel('Numero della carta').fill('4242424242424241')
    await flow.getByLabel('Scadenza (MM/AA)').fill('1299')
    await flow.getByLabel('CVC').fill('123')
    await flow.getByRole('button', { name: /^Dona/ }).click()
    await expect(flow.getByText('Numero di carta non valido')).toBeVisible()
    await flow.getByLabel('Numero della carta').fill('4242424242424242')
    await flow.getByRole('button', { name: /^Dona/ }).click()

    // Step 4: done
    await expect(flow.getByText('Grazie di cuore!')).toBeVisible()
    await expect(page.getByTestId('donation-reference')).toHaveText(/^DEMO-[0-9A-F]{8}$/)
  })

  test('rejects an invalid custom amount', async ({ page }) => {
    await page.goto('/it/dona')
    const flow = page.getByTestId('donation-flow')
    await flow.getByLabel('Altro importo').fill('0')
    await flow.getByRole('button', { name: 'Continua' }).click()
    await expect(flow.getByText('Inserisci un importo tra 1 e 10.000 €')).toBeVisible()
  })
})

test.describe('contact and membership forms', () => {
  test('contact form validates and then submits', async ({ page }) => {
    await page.goto('/it/contatti')
    const form = page.getByTestId('contact-form')
    await form.getByRole('button', { name: 'Invia messaggio' }).click()
    await expect(form.getByText('Campo obbligatorio').first()).toBeVisible()

    await form.getByLabel('Nome e cognome').fill('Sara Test')
    await form.getByRole('textbox', { name: 'Email', exact: true }).fill('sara@example.com')
    await form.getByLabel('Messaggio').fill('Vorrei partecipare al prossimo evento.')
    await form.getByRole('checkbox').check()
    // Typed values must survive the failed attempt above.
    await expect(form.getByLabel('Nome e cognome')).toHaveValue('Sara Test')
    await form.getByRole('button', { name: 'Invia messaggio' }).click()
    await expect(page.getByText('Messaggio inviato!')).toBeVisible()
  })

  test('membership form submits', async ({ page }) => {
    await page.goto('/it/associati')
    const form = page.getByTestId('membership-form')
    await form.getByText('Volontario', { exact: true }).click()
    await form.getByRole('textbox', { name: 'Nome', exact: true }).fill('Ali')
    await form.getByRole('textbox', { name: 'Cognome', exact: true }).fill('Test')
    await form.getByRole('textbox', { name: 'Email', exact: true }).fill('ali@example.com')
    await form.getByRole('checkbox').check()
    await form.getByRole('button', { name: 'Invia richiesta' }).click()
    await expect(page.getByText('Richiesta inviata!')).toBeVisible()
  })
})
