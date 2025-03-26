import { test, expect, request } from '@playwright/test'
import tags from '../test-data/tags.json'


test.beforeEach(async ({ page }) => {
    //mocking API
    await page.route('*/**/api/tags', async route => {
        await route.fulfill({
            body: JSON.stringify(tags)
        })
    })

    await page.goto('https://conduit.bondaracademy.com/')
    await page.getByText('Sign in').click()
    await page.locator('[placeholder="Email"]').fill('pn@live.nl')
    await page.locator('[type="password"]').fill('test123')
    await page.locator('button[type="submit"]').click()
})

test('has title', async ({ page }) => {
    await page.route('*/**/api/articles*', async route => {
        const response = await route.fetch()
        const responseBody = await response.json()
        responseBody.articles[0].title = "This is my first test"
        responseBody.articles[0].description = "Hello, test innit"

        await route.fulfill({
            body: JSON.stringify(responseBody)
        })
    })

    await expect(page.getByText('Global Feed')).toBeVisible()
    await page.getByText('Global Feed').click()
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
    await expect(page.locator('app-article-list h1').first()).toHaveText('This is my first test')
    await expect(page.locator('app-article-list p').first()).toContainText('Hello')
    // await expect(page.locator('.tag-default').last()).toHaveText("Phong");
    // await page.locator('.tag-default', {hasText: "Phong"}).click();
})

test('Delete article', async ({ page, request }) => {
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            "user": { "email": "pn@live.nl", "password": "test123" }
        }
    })
    const responseBody = await response.json()
    const accessToken = responseBody.user.token

    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: { "article": { "title": "My first article2", "description": "Mock test2", "body": "its just a test2", "tagList": ["phong2"] } },
        headers: {
            Authorization: `Token ${accessToken}`
        }
    })
    expect(articleResponse.status()).toEqual(201)
    
    //await page.reload();
    await expect(page.getByText('Global Feed')).toBeVisible()
    await page.getByText('Global Feed').click()
    await page.locator('h1', {hasText: "my first article2"}).click()
    await page.getByText("delete article").first().click()
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
})