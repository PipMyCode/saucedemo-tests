import {test, expect} from '@playwright/test'
import { LoginPage} from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";

test.describe('Login tests', () => {

    test.beforeEach(async ({page}) => {
        const loginPage = new LoginPage(page)
        await loginPage.goto()
    })

    test('valid login shows products page', async ({page}) => {
        const loginPage = new LoginPage(page)
        await loginPage.login('standard_user', 'secret_sauce')
        await expect(page.getByText('Products')).toBeVisible()
    })

    test('wrong password shows error', async ({page}) => {
        const loginPage = new LoginPage(page)
        await loginPage.login('standard_user', 'wrong_password')
        const error = await loginPage.getErrorMessage()
        await expect(error).toContainText('Epic sadface')

    })

})

test.describe('Product tests', () => {

    test.beforeEach(async ({page}) => {
        const loginPage = new LoginPage(page)
        await loginPage.goto()
        await loginPage.login('standard_user', 'secret_sauce')
    })

    test('product is displayed on inventory page', async ({page}) => {
        await expect(page.locator('[data-test="inventory-container"]'))
            .toContainText('Sauce Labs Bolt T-Shirt')
    })
    test('Clicking a product opens its detail page', async ({page}) => {
        await page.getByText('Sauce Labs Bike Light').click()
        await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible()
        await expect(page).toHaveURL(/inventory-item/)
        await expect(page.getByRole('button', {name: 'Add to cart'})).toBeVisible()
    })
    test('add product to cart updates cart badge', async ({page}) => {
        const inventoryPage = new InventoryPage(page)
        await inventoryPage.addToCartByName('Sauce Labs Onesie')
        const badge = await inventoryPage.getCartBadge()
        await expect(badge).toHaveText('1')
    })

    test('adding multiple products to cart updates cart badge', async ({page}) => {
        await page.getByRole('button', {name: 'Add to cart'}).nth(0).click()
        await page.getByRole('button', {name: 'Add to cart'}).nth(1).click()
        await expect(
            page.locator('.shopping_cart_badge')
        ).toHaveText('2')
    })
    test('remove product from cart updates cart badge', async ({page}) => {
        const inventoryPage = new InventoryPage(page)
        await inventoryPage.addToCartByName('Sauce Labs Onesie')
        await inventoryPage.removeFromCart()
        const badge = await inventoryPage.getCartBadge()
        await expect(badge).not.toBeVisible()
    })


    test('adding two products by name with filter approach', async ({page}) => {
       const inventoryPage = new InventoryPage(page)
        await inventoryPage.addToCartByName('Sauce Labs Onesie')
        await inventoryPage.addToCartByName('Sauce Labs Fleece Jacket')
        const badge = await inventoryPage.getCartBadge()
        await expect(badge).toHaveText('2')
    })

    test('navigate to cart and verify both products are there', async ({page}) => {
        const inventoryPage = new InventoryPage(page)
        await inventoryPage.addToCartByName('Sauce Labs Onesie')
        await inventoryPage.addToCartByName('Sauce Labs Fleece Jacket')
        await inventoryPage.goToCart()
        await expect(page.getByText('Sauce Labs Onesie')).toBeVisible()
        await expect(page.getByText('Sauce Labs Fleece Jacket')).toBeVisible()
    })


})