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

  test('language menu keeps the current page', async ({ page }) => {
    await page.goto('/it/eventi')
    const button = page.getByTestId('language-switcher')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await button.click()
    const menu = page.getByRole('listbox')
    await expect(menu).toBeVisible()
    // The active language is marked as selected.
    await expect(menu.getByRole('option', { name: 'Italiano' })).toHaveAttribute('aria-selected', 'true')
    await menu.getByRole('option', { name: 'Français' }).click()
    await expect(page).toHaveURL(/\/fr\/eventi$/)
    await expect(page.locator('h1')).toHaveText('Événements')
  })

  test('language menu works with the keyboard', async ({ page }) => {
    await page.goto('/it/contatti')
    const button = page.getByTestId('language-switcher')
    await button.focus()
    await page.keyboard.press('Enter')
    const menu = page.getByRole('listbox')
    await expect(menu).toBeFocused()
    // Escape closes and gives focus back to the button.
    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
    await expect(button).toBeFocused()
    // it → ar with the arrows, then Enter.
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await expect(menu).toHaveAttribute('aria-activedescendant', /option-1$/)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/ar\/contatti$/)
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  })

  test('language menu closes on outside click and stays on screen in Arabic', async ({ page }) => {
    await page.goto('/ar')
    await page.getByTestId('language-switcher').click()
    const menu = page.getByRole('listbox')
    await expect(menu).toBeVisible()
    const box = await menu.boundingBox()
    const width = page.viewportSize()!.width
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(width)
    await page.locator('h1').first().click()
    await expect(menu).toBeHidden()
  })

  test('unknown pages return 404', async ({ page }) => {
    const response = await page.goto('/it/pagina-che-non-esiste')
    expect(response?.status()).toBe(404)
  })
})

test.describe('mobile menu', () => {
  test('opens, traps focus and closes with Escape', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'The menu button only exists on small screens')
    await page.goto('/it')
    const trigger = page.getByTestId('mobile-menu-button')
    await trigger.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Chiudi' })).toBeFocused()
    // The panel covers the full height of the screen and every link is visible.
    const panel = await page.getByTestId('mobile-menu-panel').boundingBox()
    expect(panel!.height).toBeGreaterThanOrEqual(page.viewportSize()!.height - 1)
    await expect(dialog.getByRole('link', { name: 'Contatti' })).toBeInViewport()
    await page.keyboard.press('Shift+Tab')
    await expect(dialog.getByRole('link', { name: 'Dona' })).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('navigates and closes', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'The menu button only exists on small screens')
    await page.goto('/it')
    await page.getByTestId('mobile-menu-button').click()
    await page.getByRole('dialog').getByRole('link', { name: 'Eventi' }).click()
    await expect(page).toHaveURL(/\/it\/eventi$/)
    await expect(page.getByRole('dialog')).toBeHidden()
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
