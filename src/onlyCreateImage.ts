import { getImageIdData, calc } from './calc'
import fs from 'fs'
import sheet from './sheet'
import create from './create'

const main = async function () {
    try {
        const idols = JSON.parse(fs.readFileSync('allCharaIdData.json').toString())
        const sheetData = await sheet(true)
        const result = await calc(sheetData, idols)
        await create(result, true)
    } catch (e) {
        console.error(e)
    }
   
}
export default main
main()