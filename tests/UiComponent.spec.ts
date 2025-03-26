import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
})

test.describe('Form layouts page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click();
        await page.getByText('Form layouts').click();
    })

    test('Input fields', async({page}) => {
        const emailName = await page.locator('#inputEmail1').fill('phong_nguyen@live.nl')
        const valueEmail = await page.locator('#inputEmail1').inputValue();
        expect(valueEmail).toBe('phong_nguyen@live.nl')

        const emailPassword = await page.locator('#inputPassword2').fill('test123')
        const valuePassword = await page.locator('#inputPassword2').inputValue()
        expect(valuePassword).not.toBe('')

        await page.locator('label:has-text("Option 1")').click();
        await page.getByRole('button', { name: 'Sign in' }).first().click();
    })

    
})
