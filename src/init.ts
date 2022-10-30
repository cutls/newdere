import fs from 'fs'
import { IChara } from '../types'
import axios from 'axios'
async function main() {
    try {
        const alldataRaw = await axios.get('https://starlight.kirara.ca/api/v1/list/card_t')
        const alldata = alldataRaw.data.result
        const idols: { [key: string]: number } = {}
        for (const card of alldata) {
            if (card.rarity_dep.rarity !== 7) continue
            idols[card.name_only] = card.evolution_id
        }
        fs.writeFileSync('allCharaIdData.json', JSON.stringify(idols))
    } catch {
        console.error('Error')
    }
}
main()