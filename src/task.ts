import { getImageIdData, calc } from './calc'
import check from './check'
import sheet from './sheet'
import create from './create'
import twitter from './twitter'
import moment from 'moment'
const br = `
`

export default async function main() {
    const { changed, idols } = await getImageIdData()
    const isNoir = moment().day() <= 20 && moment().day() >= 10
    if (!changed.length) return
    let toot = true
    let typeJa = ''
    let cv = false
    const notation = []
    for (const idolName of changed) {
        const { hasCv, counts, days, type } = await check(idolName)
        if (hasCv) cv = true
        if (type === 'limited') typeJa = '限定'
        if (type === 'fes' && isNoir) typeJa = 'ノワール'
        if (type === 'fes' && !isNoir) typeJa = 'ブラン'
        if (counts) notation.push(`[${typeJa}] ${idolName} ${days}日経過(恒常${counts[0]}, 限定${counts[1]}, フェス${counts[2]})`)
    }
    if (!toot) return false
    const sheetData = await sheet(cv)
    const result = await calc(sheetData, idols)
    const { buffer, url } = await create(result, false, !cv)
    const status = `デレステガシャ更新${br}${notation.join(br)}${br}高画質版: ${url}`
    await twitter(status, buffer)
}
main()
