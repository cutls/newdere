import { getImageIdData, calc } from './calc'
import check from './check'
import sheet from './sheet'
import create from './create'

export default async function main () {
    const idols = JSON.parse(fs.readFileSync('allCharaIdData.json').toString())
    const sheetData = await sheet()
    const result = await calc(sheetData, idols)
    await create(result)
}
main()
