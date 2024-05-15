import { test, expect } from '@playwright/test'

const UI_URL = 'http://localhost:5173/'

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL)

  // get the sign in button
  await page.getByRole('link', { name: 'Sign In' }).click()

  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()

  await page.locator('[name=email]').fill('harsh@gmail.com')
  await page.locator('[name=password]').fill('password123')

  await page.getByRole('button', { name: 'Login' }).click()

  await expect(page.getByText('Sign in Successful!')).toBeVisible()
})

test('Should show hotel search results', async ({ page }) => {
  await page.goto(UI_URL)

  await page.getByPlaceholder('Where are you going?').fill('Test Country')
  await page.getByRole('button', { name: 'Search' }).click()

  await expect(page.getByText('Hotels found in Test Country')).toBeVisible()
  await expect(page.getByText('Test Hotel Title').first()).toBeVisible()
})
