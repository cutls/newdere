import { getImageIdData, calc } from './calc'
import check from './check'
import sheet from './sheet'
import create from './create'
import twitter from './twitter'

export default async function main() {
    const { changed, idols } = await getImageIdData()
    if (!changed.length) return
    let toot = false
    for (const idolName of changed) {
        toot = await check(idolName)
    }
    if (!toot) return false
    const sheetData = await sheet()
    const result = await calc(sheetData, idols)
    const buffer = await create(result)
    const status = `更新情報: ${changed.join(', ')}`
    await twitter(status, buffer)
}
main()
