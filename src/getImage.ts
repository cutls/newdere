import { getImageIdData, calc } from './calc'
import fs from 'fs'
import * as twitter from './twitter'
import sheet from './sheet'
import create from './create'

export default async function main() {
  try {
    const cv = true // ボイス実装済みが欲しい場合true
    const tweet = false // tweetがtrueならGCSにアップロードされます。falseならルートディレクトリにimage.pngが作成されます。
    const idols = JSON.parse(fs.readFileSync('allCharaIdData.json').toString())
    const sheetData = await sheet(cv)
    const result = await calc(sheetData, idols)
    const { buffer, url } = await create(result, !tweet, !cv)
    const status = `更新情報test ${url}`
    if (tweet) await twitter.tweet(status, buffer)
  } catch (e) {
    console.error(e)
  }
}
main()
