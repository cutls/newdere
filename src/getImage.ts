import { getImageIdData, calc } from './calc'
import fs from 'fs'
import twitter from './twitter'
import sheet from './sheet'
import create from './create'

export default async function main() {
  try {
    const cv = false
    const tweet = true // tweetがtrueならdebugが消えて、GCSにアップロードされる
    const idols = JSON.parse(fs.readFileSync('allCharaIdData.json').toString())
    const sheetData = await sheet(cv)
    const result = await calc(sheetData, idols)
    const { buffer, url } = await create(result, !tweet, !cv)
    const status = `更新情報test ${url}`
    if (tweet) await twitter(status, buffer)
  } catch (e) {
    console.error(e)
  }
}
main()
