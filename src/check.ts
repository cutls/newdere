import moment from 'moment'
import RssParser from 'rss-parser'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import dotenv from 'dotenv'
dotenv.config()
const sheetId = process.env.SHEET_ID || ''
const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || ''
const privateKey = process.env.GOOGLE_PRIVATE_KEY || ''
const parser = new RssParser()

async function checkNew() {
    const { items } = await parser.parseURL(`https://imastodon.net/@imascg_stage_bot.rss`)
    for (const item of items) {
        if (moment(item.pubDate).diff(moment()) < 60 * 60 * 1000 * -1) break
        const content = item.contentSnippet
        if (content?.match('＜期間限定アイドル')) return 'limited'
        if (content?.match('＜ブラン限定アイドル')) return 'fes'
        if (content?.match('＜ノワール限定アイドル')) return 'fes'
    }
    return 'normal'
}
type IType = 'limited' | 'fes' | 'normal'
interface ICheck {
    posted: boolean
    counts?: [number, number, number]
    days?: number
    type?: IType
    hasCv: boolean
}
export default async function main(idolName: string): Promise<ICheck> {
    const type = await checkNew()
    const doc = new GoogleSpreadsheet(sheetId)
    doc.useServiceAccountAuth({
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, "\n"),
    })
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]
    const json = []
    await sheet.loadCells('A1:J200')
    console.log(sheet.cellStats)
    let i = 0
    let hasCv = false
    while (true) {
        if (i > 200) break
        const name = sheet.getCell(i, 2).value
        if (`${name}` === `${idolName}`) {
            const a3 = sheet.getCell(i, 3)
            if (a3.value && a3.value !== '') hasCv = true
            // Get current data
            const a4 = Number(sheet.getCell(i, 4).value)
            const a5 = Number(sheet.getCell(i, 5).value)
            const a6 = Number(sheet.getCell(i, 6).value)
            const days = Number(sheet.getCell(i, 8).value)
            //End
            let target = 4
            if (type === 'fes') target = 6
            if (type === 'limited') target = 5
            const a1 = sheet.getCell(i, target)
            if (typeof a1.value === 'number') a1.value = a1.value + 1
            const a7 = sheet.getCell(i, 7)
            const a9 = sheet.getCell(i, 9)
            a9.value = moment().format('YYYY/MM/DD')
            a7.formula = '=DATEVALUE(J' + (i + 1) + ')'
            await sheet.saveUpdatedCells()
            return {
                posted: true,
                counts: [a4, a5, a6],
                days,
                type,
                hasCv
            }
        }
        i++
    }
    return { posted: false, hasCv: false }
}
