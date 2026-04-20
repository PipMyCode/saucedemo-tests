import {Page} from '@playwright/test'

export class InventoryPage {
    constructor(private page: Page) {
    }

    async addToCartByName(productName: string) {
        await this.page
            .locator('.inventory_item')
            .filter({hasText: productName})
            .getByRole('button', {name: 'Add to cart'})
            .click()
    }

    async removeFromCartByName(productName: string) {
        await this.page
            .locator('.inventory_item')
            .filter({hasText: productName})
            .getByRole('button', {name: 'Remove'})
            .click()
    }

    getCartBadge() {
        return this.page.locator('.shopping_cart_badge')
    }

    async goToCart() {
        await this.page.locator('.shopping_cart_link').click()
    }

    async openProductByName(productName: string) {
        await this.page
            .locator('.inventory_item')
            .filter({hasText: productName})
            .locator('.inventory_item_name')
            .click()
    }

}