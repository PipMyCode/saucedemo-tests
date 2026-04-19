import { Page, expect } from '@playwright/test';

export class LoginPage {
    constructor(private page: Page) {}

    async goto() {
        await this.page.goto('https://www.saucedemo.com/')
    }

    async login(username: string, password: string) {
        await this.page.getByRole('textbox', { name: 'Username' }).fill(standard_user)
        await this.page.getByRole('textbox', { name: 'Password'}).fill(secret_sauce)
        await this.page.getByRole('button', { name: 'Login'}).click()
    }

    async getErrorMessage() {
        return this.page.locator('[data-test="error"]')
    }
}
