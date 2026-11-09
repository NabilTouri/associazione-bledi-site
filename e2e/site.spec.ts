import { expect, test } from '@playwright/test'

const pages = [
  '',
  '/chi-siamo',
  '/notizie',
  '/eventi',
  '/attivita',
  '/galleria',
  '/dona',
  '/associati',
  '/trasparenza',
  '/contatti',
  '/privacy',
]

test.describe('navigation and languages', () => {
  test('redirects / to a locale', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/(it|ar|fr)$/)
  })

  test('every page renders in every language', async ({ page }) => {
    for (const locale of ['it', 'ar', 'fr']) {
      for (const path of pages) {
        const response = await page.goto(`/${locale}${path}`)
        expect(response?.status(), `/${locale}${path}`).toBe(200)
        await expect(page.locator('h1').first()).toBeVisible()
        await expect(page.locator('html')).toHaveAttribute('lang', locale)
      }
    }
  })

  test('Arabic is right-to-left', async ({ page }) => {
    await page.goto('/ar')
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
    await page.goto('/it')
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr')
  })

  test('language switcher keeps the current page', async ({ page }) => {
    await page.goto('/it/eventi')
    await page.getByTestId('language-switcher').selectOption('fr')
    await expect(page).toHaveURL(/\/fr\/eventi$/)
    await expect(page.locator('h1')).toHaveText('Événements')
  })

  test('unknown pages return 404', async ({ page }) => {
    const response = await page.goto('/it/pagina-che-non-esiste')
    expect(response?.status()).toBe(404)
  })

  test('no horizontal scrolling', async ({ page }) => {
    for (const path of ['/it', '/ar', '/it/dona', '/it/contatti']) {
      await page.goto(path)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow, path).toBeLessThanOrEqual(0)
    }
  })
})

test.describe('features that are not live yet', () => {
  test('activities show the "not active yet" notice', async ({ page }) => {
    await page.goto('/it/attivita')
    await expect(page.getByText('Attività non ancora attive')).toBeVisible()
    await expect(page.locator('[data-status="planned"]').first()).toBeVisible()
  })

  test('transparency explains the RUNTS registration is pending', async ({ page }) => {
    await page.goto('/it/trasparenza')
    await expect(page.getByText('Iscrizione al RUNTS non ancora effettuata')).toBeVisible()
  })

  test('prayer times show Brescia, Algiers and the time in Algeria', async ({ page }) => {
    await page.goto('/it')
    await expect(page.getByTestId('prayer-brescia')).toContainText(/\d{2}:\d{2}/)
    await expect(page.getByTestId('prayer-algiers')).toContainText(/\d{2}:\d{2}/)
    await expect(page.getByTestId('algeria-time')).toContainText(/\d{2}:\d{2}/)
  })
})
