const idol = [
    "白雪千夜",
    "多田李衣菜",
    "水本ゆかり",
    "星輝子",
    "早坂美玲",
    "中野有香",
    "関裕美",
    "城ヶ崎莉嘉",
    "姫川友紀",
    "依田芳乃",
    "鷹富士茄子",
    "日野茜",
    "宮本フレデリカ",
    "堀裕子",
    "五十嵐響子",
    "上条春菜",
    "星輝子",
    "神谷奈緒",
    "白菊ほたる",
    "櫻井桃華",
    "佐藤心",
    "佐久間まゆ",
    "橘ありす",
    "高森藍子",
    "藤原肇",
    "遊佐こずえ",
    "夢見りあむ",
    "緒方智絵里",
    "結城晴",
    "白坂小梅",
    "一ノ瀬志希",
    "新田美波",
    "北条加蓮",
    "三村かな子",
    "及川雫",
    "黒埼ちとせ",
    "二宮飛鳥",
    "的場梨沙",
    "小日向美穂",
    "浅利七海",
    "木村夏樹",
    "小関麗奈",
    "相葉夕美",
    "神崎蘭子",
    "砂塚あきら",
    "小早川紗枝",
    "喜多日菜子",
    "市原仁奈",
    "辻野あかり",
    "荒木比奈",
    "森久保乃々",
    "南条光",
    "向井拓海"
]
const targetSkills = ['Dance Motif', 'Visual Motif', 'Vocal Motif', 'Tricolor Symphony', 'Tricolor Synergy', 'Refrain']
const props: ('Vo' | 'Vi' | 'Da')[] = ['Vo', 'Da', 'Vi']

import axios from 'axios'
import fs from 'fs'
import { ISkill } from '../../types'

const resonances: ISkill['idols'] = []
const symphonys: ISkill['idols'] = []
const synergys: ISkill['idols'] = []
const refrains: ISkill['idols'] = []

const alldataRaw = JSON.parse(fs.readFileSync('allCharaData.json').toString())
async function mainBlane() {
    if (fs.existsSync('blane.json')) return console.log('You have already blane.json.')
    console.log('wait several minutes')
    const alldata = alldataRaw.result
    for (const card of alldata) {
        if (card.rarity_dep.rarity !== 7) continue
        if (!idol.includes(card.name_only)) continue
        const id = card.id
        try {
            const data = await axios.get(`https://starlight.kirara.ca/api/v1/card_t/${id}`)
            const { result } = data.data
            const cardDet = result[0]
            const skill = cardDet.skill
            const apiType = cardDet.attribute
            const foundIndex = targetSkills.findIndex((item) => item === skill.skill_type)
            if (foundIndex === -1) continue
            let type: 'Cu' | 'Co' | 'Pa' | null = null
            if (apiType === 'cute') type = 'Cu'
            if (apiType === 'cool') type = 'Co'
            if (apiType === 'passion') type = 'Pa'
            if (!type) continue
            const vdv = [cardDet.vocal_max, cardDet.dance_max, cardDet.visual_max]
            const maxInd = vdv.indexOf(Math.max(...vdv))
            const property = props[maxInd]
            const willPush = {
                type,
                property,
                name: cardDet.name_only,
                interval: skill.condition,
                image: `https://hidamarirhodonite.kirara.ca/icon_card/${cardDet.evolution_id}.png`
            }
            if (foundIndex <= 2) resonances.push(willPush)
            if (foundIndex === 3) symphonys.push(willPush)
            if (foundIndex === 4) synergys.push(willPush)
            if (foundIndex === 5) refrains.push(willPush)
            console.log(cardDet.name)
            console.log(`resonance: ${resonances.length}, symphony: ${symphonys.length}, synergy: ${synergys.length}, refrain: ${refrains.length}`)
        } catch (e: any) {
            console.error(e)
        }
    }
    const output: ISkill[] = [
        {
            skillName: 'レゾナンス',
            idols: resonances
        },
        {
            skillName: 'シンフォニー',
            idols: symphonys
        },
        {
            skillName: 'シナジー',
            idols: synergys
        },
        {
            skillName: 'リフレイン',
            idols: refrains
        },
    ]
    fs.writeFileSync('blane.json', JSON.stringify(output))
}
mainBlane()