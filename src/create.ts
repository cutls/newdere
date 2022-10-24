import canvas from 'canvas'
import moment from 'moment'
import upload from './upload'
import { IChara } from '../types'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()
const { createCanvas, registerFont, loadImage } = canvas
const scale = 2

export default async function main(createData: any, debug?: boolean, noCv?: boolean) {
    const useList = noCv ? ['4', '3', '2', '1'] : ['7', '6', '5', '4', '3', '2']
    let height = 0
    for (const chances of useList) {
        const idols = createData[chances]
        const thisHeight = idols.length * 50 + 75
        if (thisHeight > height) height = thisHeight
    }
    registerFont('./noto.otf', { family: 'NotoSans' })
    const image = createCanvas((340 * useList.length + 100) * scale, height * scale)

    const ctx = image.getContext('2d')
    ctx.beginPath()
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, image.width * scale, image.height * scale)
    let base = 10
    for (const chances of useList) {
        const idols: IChara[] = createData[chances]
        ctx.font = font(18)
        ctx.fillStyle = 'black'
        ctx.fillText(`SSR ${chances}種`, (base + 70) * scale, 50 * scale)
        ctx.font = font(14)
        ctx.fillText(`内訳`, (base + 175) * scale, 50 * scale)
        ctx.fillText(`更新日`, (base + 222) * scale, 50 * scale)
        ctx.fillText(`経過日数`, (base + 290) * scale, 50 * scale)
        let start = 75
        for (const idol of idols) {
            if (idol.days >= 300) {
                ctx.beginPath()
                ctx.fillStyle = '#d8e5f0'
                ctx.rect((base + 220) * scale, (start - 15) * scale, 120 * scale, 50 * scale)
                ctx.fill()
            }
            const cts = idol.count
            if (cts[2] > 0) {
                ctx.beginPath()
                ctx.fillStyle = '#eccfd2'
                if (cts[2] >= 2) ctx.fillStyle = '#dc9798'
                ctx.rect((base + 168) * scale, (start - 15) * scale, 52 * scale, 50 * scale)
                ctx.fill()
            }
            if (!idol.image) console.log(`No image of ${idol.name}`)
            const image = await loadImage(idol.image)
            ctx.drawImage(image, (base + 10) * scale, (start - 10) * scale, 40 * scale, 40 * scale)
            ctx.font = font(16)
            if (idol.name.length > 7) ctx.font = font(11)
            ctx.fillStyle = getColor(idol.type)
            ctx.fillText(idol.name, (base + 55) * scale, (start + 15) * scale)
            ctx.font = font(10)
            ctx.fillStyle = 'black'
            ctx.fillText(`恒常:${cts[0]}`,( base + 175) * scale, start * scale)
            ctx.fillText(`限定:${cts[1]}`, (base + 175) * scale, (start + 15) * scale)
            ctx.fillText(`フェス:${cts[2]}`, (base + 175) * scale, (start + 30) * scale)
            ctx.font = font(18)
            let add = 0
            const days = idol.days
            if (days < 1000) add = add + 10
            if (days < 100) add = add + 10
            if (days < 10) add = add + 10
            ctx.fillText(`${days}`, (base + 285 + add) * scale, (start + 15) * scale)
            ctx.font = font(10)
            ctx.fillText(`日`, (base + 327) * scale, (start + 15) * scale)
            ctx.font = font(14)
            ctx.fillText(`${idol.date.slice(2)}`, (base + 222) * scale, (start + 15) * scale)
            // 横線
            ctx.beginPath()
            ctx.moveTo(base * scale, (start - 15) * scale)
            ctx.lineTo((base + 340) * scale, (start - 15) * scale)
            ctx.strokeStyle = '#e0e0e0'
            ctx.lineWidth = 1
            ctx.stroke()
            start = start + 50
        }

        ctx.beginPath()
        ctx.moveTo((base + 168) * scale, 30 * scale)
        ctx.lineTo((base + 168) * scale, (start - 15) * scale)
        ctx.strokeStyle = '#e0e0e0'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo((base + 285) * scale, 30 * scale)
        ctx.lineTo((base + 285) * scale, (start - 15) * scale)
        ctx.strokeStyle = '#e0e0e0'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo((base + 220) * scale, 30 * scale)
        ctx.lineTo((base + 220) * scale, (start - 15) * scale)
        ctx.strokeStyle = '#e0e0e0'
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo((base + 340) * scale, 30 * scale)
        ctx.lineTo((base + 340) * scale, (height - 10) * scale)
        ctx.strokeStyle = '#e0e0e0'
        ctx.lineWidth = 1
        ctx.stroke()
        base = base + 340
    }
    //const jpgBuffer = image.toBuffer('image/jpeg', { quality: 1 })
    const pngBuffer = image.toBuffer('image/png')
    if (debug) {
        fs.writeFileSync('image.png', pngBuffer)
        //fs.writeFileSync('image.jpg', jpgBuffer)
    } else {
        await upload(`${moment().format(`YYYY-MM-DD`)}${noCv ? '-nocv' : '-cv'}.png`, pngBuffer)
    }
    return { buffer: pngBuffer, url: `${process.env.STORAGE}${moment().format(`YYYY-MM-DD`)}${noCv ? '-nocv' : '-cv'}.png` }
}
//const idols = JSON.parse(fs.readFileSync('createData.json').toString())
//main(idols, true)
function getColor(type: 'Cu' | 'Co' | 'Pa') {
    if (type === 'Co') return '#2b6acf'
    if (type === 'Cu') return '#cf2ba1'
    if (type === 'Pa') return '#c99a2a'
    return '#000'
}
function font(size: number) {
    return `${size * scale}px NotoSans`
}