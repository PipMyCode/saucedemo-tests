import { test, expect } from '@playwright/test'

test.describe('Login tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/')
    })

    test('valid login shows products page', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Username' }).fill('standard_user')
        await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce')
        await page.getByRole('button', { name: 'Login' }).click()
        await expect(page.getByText('Products')).toBeVisible()
    })

    test('wrong password shows error', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Username' }).fill('standard_user')
        await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword')
        await page.getByRole('button', { name: 'Login' }).click()
        await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface')
    })

})

test.describe('Product tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/')
        await page.getByRole('textbox', { name: 'Username' }).fill('standard_user')
        await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce')
        await page.getByRole('button', { name: 'Login' }).click()
    })

    test('product is displayed on inventory page', async ({ page }) => {
        await expect(page.locator('[data-test="inventory-container"]'))
            .toContainText('Sauce Labs Bolt T-Shirt')
    })

})