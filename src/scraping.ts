import { writeFileSync } from 'fs'
import { ITweet } from '../types'
import puppeteer from 'puppeteer'

export async function getTl(isDev?: boolean) {
    const browser = await puppeteer.launch({ headless: !isDev })
    const page = await browser.newPage()

    await page.goto('https://twitter.com/imascg_stage')

    // Set screen size
    await page.setViewport({ width: 1080, height: 4096 })
    await page.waitForSelector('[data-testid="tweet"]', { visible: true })
    const get: ITweet[] = []
    const element = await page.$$('[data-testid="tweet"]')
    for (const tweet of element) {
        const linkElem = (await tweet.$$('[data-testid="User-Name"] a'))[2]
        const link = await (await linkElem.getProperty('href')).jsonValue()
        const idm = link.match(/[0-9]+/)
        const id = idm[0]
        const text = await page.evaluate(elm => elm.textContent, tweet)
        get.push({
            id_str: id,
            text
        })
    }
    if (!isDev) await browser.close()
    return get
}