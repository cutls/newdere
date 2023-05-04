import twitter from 'twitter'
import dotenv from 'dotenv'
import { TweetV1, SendTweetV1Params, TweetV1UserTimelineParams } from 'twitter-api-v2/dist/types/v1/tweet.v1.types'
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
export async function getTl() {
    try {
        const param: TweetV1UserTimelineParams = { screen_name: 'imascg_stage', count: 40 }
        const get = await twit.get('/statuses/user_timeline.json', param)
        return get as TweetV1[]
    } catch (e) {
        console.error(e)
        return []
    }
}