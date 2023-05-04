import { GoogleSpreadsheet } from 'google-spreadsheet'
import dotenv from 'dotenv'
dotenv.config()
// さっき設定した環境変数
const sheetId = process.env.SHEET_ID || ''
const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || ''
const privateKey = process.env.GOOGLE_PRIVATE_KEY || ''

export default async function (hasCv: boolean) {
    const doc = new GoogleSpreadsheet(sheetId)
    doc.useServiceAccountAuth({
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, "\n"),
    })
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]
    const json = []
    const data = await sheet.getRows()
    for (const idol of data) {
        const [id, type, name, cv, c1, c2, c3, last, days] = idol._rawData
        if ((hasCv && !cv) || (!hasCv && cv)) continue
        const add = {
            idolId: id,
            type,
            name,
            count: [parseInt(c1, 10), parseInt(c2, 10), parseInt(c3, 10)],
            date: last,
            days: parseInt(days, 10)
        }
        json.push(add)
    }
    return json
}