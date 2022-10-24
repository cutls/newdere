import { getImageIdData, calc } from './calc'
import fs from 'fs'
import sheet from './sheet'
import create from './create'

const main = async function () {
    const cv = false
    try {
        const idols = JSON.parse(fs.readFileSync('allCharaIdData.json').toString())
        const sheetData = await sheet(cv)
        const result = await calc(sheetData, idols)
        await create(result, true, !cv)
    } catch (e) {
        console.error(e)
    }
   
}
export default main
main()