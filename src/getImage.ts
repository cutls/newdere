import { getImageIdData, calc } from './calc'
import fs from 'fs'
import * as twitter from './twitter'
import sheet from './sheet'
import create from './create'
import axios from 'axios'
import moment from 'moment'

export default async function main() {
  try {
    const cv = false // ボイス実装済みが欲しい場合true
    const tweet = false // tweetがtrueならGCSにアップロードされます。falseならルートディレクトリにimage.pngが作成されます。
    const idols = JSON.parse(fs.readFileSync('allCharaIdData.json').toString())
    const sheetData = await sheet(cv)
    const result = await calc(sheetData, idols)
    const happeningObj = {
        name: '',
        duration: ''
    }
    const happeningNow = await axios.get('https://starlight.kirara.ca/api/v1/happening/1676209571')
    const gacha = happeningNow.data.gachas
    if (gacha && gacha.length) {
        const startNotation = moment(new Date(gacha[0].start_date * 1000)).format('YYYY/MM/DD')
        const endNotation = moment(new Date(gacha[0].end_date * 1000)).format('YYYY/MM/DD')
        happeningObj.name = gacha[0].name
        happeningObj.duration = `${startNotation}〜${endNotation}`
    }
    const { buffer, url } = await create(result, happeningObj, !tweet, !cv)
    const status = `更新情報test ${url}`
    if (tweet) await twitter.tweet(status, [buffer])
  } catch (e) {
    console.error(e)
  }
}
main()
