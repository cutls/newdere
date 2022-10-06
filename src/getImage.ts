import { getImageIdData, calc } from './calc'
import fs from 'fs'
import twitter from './twitter'
import sheet from './sheet'
import create from './create'

export default async function main() {
  try {
    const idols = JSON.parse(fs.readFileSync('allCharaIdData.json').toString())
    const sheetData = await sheet()
    const result = await calc(sheetData, idols)
    const buffer = await create(result, true)
    const status = `更新情報test`
    await twitter(status, buffer)
  } catch (e) {
    console.error(e)
  }
}
main()
