import { Page } from '@playwright/test'

export class InventoryPage {
    constructor(private page: Page) {}

    async addToCartByName(productName: string) {
        await this.page.locator('.inventory_item')
            .filter({ hasText: productName })
            .getByRole('button', { name: 'Add to cart' })
            .click()
    }

    async removeFromCart() {
        await this.page.getByRole('button', { name: 'Remove' }).click()
    }

    async getCartBadge() {
        return this.page.locator('.shopping_cart_badge')
    }

    async goToCart() {
        await this.page.locator('.shopping_cart_link').click()
    }

}