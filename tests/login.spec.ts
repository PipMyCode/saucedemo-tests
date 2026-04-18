import { test, expect } from '@playwright/test';

test('Login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password'}).fill('secret_sauce');
    await page.getByRole("button", { name: 'Login'}).click();
    await expect(page.getByText('Products')).toBeVisible();
  })

test('Login with invalid credentials', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password'}).fill('secret_saththuce');
    await page.getByRole("button", { name: 'Login'}).click();
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface')
})

