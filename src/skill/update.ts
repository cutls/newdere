import axios from 'axios'
import * as fs from 'fs'
import moment from 'moment'
import { ISkill } from '../../types'
const targetSkillsForLimited = ['Cute Ensemble', 'Cool Ensemble', 'Passion Ensemble', 'Mutual', 'Alternate', 'Life Sparkle', 'Overdrive']
const targetSkillsForBlane = ['Vocal Motif', 'Dance Motif', 'Visual Motif', 'Tricolor Symphony', 'Tricolor Synergy', 'Refrain']
const props: ('Vo' | 'Vi' | 'Da')[] = ['Vo', 'Da', 'Vi']

const main = async (changed: string[], target: 'limited' | 'blane') => {
    const targetSkills = target === 'limited' ? targetSkillsForLimited : targetSkillsForBlane
    const idols = JSON.parse(fs.readFileSync('allCharaIdData.json').toString())
    const current: ISkill[] = JSON.parse(fs.readFileSync(`${target}.json`).toString())
    for (const changeName of changed) {
        const id = idols[changeName]
        try {
            const data = await axios.get(`https://starlight.kirara.ca/api/v1/card_t/${id}`)
            const { result } = data.data
            const cardDet = result[0]
            const skill = cardDet.skill
            const apiType = cardDet.attribute
            let foundIndex = targetSkills.findIndex((item) => item === skill.skill_type)
            if (skill.skill_type.match('<missing string: ')) foundIndex = 6 // overdrive
            if (foundIndex === -1) continue
            let type: 'Cu' | 'Co' | 'Pa' | null = null
            if (apiType === 'cute') type = 'Cu'
            if (apiType === 'cool') type = 'Co'
            if (apiType === 'passion') type = 'Pa'
            if (!type) continue
            const vdv = [cardDet.vocal_max, cardDet.dance_max, cardDet.visual_max]
            const maxInd = (target === 'limited' && foundIndex === 3) ? vdv.indexOf(Math.min(...vdv)) : vdv.indexOf(Math.max(...vdv))
            const property = props[maxInd]
            const willPush = {
                type: type,
                property,
                name: cardDet.name_only.replace('＋', ''),
                interval: skill.condition,
                image: `https://hidamarirhodonite.kirara.ca/icon_card/${cardDet.id}.png`,
                since: moment().format('YYYY/MM/DD')
            }
            console.log(willPush)
            if (foundIndex <= 2) current[0].idols.push(willPush)
            if (foundIndex === 3) current[1].idols.push(willPush)
            if (foundIndex === 4) current[2].idols.push(willPush)
            if (foundIndex === 5) current[3].idols.push(willPush)
            if (foundIndex === 6) current[4].idols.push(willPush)
        } catch (e) {
            console.error(e)
        }
    }
    fs.writeFileSync(`${target}.json`, JSON.stringify(current))
}
export default main