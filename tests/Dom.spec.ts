import {test, expect} from '@playwright/test'
import { filter } from 'rxjs-compat/operator/filter'
import { first } from 'rxjs-compat/operator/first'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
    await page.getByText('forms').click()
    await page.getByText('Form layouts').click()

})

test('Locator syntax rules', async({page}) => {
    //by tag name -> 
    page.locator('input')

    //by ID -> #
    await page.locator('#inputEmail1').click()

    //by class -> .
    page.locator('.shape-rectangle')

    //by attribute -> []
    page.locator('[placeholder="Email"]')

    //by class value (full) -> []
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition cdk-focused cdk-mouse-focused"]')

    //combine different selectors
    page.locator('input[placeholder="Email"].shape-rectangle')

    //by xPath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]')

    //by partial text match
    page.locator(':text("Using")')

    //by exact text match
    page.locator(':text-is("Using the grid")')
})

test('User facing locators', async({page}) => {
    await page.getByRole('button', {name: "send"}).click()
})

test ('Locating child elements', async({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click() //first way to find child element
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click() //second way to find child element
    await page.locator('nb-card').getByRole('button', {name: "sign in"}).first().click()

    await page.locator('nb-card').nth(1).getByRole("button").click() //try to avoid this method (find more unique elements)
})

test ('location parent element', async({page}) => {
    await page.locator('nb-card', {hasText: "Using the grid"}).getByRole('textbox', {name: "Email"}).click() //by text
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click() //by locator

    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click() //filter
    await page.locator('nb-card').filter({has: page.locator(".status-danger")}).getByRole('textbox', {name: "password"}).click() //filter

    await page.locator('nb-card').filter({has: page.locator("nb-checkbox")}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "password"}).click() //unique combination with 2 filter
    await page.getByText("Using the grid").locator('..').getByRole('textbox', {name: "Email"}).click() //by xPath
})

test ('Resusing the locaters', async({page}) => {
    const basicForms = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailForm = basicForms.getByRole('textbox', {name: "Email"})
    
    await emailForm.fill('phong_nguyen@live.nl')
    await basicForms.getByRole('textbox', {name: "password"}).fill('Welcome123')
    await basicForms.locator('nb-checkbox').click()
    await basicForms.getByRole('button').click()

    await expect(emailForm).toHaveValue('phong_nguyen@live.nl')
})

test ('extracting values', async({page}) => {
    //single test value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    //all text values
    const allRadioButton = await page.locator('nb-radio').allTextContents()
    expect(allRadioButton).toContain("Disabled Option" && "Option 1" && "Option 2")
    
    //input value 
    const basicFormEmailField = basicForm.getByRole('textbox', {name: "Email"})
    await basicFormEmailField.fill("phong_nguyen@live.nl")
    const emailFieldValue = await basicFormEmailField.inputValue()
    expect(emailFieldValue).toEqual("phong_nguyen@live.nl")

    //check placeholder 
    const placeholderValue = await basicFormEmailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

test ('assertions', async({page}) => {
    //general assertions
    const firstName = page.locator('nb-card').filter({hasText: "Block form"}).getByRole("textbox", {name:"First name"})
    await firstName.fill("phong_nguyen@live.nl")
    const firstNameValue =  await firstName.inputValue()
    expect(firstNameValue).toEqual("phong_nguyen@live.nl")

    //locator assertions
    const submitButton = page.locator('nb-card').filter({hasText: "Block form"}).getByRole('button', {name: "submit"})
    await expect(submitButton).toHaveText("Submit")

    //soft assertions (klikt alsnog naar next step tijdens je test)
    await expect.soft(submitButton).toHaveText("Submit5")
    await submitButton.click()
})  