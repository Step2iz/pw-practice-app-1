import {test} from '@playwright/test'

//Which command is used to set up Playwright framework from scratch as an independent project? -- "npm init playwright@latest"

//Which command is correct to run test with a title "first test" in a headed mode for "chromium" project? -- "npx playwright test --project=chromium -g "first test" --headed"

//test.afterEach(() => { }) -- wanneer je na elke testgeval iets wilt runnen
//test.afterAll(() => { }) -- wanneer je bijvoorbeeld na de test je database wilt verwijderen
//test.skip -- dan skip je de test
//test.only -- dan test je alleen die testgeval
//test.beforeAll(() => { }) -- wanneer je bijvoorbeeld een database eerst wilt runnen
//test.beforeEach -- wanneer je bij elke testgeval een standaard gedrag hebt, bijvoorbeeld je gaat opent altijd de website (BDD: Gegeven ga naar de vreemdeling X)

let baseUrl = "http://localhost:4200/";

test.beforeEach(async({page}) => {
    await page.goto(baseUrl)
    await page.getByText('Forms').click()
})

test('the first test', async({page}) => {
    await page.getByText('Form layouts').click()
})

test.describe('suite1', () => {
    test.beforeEach('the first test', async({page}) => {
        await page.getByText('Forms').click()
    })
    test('the first test', async({page}) => {
        await page.getByText('Form layouts').click()
    })
})

test.describe('suite2', () => {
    test.beforeEach('the first test', async({page}) => {
        await page.getByText('Extra Components').click()
    })
    test('the second test', async({page}) => {
        await page.getByText('Form layouts').click()
    })
})