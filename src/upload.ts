import { Storage } from '@google-cloud/storage'
import dotenv from 'dotenv'
dotenv.config()
// さっき設定した環境変数
const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || ''
const privateKey = process.env.GOOGLE_PRIVATE_KEY || ''

export default async function (name: string, file: Buffer) {
    const storage = new Storage({ credentials: { client_email: clientEmail, private_key: privateKey.replace(/\\n/g, "\n") } })
    const bucket = storage.bucket('newdere')
    const blob = bucket.file(name)
    await blob.save(file)
}