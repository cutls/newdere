import { getImageIdData, calc } from './calc'
import check from './check'
import sheet from './sheet'
import create from './create'
import * as twitter from './twitter'
import moment from 'moment'
import { getTl } from './twitter'
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
    const targetTweet = timeline.find((item) => {
        const content = item.text
        if (content?.match('＜期間限定アイドル')) return true
        if (content?.match('＜ブラン限定アイドル')) return true
        if (content?.match('＜ノワール限定アイドル')) return true
        return false
    })
    if (!targetTweet) return conaole.log("no tweet")
    const { id_str } = targetTweet
    const tweetUrl = `https://twitter.com/imascg_stage/status/${id_str}`
    for (const idolName of changed) {
        const { hasCv, counts, days, type } = await check(idolName, targetTweet)
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
    if (!toot) return false
    const sheetData = await sheet(cv)
    const result = await calc(sheetData, idols)
    const { buffer, url } = await create(result, false, !cv)
    const status = `デレステガシャ更新${br}${br}${notation.join(br)}${br}${br}高画質版: ${url} #デレステ`
    await twitter.tweet(status, buffer)
}
main()
