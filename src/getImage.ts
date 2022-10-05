import { getImageIdData, calc } from './calc'
import fs from 'fs'
import check from './check'
import sheet from './sheet'
import create from './create'

export default async function main() {
  try {
    const idols = JSON.parse(fs.readFileSync('allCharaIdData.json').toString())
    const sheetData = await sheet()
    const result = await calc(sheetData, idols)
    await create(result, true)
  } catch (e) {
    console.error(e)
  }
}
main()
