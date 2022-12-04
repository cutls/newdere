import { getImageIdData, calc } from './calc'
import check from './check'
import sheet from './sheet'
import create from './create'
import updateSkillData from './skill/update'
import createSkilImage from './skill/image'
import * as twitter from './twitter'
import fs from 'fs'
import { getTl } from './twitter'
import { TweetV1 } from 'twitter-api-v2/dist/types/v1/tweet.v1.types'
import { IType } from '../types'
const br = `
`

export default async function main() {
    const { changed, idols } = await getImageIdData()
    if (!changed.length) return
    let toot = true
    let typeJa = '恒常'
    let cv = false
    const notation = []
    const timeline = await getTl()
    let targetTweet: TweetV1 | null = null
    for (const t of timeline) {
        let tg = false
        targetTweet = t
        const content = t.text
        if (content?.match('＜期間限定アイドル')) tg = true
        if (content?.match('＜ブラン限定アイドル')) tg = true
        if (content?.match('＜ノワール限定アイドル')) tg = true
        if (content?.match('新しいプラチナオーディションガシャ開催')) tg = true
        if (tg) break
    }
    if (!targetTweet) return console.log('no tweet')
    const { id_str } = targetTweet
    const tweetUrl = `https://twitter.com/imascg_stage/status/${id_str}`
    let totalType: IType = 'normal'
    for (const idolName of changed) {
        const { hasCv, counts, days, type } = await check(idolName, targetTweet)
        if(type) totalType = type
        if (hasCv) cv = true
        if (type === 'limited') typeJa = '限定'
        if (type === 'noir') typeJa = 'ノワール'
        if (type === 'blane') typeJa = 'ブラン'
        let [n, l, f] = counts || [0, 0, 0]
        if (type === 'noir' || type === 'blane') f = f + 1
        if (type === 'limited') l = l + 1
        if (type === 'normal') n = n + 1
        if (counts) notation.push(`[${typeJa}] ${idolName} ${days}日経過(恒常${n}, 限定${l}, フェス${f})`)
    }
    if(totalType === 'limited') await updateSkillData(changed, totalType)
    if (!toot) return false
    const sheetData = await sheet(cv)
    const result = await calc(sheetData, idols)
    const { buffer, url } = await create(result, false, !cv)
    const image = [buffer]
    const status = `デレステガシャ更新${br}${br}${notation.join(br)}${br}${br}高画質版: ${url} #デレステ ${tweetUrl}`
    if(totalType === 'limited') {
        const skillData = JSON.parse(fs.readFileSync('limited.json').toString())
        const { buffer } = await createSkilImage(skillData, false)
        image.push(buffer)
    }
    await twitter.tweet(status, image)
}
main()
