const idol = ["島村卯月",
    "本田未央",
    "渋谷凛",
    "黒埼ちとせ",
    "八神マキノ",
    "城ヶ崎美嘉",
    "関裕美",
    "速水奏",
    "城ヶ崎莉嘉",
    "安部菜々",
    "佐城雪美",
    "依田芳乃",
    "乙倉悠貴",
    "鷹富士茄子",
    "日野茜",
    "宮本フレデリカ",
    "アナスタシア",
    "堀裕子",
    "五十嵐響子",
    "久川颯",
    "星輝子",
    "中野有香",
    "神谷奈緒",
    "村上巴",
    "櫻井桃華",
    "佐藤心",
    "佐久間まゆ",
    "橘ありす",
    "高森藍子",
    "前川みく",
    "藤原肇",
    "久川凪",
    "塩見周子",
    "夢見りあむ",
    "十時愛梨",
    "緒方智絵里",
    "三船美優",
    "白坂小梅",
    "一ノ瀬志希",
    "新田美波",
    "大槻唯",
    "北条加蓮",
    "三村かな子",
    "ナターリア",
    "諸星きらり",
    "川島瑞樹",
    "西園寺琴歌",
    "二宮飛鳥",
    "早坂美玲",
    "小日向美穂",
    "浅利七海",
    "高垣楓",
    "木村夏樹",
    "道明寺歌鈴",
    "相葉夕美",
    "双葉杏",
    "鷺沢文香",
    "神崎蘭子",
    "イヴ・サンタクロース",
    "小早川紗枝",
    "喜多日菜子",
    "持田亜里沙",
    "桐生つかさ",
    "辻野あかり",
    "三好紗南",
    "荒木比奈",
    "輿水幸子",
    "佐々木千枝",
    "喜多見柚",
    "森久保乃々",
    "南条光",
    "向井拓海"
]
const targetSkills = ['Cute Ensemble', 'Cool Ensemble', 'Passion Ensemble', 'Mutual', 'Alternate', 'Life Sparkle']
const targetSkillsJa = ['アンサンブル', 'アンサンブル', 'アンサンブル', 'ミューチャル', 'オルタネイト', 'ライフスパークル']
const props: ('Vo' | 'Vi' | 'Da')[] = ['Vo', 'Da', 'Vi']

import axios from 'axios'
import fs from 'fs'
import { ISkill } from '../../types'

const ensembles: ISkill['idols'] = []
const mutuals: ISkill['idols'] = []
const alts: ISkill['idols'] = []
const sparkles: ISkill['idols'] = []

const alldataRaw = JSON.parse(fs.readFileSync('allCharaData.json').toString())
async function mainLimited() {
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
            const maxInd = foundIndex === 3 ? vdv.indexOf(Math.min(...vdv)) : vdv.indexOf(Math.max(...vdv))
            const property = props[maxInd]
            const willPush = {
                type,
                property,
                name: cardDet.name_only,
                interval: skill.condition,
                image: `https://hidamarirhodonite.kirara.ca/icon_card/${cardDet.evolution_id}.png`
            }
            if (foundIndex <= 2) ensembles.push(willPush)
            if (foundIndex === 3) mutuals.push(willPush)
            if (foundIndex === 4) alts.push(willPush)
            if (foundIndex === 5) sparkles.push(willPush)
            console.log(cardDet.name)
            console.log(`ensembles: ${ensembles.length}, mutuals: ${mutuals.length}, alts: ${alts.length}, sparkles: ${sparkles.length}`)
        } catch (e: any) {
            console.error(e)
        }
    }
    const output: ISkill[] = [
        {
            skillName: 'アンサンブル',
            idols: ensembles
        },
        {
            skillName: 'ミューチャル',
            idols: mutuals
        },
        {
            skillName: 'オルタネイト',
            idols: alts
        },
        {
            skillName: 'ライフスパークル',
            idols: sparkles
        },
    ]
    fs.writeFileSync('limited.json', JSON.stringify(output))
}
mainLimited()