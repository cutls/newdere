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
import axios from 'axios'
import moment from 'moment'
import charaImage from './chara/charaImage'
const br = `
`

export default async function main() {
    const { changed, idols } = await getImageIdData()
    if (!changed.length) return
    const toot = true
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
        if (content?.match('プラチナオーディションガシャ開催')) tg = true
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
    const happeningObj = {
        name: '',
        duration: ''
    }
    const happeningNow = await axios.get('https://starlight.kirara.ca/api/v1/happening/now')
    const gacha = happeningNow.data.gachas
    if (gacha && gacha.length) {
        const startNotation = moment(new Date(gacha[0].start_date * 1000)).format('YYYY/MM/DD')
        const endNotation = moment(new Date(gacha[0].end_date * 1000)).format('YYYY/MM/DD')
        happeningObj.name = gacha[0].name
        if (totalType === 'noir') happeningObj.name = 'フェス(ノワール)'
        if (totalType === 'blane') happeningObj.name = 'フェス(ブラン)'
        happeningObj.duration = `${startNotation}〜${endNotation}`
    }
    
    const sheetData = await sheet(cv)
    const result = await calc(sheetData, idols)
    const { buffer, url } = await create(result, happeningObj, !toot, !cv)
    const image = [buffer]
    const status = `デレステガシャ更新${br}${br}${notation.join(br)}${br}${br}高画質版: ${url} #デレステ ${tweetUrl}`
    if(totalType === 'limited' || totalType === 'blane') {
        const skillData = await updateSkillData(changed, totalType)
        const { buffer } = await createSkilImage(skillData, !toot, changed, totalType)
        image.push(buffer)
    } else {
        for (const iId of changed) {
            const idols = JSON.parse(fs.readFileSync('allCharaIdData.json').toString())
            const buffer = await charaImage(idols[iId])
            image.push(buffer)
        }
    }
    if (!toot) return false
    console.log('tweeting')
    await twitter.tweet(status, image)
}
main()
