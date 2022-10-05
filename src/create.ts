import canvas from 'canvas'
import moment from 'moment'
import upload from './upload'
import { IChara } from '../types'
import fs from 'fs'
const { createCanvas, registerFont, loadImage } = canvas

export default async function main(createData: any, debug?: boolean) {
    const useList = ['7', '6', '5', '4', '3', '2']
    let height = 0
    for (const chances of useList) {
        const idols = createData[chances]
        const thisHeight = idols.length * 50 + 75
        if (thisHeight > height) height = thisHeight
    }
    registerFont('./noto.otf', { family: 'NotoSans' })
    const image = createCanvas(340 * useList.length + 100, height)

    const ctx = image.getContext('2d')
    ctx.beginPath()
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, image.width, image.height)
    let base = 10
    for (const chances of useList) {
        const idols: IChara[] = createData[chances]
        ctx.font = '18px NotoSans'
        ctx.fillStyle = 'black'
        ctx.fillText(`SSR ${chances}種`, base + 70, 50)
        ctx.font = '14px NotoSans'
        ctx.fillText(`内訳`, base + 175, 50)
        ctx.fillText(`経過日数`, base + 222, 50)
        ctx.fillText(`更新日`, base + 290, 50)
        let start = 75
        for (const idol of idols) {
            if (idol.days >= 300) {
                ctx.beginPath()
                ctx.fillStyle = '#d8e5f0'
                ctx.rect( base + 220, start - 15, 120, 50 )
                ctx.fill()
            }
            const cts = idol.count
            if (cts[2] > 0) {
                ctx.beginPath()
                ctx.fillStyle = '#f5b8c0'
                if(cts[2] >= 2) ctx.fillStyle = '#ed9da7'
                ctx.rect( base + 168, start - 15, 52, 50 )
                ctx.fill()
            }
            const image = await loadImage(idol.image)
            ctx.drawImage(image, base + 10, start - 10, 40, 40)
            ctx.font = '16px NotoSans'
            ctx.fillStyle = getColor(idol.type)
            ctx.fillText(idol.name, base + 55, start + 15)
            ctx.font = '10px NotoSans'
            ctx.fillStyle = 'black'
            ctx.fillText(`恒常:${cts[0]}`, base + 175, start)
            ctx.fillText(`限定:${cts[1]}`, base + 175, start + 15)
            ctx.fillText(`フェス:${cts[2]}`, base + 175, start + 30)
            ctx.font = '18px NotoSans'
            let add = 0
            const days = idol.days
            if (days < 1000) add = add + 10
            if (days < 100) add = add + 10
            if (days < 10) add = add + 10
            ctx.fillText(`${days}`, base + 285 + add, start + 15)
            ctx.font = '10px NotoSans'
            ctx.fillText(`日`, base + 327, start + 15)
            ctx.font = '14px NotoSans'
            ctx.fillText(`${idol.date.slice(2)}`, base + 222, start + 15)
            ctx.beginPath()
            ctx.moveTo(base, start + 35)
            ctx.lineTo(base + 340, start + 35)
            ctx.strokeStyle = '#e0e0e0'
            ctx.lineWidth = 1
            ctx.stroke()
            start = start + 50
        }
        ctx.beginPath()
        ctx.moveTo(base + 168, 65)
        ctx.lineTo(base + 168, start - 15)
        ctx.strokeStyle = '#e0e0e0'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(base + 285, 65)
        ctx.lineTo(base + 285, start - 15)
        ctx.strokeStyle = '#e0e0e0'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(base + 220, 65)
        ctx.lineTo(base + 220, start - 15)
        ctx.strokeStyle = '#e0e0e0'
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(base + 340, 75)
        ctx.lineTo(base + 340, height - 10)
        ctx.strokeStyle = '#e0e0e0'
        ctx.lineWidth = 1
        ctx.stroke()
        base = base + 340
    }
    if (debug) {
        fs.writeFileSync('image.png', image.toBuffer())
    } else {
        await upload(`${moment().format(`YYYY-MM-DD`)}.png`, image.toBuffer())
    }
}
//const idols = JSON.parse(fs.readFileSync('createData.json').toString())
//main(idols, true)
function getColor(type: 'Cu' | 'Co' | 'Pa') {
    if (type === 'Co') return '#2b6acf'
    if (type === 'Cu') return '#cf2ba1'
    if (type === 'Pa') return '#c99a2a'
    return '#000'
}