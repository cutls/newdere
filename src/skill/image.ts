import canvas from 'canvas'
import moment from 'moment'
import upload from '../upload'
import { IChara, ISkill } from '../../types'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()
const { createCanvas, registerFont, loadImage } = canvas
const scale = 2
export default async function main(createData: ISkill[], debug?: boolean, changed?: string[], skillTyped?: 'limited' | 'blane') {
    const skillType = skillTyped || 'limited'
    const masterData = JSON.parse(fs.readFileSync('allCharaIdData.json').toString())
    const commonImage = await loadImage(`https://hidamarirhodonite.kirara.ca/icon_card/100708.png`)
    let height = 0
    const skillIntList = []
    for (const skill of createData) {
        const idols = skill.idols
        const intList: number[] = []
        for (const idol of idols) {
            if (!intList.includes(idol.interval)) intList.push(idol.interval)
        }
        const intListSorted = intList.sort((a, b) => a - b)
        skillIntList.push(intListSorted)
        const thisHeight = intList.length * 180 + 75
        if (thisHeight > height) height = thisHeight
    }
    registerFont('./noto.otf', { family: 'NotoSans' })
    const image = createCanvas((250 * createData.length + 100) * scale, height * scale)

    const ctx = image.getContext('2d')
    ctx.beginPath()
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, image.width * scale, image.height * scale)
    let base = 10
    let skillIndex = 0
    for (const skill of createData) {
        const { idols } = skill
        ctx.font = font(18)
        ctx.fillStyle = 'black'
        const textWidth = ctx.measureText(skill.skillName).width
        ctx.fillText(skill.skillName, (base + (255 / 2) - (textWidth / 4) + 30) * scale, 40 * scale)
        const isMutual = skill.skillName === 'ミューチャル'
        ctx.font = isMutual ? font(12) : font(14)
        ctx.fillText(`${isMutual ? '非' : ''}特化`, (base + 30 + (isMutual ? 2 : 5)) * scale, 70 * scale)
        ctx.fillText(`Cu`, (base + 90) * scale, 70 * scale)
        ctx.fillText(`Co`, (base + 150) * scale, 70 * scale)
        ctx.fillText(`Pa`, (base + 210) * scale, 70 * scale)
        const intList = skillIntList[skillIndex]
        let start = 75
        ctx.font = font(11)
        for (const interval of intList) {
            ctx.fillText(`${interval}s`, (base + 5) * scale, (start + 90) * scale)
            // 横線
            ctx.strokeStyle = '#e0e0e0'
            ctx.lineWidth = 4
            const left = 5
            const right = 250
            ctx.beginPath()
            ctx.moveTo((base + left) * scale, (start) * scale)
            ctx.lineTo((base + right) * scale, (start) * scale)
            ctx.stroke()
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo((base + left + 25) * scale, (start + 60) * scale)
            ctx.lineTo((base + right) * scale, (start + 60) * scale)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo((base + left + 25) * scale, (start + 120) * scale)
            ctx.lineTo((base + right) * scale, (start + 120) * scale)
            ctx.stroke()
            ctx.fillText(`Vo`, (base + left + 38) * scale, (start + 35) * scale)
            ctx.fillText(`Da`, (base + left + 38) * scale, (start + 95) * scale)
            ctx.fillText(`Vi`, (base + left + 40) * scale, (start + 155) * scale)
            const idolThisInt = idols.filter((i) => i.interval === interval)
            for (const idol of idolThisInt) {
                let imgX = base + 80
                if (idol.type === 'Co') imgX = imgX + 60
                if (idol.type === 'Pa') imgX = imgX + 120
                let imgY = start + 3
                if (idol.property === 'Da') imgY = imgY + 60
                if (idol.property === 'Vi') imgY = imgY + 120
                const ids = idol.image.match(/([0-9]{1,7})\.png$/)
                if (!ids || !ids[1]) continue
                const id = ids[1]
                if (changed?.includes(idol.name) && masterData[idol.name].toString() === id) {
                    ctx.beginPath()
                    ctx.fillStyle = '#d8e5f0'
                    ctx.rect((imgX - 10) * scale, (imgY - 3) * scale, 60 * scale, 60 * scale)
                    ctx.fill()
                    ctx.fillStyle = '#000'
                }
                const image = debug ? await loadImage(idol.image) : await loadImage(idol.image)
                ctx.drawImage(image, imgX * scale, imgY * scale, 40 * scale, 40 * scale)
                if (!idol.since) continue
                ctx.font = font(11)
                ctx.fillText(idol.since.slice(2), (imgX - 3) * scale, (imgY + 50) * scale)

            }
            start = start + 180
        }

        ctx.beginPath()
        ctx.moveTo((base + 70) * scale, 60 * scale)
        ctx.lineTo((base + 70) * scale, (start - 5) * scale)
        ctx.strokeStyle = '#e0e0e0'
        ctx.lineWidth = 4
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo((base + 130) * scale, 60 * scale)
        ctx.lineTo((base + 130) * scale, (start - 5) * scale)
        ctx.strokeStyle = '#e0e0e0'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo((base + 190) * scale, 60 * scale)
        ctx.lineTo((base + 190) * scale, (start - 5) * scale)
        ctx.strokeStyle = '#e0e0e0'
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo((base + 30) * scale, 60 * scale)
        ctx.lineTo((base + 30) * scale, (start - 5) * scale)
        ctx.strokeStyle = '#e0e0e0'
        ctx.lineWidth = 4
        ctx.stroke()
        base = base + 255
        skillIndex++
    }
    const pngBuffer = image.toBuffer('image/png')
    if (debug) {
        fs.writeFileSync('image.png', pngBuffer)
    } else {
        await upload(`${moment().format(`YYYY-MM-DD`)}-skill-${skillType}.png`, pngBuffer)
    }
    return { buffer: pngBuffer, url: `${process.env.STORAGE}${moment().format(`YYYY-MM-DD`)}-skill-${skillType}.png` }
}
//const idols = JSON.parse(fs.readFileSync('limited.json').toString())
//main(idols, true, [])
function font(size: number) {
    return `${size * scale}px NotoSans`
}