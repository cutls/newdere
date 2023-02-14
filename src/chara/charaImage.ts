import canvas from 'canvas'
import moment from 'moment'
import axios from 'axios'
import fs from 'fs'
import { getSkillInJa } from './skillDict'
const { createCanvas, registerFont, loadImage } = canvas
const scale = 1

export default async function main(charaId: string, debug?: boolean) {
    const data = await axios.get(`https://starlight.kirara.ca/api/v1/card_t/${charaId}`)
    const idol = data.data.result[0]
    const skill = idol.skill
    const baseCharaIdNum = parseInt(charaId, 10) - 1
    const baseCharaId = baseCharaIdNum.toString()
    registerFont('./noto.otf', { family: 'NotoSans' })
    const image = createCanvas(1280 * scale, 924 * scale)
    const ctx = image.getContext('2d')
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, image.width * scale, image.height * scale)
    const topImage = await loadImage(`https://hidamarirhodonite.kirara.ca/spread/${charaId}.png`)
    ctx.drawImage(topImage, 0, 0, 1280 * scale, 824 * scale)
    const signImage = await loadImage(`https://hidamarirhodonite.kirara.ca/sign/${baseCharaId }.png`)
    ctx.drawImage(signImage, 820 * scale, 464 * scale, 300 * 1.5 * scale, 240 * 1.5 * scale)
    const iconImage = await loadImage(`https://hidamarirhodonite.kirara.ca/icon_card/${charaId }.png`)
    ctx.drawImage(iconImage, 10 * scale, 834 * scale, 80 * scale, 80 * scale)
    ctx.fillStyle = getColor(idol.attribute)
    const name = idol.name_only
    const title = idol.title
    ctx.font = font(30)
    ctx.fillText(`[${title}]`, 95 * scale, 860 * scale)
    ctx.font = font(45)
    ctx.fillText(name.replace('＋', ''), 95 * scale, 910 * scale)
    const vdv = [idol.vocal_max, idol.dance_max, idol.visual_max]
    const isMutual = skill.skill_type === 'Mutual'
    const vdn = isMutual ? ['Da/Vi', 'Vo/Vi', 'Vo/Da'] : ['Vo+', 'Da+', 'Vi+']
    const maxInd = isMutual ? vdv.indexOf(Math.min(...vdv)) : vdv.indexOf(Math.max(...vdv))
    const maxStatus = vdn[maxInd]
    ctx.fillStyle = 'black'
    ctx.font = font(30)
    ctx.fillText(maxStatus, 590 * scale, 884 * scale)
    ctx.fillText(idol.lead_skill.name, 720 * scale, 864 * scale)
    const skillName = getSkillInJa(skill)
    ctx.fillText(`${skillName}(${skill.condition}s)`, 720 * scale, 904 * scale)

    const pngBuffer = image.toBuffer('image/png')
    if (debug) {
        fs.writeFileSync('image-chara.png', pngBuffer)
    }
    return pngBuffer
}
main('101160', true)
function getColor(type: 'cool' | 'cute' | 'passion') {
    if (type === 'cool') return '#2b6acf'
    if (type === 'cute') return '#cf2ba1'
    if (type === 'passion') return '#c99a2a'
    return '#000'
}
function font(size: number) {
    return `${size * scale}px NotoSans`
}