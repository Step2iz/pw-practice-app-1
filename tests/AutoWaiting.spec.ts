import {test, expect} from '@playwright/test'
import { timeout } from 'rxjs-compat/operator/timeout'

test.beforeEach(async({page}) => {
    await page.goto("http://uitestingplayground.com/ajax")
})

test ('first test', async({page}) => {
    await page.locator('#ajaxButton').click()
    const clickButton = page.locator('.bg-success')
    
    //https://playwright.dev/docs/actionability

    //de functie zorgt ervoor dat Playwright niet verdergaat met de test totdat het element daadwerkelijk aanwezig is in de DOM
    //await clickButton.waitFor({state: "attached"})

    //wait for selector
    await page.waitForSelector('.bg-success')

    //wait for particular response
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    //wait for network calls to be completed ('NOT RECOMMEND')
    await page.waitForLoadState('networkidle')

    //alternative timeout
    await page.waitForTimeout(50000)

    //met time out
    await expect(clickButton).toHaveText('Data loaded with AJAX get request.', {timeout:20000})

    const textValue = await clickButton.textContent()
    expect(textValue).toContain('Data loaded with AJAX get request.')

})
