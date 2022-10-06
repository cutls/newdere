import twitter from 'twitter'
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()

const twit = new twitter({
    consumer_key: process.env.TW_CONSUMER_KEY || '',
    consumer_secret: process.env.TW_CONSUMER_SECRET || '',
    access_token_key: process.env.TW_ACCESS_TOKEN || '',
    access_token_secret: process.env.TW_ACCESS_TOKEN_SECRET || '',
})
export default async function main(text: string, media: Buffer) {
    try {
        const mediaId = await twit.post('media/upload', { media })
        await twit.post('/statuses/update.json', { status: text, media_ids: mediaId.media_id_string })
    } catch (e) {
        console.error(e)
    }
}