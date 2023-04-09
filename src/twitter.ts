import twitter from 'twitter'
import dotenv from 'dotenv'
import { SendTweetV1Params, TweetV1UserTimelineParams } from 'twitter-api-v2/dist/types/v1/tweet.v1.types'
import { ITweet } from '../types'
dotenv.config()

const twit = new twitter({
    consumer_key: process.env.TW_CONSUMER_KEY || '',
    consumer_secret: process.env.TW_CONSUMER_SECRET || '',
    access_token_key: process.env.TW_ACCESS_TOKEN || '',
    access_token_secret: process.env.TW_ACCESS_TOKEN_SECRET || '',
})
export async function tweet(text: string, media: Buffer[]) {
    try {
        const mediaIds = []
        for (const medium of media) {
            const mediaId = await twit.post('media/upload', { media: medium })
            mediaIds.push(mediaId.media_id_string)
        }
        const param: SendTweetV1Params = { status: text, media_ids: mediaIds.join(',') }
        await twit.post('/statuses/update.json', param)
    } catch (e) {
        console.error(e)
    }
}
