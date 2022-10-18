import { getImageIdData, calc } from './calc'
import check from './check'
import sheet from './sheet'
import create from './create'

export default async function () {
    const idols: any[] = []
    const sheetData = await sheet(true)
    const result = await calc(sheetData, idols)
    await create(result)
}