import fs from 'fs'
import { IChara } from '../types'
import axios from 'axios'
interface IParam {
    Cu: IChara[]
    Co: IChara[]
    Pa: IChara[]
}
const data: { [key: number]: IParam } = {}
const newData: { [key: number]: IChara[] } = {}
export async function calc(json: any, allCharaIdData: any) {
    // json is data.json
    const allCtList = []
    for (const idol of json) {
        const allCt: number = idol.count[0] + idol.count[1] + idol.count[2]
        const { idolId, type: typeR, name, count, date, days } = idol
        allCtList.push(allCt)
        const type: IChara['type'] = typeR
        if (!data[allCt]) data[allCt] = { Cu: [], Co: [], Pa: [] }
        data[allCt][type].push({
            type,
            name,
            image: getImageUrl(name ,allCharaIdData),
            count,
            date,
            days
        })
        data[allCt][type].sort((a, b) => b.days - a.days)
    }
    for (const allCt of allCtList) {
        newData[allCt] = data[allCt]['Cu'].concat(data[allCt]['Co']).concat(data[allCt]['Pa'])
    }
    return newData
}
export async function getImageIdData() {
    try {
        const alldataRaw = await axios.get('https://starlight.kirara.ca/api/v1/list/card_t')
        const oldData = JSON.parse(fs.readFileSync('allCharaData.json').toString())
        const alldata = alldataRaw.data.result
        const changed = []
        const idols: { [key: string]: number } = {}
        for (const card of alldata) {
            if (card.rarity_dep.rarity !== 7) continue
            idols[card.name_only] = card.evolution_id
        }
        for (const [key, value] of Object.entries(idols)) {
            if (oldData[key] !== value) changed.push(key)
        }
        fs.writeFileSync('allCharaIdData.json', JSON.stringify(idols))
        return {
            changed,
            idols
        }
    } catch (e: any) {
        console.error(e)
        throw { changed: [], idols: {}}
    }
    
}


function getImageUrl(name: string, allCharaIdData: any) {
    return `https://hidamarirhodonite.kirara.ca/icon_card/${allCharaIdData[name]}.png`
}