import { expect, test, type Page } from '@playwright/test'

/**
 * Phones: nothing may stick out of the screen sideways.
 *
 * The page has `overflow-x: clip` as a safety net, so checking the page width
 * would always pass. Instead every element is measured: anything wider than
 * the screen (and not inside a container that clips it on purpose) fails.
 */

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
const locales = ['it', 'ar', 'fr']

async function elementsOutsideViewport(page: Page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth
    const offenders: string[] = []
    for (const element of Array.from(document.body.querySelectorAll<HTMLElement>('*'))) {
      const rect = element.getBoundingClientRect()
      if (rect.width < 2 || rect.height < 2) continue // screen-reader-only and empty elements
      if (rect.right <= width + 0.5 && rect.left >= -0.5) continue
      let parent = element.parentElement
      let clipped = false
      while (parent && parent !== document.body) {
        if (getComputedStyle(parent).overflowX !== 'visible') {
          clipped = true
          break
        }
        parent = parent.parentElement
      }
      if (!clipped) {
        const name = `${element.tagName.toLowerCase()}.${String(element.className).split(' ').slice(0, 4).join('.')}`
        offenders.push(`${name} [${Math.round(rect.left)}, ${Math.round(rect.right)}] / ${width}`)
      }
    }
    return offenders.slice(0, 5)
  })
}

test.describe('no sideways scrolling on phones', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Phone layouts are checked once, in the mobile project')
  })

  for (const width of [320, 375]) {
    test(`all pages at ${width}px`, async ({ page }) => {
      test.setTimeout(120_000)
      await page.setViewportSize({ width, height: 740 })
      for (const locale of locales) {
        for (const path of pages) {
          await page.goto(`/${locale}${path}`)
          expect(await elementsOutsideViewport(page), `/${locale}${path} at ${width}px`).toEqual([])
        }
      }
    })
  }

  for (const width of [360, 390]) {
    test(`home and donations at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 740 })
      for (const locale of locales) {
        for (const path of ['', '/dona']) {
          await page.goto(`/${locale}${path}`)
          expect(await elementsOutsideViewport(page), `/${locale}${path} at ${width}px`).toEqual([])
        }
      }
    })
  }

  test('every donation step fits at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 })
    await page.goto('/it/dona')
    const flow = page.getByTestId('donation-flow')
    await flow.getByLabel('Altro importo').fill('1500')
    expect(await elementsOutsideViewport(page)).toEqual([])
    await flow.getByRole('button', { name: 'Continua' }).click()
    await flow.getByRole('textbox', { name: 'Nome', exact: true }).fill('Yacine')
    await flow.getByRole('textbox', { name: 'Cognome', exact: true }).fill('Test')
    await flow.getByRole('textbox', { name: 'Email', exact: true }).fill('yacine@example.com')
    expect(await elementsOutsideViewport(page)).toEqual([])
    await flow.getByRole('button', { name: 'Continua' }).click()
    await expect(flow.getByText('Titolare della carta')).toBeVisible()
    expect(await elementsOutsideViewport(page)).toEqual([])
  })
})
