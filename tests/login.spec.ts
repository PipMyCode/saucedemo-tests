import {test, expect} from '@playwright/test'
import {LoginPage} from "../pages/LoginPage";
import {InventoryPage} from "../pages/InventoryPage"

const USERS = {
    standard: {
        username: 'standard_user',
        password: 'secret_sauce'
    },
    wrongPassword: {
        username: 'standard_user',
        password: 'wrong_password'
    },
}
const PRODUCTS = {
    onesie: 'Sauce Labs Onesie',
    jacket: 'Sauce Labs Fleece Jacket',
    boltTShirt: 'Sauce Labs Bolt T-Shirt',
    bikeLight: 'Sauce Labs Bike Light',
}

test.describe('Login tests', () => {
    let loginPage: LoginPage

    test.beforeEach(async ({page}) => {
        loginPage = new LoginPage(page)
        await loginPage.goto()
    })

    test('valid login shows products page', async ({page}) => {
        await loginPage.login(USERS.standard.username, USERS.standard.password)
        await expect(page.getByText('Products')).toBeVisible()
        await expect(page).toHaveURL(/inventory/)
    })

    test('wrong password shows error', async ({page}) => {
        await loginPage.login(USERS.wrongPassword.username, USERS.wrongPassword.password)
        await expect(loginPage.getErrorMessage()).toContainText('Epic sadface')
    })

})

test.describe('Product tests', () => {

    let loginPage: LoginPage
    let inventoryPage: InventoryPage

    test.beforeEach(async ({page}) => {
        loginPage = new LoginPage(page)
        inventoryPage = new InventoryPage(page)

        await loginPage.goto()
        await loginPage.login(USERS.standard.username, USERS.standard.password)
    })

    test('product is displayed on inventory page', async ({page}) => {
        await expect(page.locator('[data-test="inventory-container"]'))
            .toContainText(PRODUCTS.boltTShirt)
    })
    test('Clicking a product opens its detail page', async ({page}) => {
        await inventoryPage.openProductByName(PRODUCTS.bikeLight)
        await expect(page.getByText(PRODUCTS.bikeLight)).toBeVisible()
        await expect(page).toHaveURL(/inventory-item/)
        await expect(page.getByRole('button', {name: 'Add to cart'})).toBeVisible()
    })
    test('add product to cart updates cart badge', async ({page}) => {
        await inventoryPage.addToCartByName(PRODUCTS.onesie)
        await expect(inventoryPage.getCartBadge()).toHaveText('1')
    })

    test('adding multiple products to cart updates cart badge', async ({page}) => {
        await inventoryPage.addToCartByName(PRODUCTS.onesie)
        await inventoryPage.addToCartByName(PRODUCTS.jacket)
        await expect(inventoryPage.getCartBadge()).toHaveText('2')
    })
    test('remove product from cart updates cart badge', async ({page}) => {
        await inventoryPage.addToCartByName(PRODUCTS.onesie)
        await inventoryPage.removeFromCartByName(PRODUCTS.onesie)
        await expect(inventoryPage.getCartBadge()).not.toBeVisible()
    })


    test('navigate to cart and verify both products are there', async ({page}) => {
        await inventoryPage.addToCartByName(PRODUCTS.onesie)
        await inventoryPage.addToCartByName(PRODUCTS.jacket)
        await inventoryPage.goToCart()

        await expect(page.getByText(PRODUCTS.onesie)).toBeVisible()
        await expect(page.getByText(PRODUCTS.jacket)).toBeVisible()
    })


})