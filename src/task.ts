import { getImageIdData, calc } from './calc'
import check from './check'
import sheet from './sheet'
import create from './create'

export default async function () {
    const { changed, idols } = await getImageIdData()
    for (const idolName of changed) {
        await check(idolName)
    }
    const sheetData = await sheet()
    const result = await calc(sheetData, idols)
    await create(result)
}