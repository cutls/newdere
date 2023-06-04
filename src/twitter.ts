import { TwitterApi } from 'twitter-api-v2'
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()

const twitterClient = new TwitterApi({
    appKey: process.env.TW_CONSUMER_KEY,
    appSecret: process.env.TW_CONSUMER_SECRET,
    accessToken: process.env.TW_ACCESS_TOKEN,
    accessSecret: process.env.TW_ACCESS_TOKEN_SECRET
})

export async function tweet(text: string, media: Buffer[]) {
    try {
        const mediaIds: string[] = []
        for (const medium of media) {
            const mediaId = await twitterClient.v1.uploadMedia(medium, { type: 'png' })
            mediaIds.push(mediaId)
        }
        const param = { media_ids: mediaIds }
        await twitterClient.v2.tweet(text, { media: param })
    } catch (e) {
        console.error(e)
    }
}