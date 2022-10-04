import canvas from 'canvas'
import moment from 'moment'
import upload from './upload'
import { IChara } from '../types'
const { createCanvas, registerFont, loadImage } = canvas

export default async function main(createData: any) {
    const useList = ['7', '6', '5', '4', '3', '2']
    let height = 0
    for (const chances of useList) {
        const idols = createData[chances]
        const thisHeight = idols.length * 50 + 75
        if (thisHeight > height) height = thisHeight
    }
    registerFont('./noto.otf', { family: 'NotoSans' })
    const image = createCanvas(320 * useList.length + 100, height)

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
        ctx.fillText(`内訳`, base + 190, 50)
        ctx.fillText(`経過日数`, base + 250, 40)
        ctx.fillText(`更新日`, base + 250, 54)
        let start = 75
        for (const idol of idols) {
            if (idol.days >= 300) {
                ctx.beginPath()
                ctx.fillStyle = '#d8e5f0'
                ctx.rect( base + 236, start - 15, 84, 50 )
                ctx.fill()
            }
            const image = await loadImage(idol.image)
            ctx.drawImage(image, base + 10, start - 10, 40, 40)
            ctx.font = '18px NotoSans'
            ctx.fillStyle = getColor(idol.type)
            ctx.fillText(idol.name, base + 55, start + 15)
            ctx.font = '12px NotoSans'
            ctx.fillStyle = 'black'
            const cts = idol.count
            ctx.fillText(`恒常:${cts[0]}`, base + 185, start)
            ctx.fillText(`限定:${cts[1]}`, base + 185, start + 15)
            ctx.fillText(`フェス:${cts[2]}`, base + 185, start + 30)
            ctx.font = '22px NotoSans'
            let add = 0
            if (idol.days < 100) add = add + 12
            if (idol.days < 10) add = add + 12
            ctx.fillText(`${idol.days}`, base + 250 + add, start + 10)
            ctx.font = '18px NotoSans'
            ctx.fillText(`日`, base + 290, start + 10)
            ctx.font = '14px NotoSans'
            ctx.fillText(`${idol.date}`, base + 240, start + 30)
            ctx.beginPath()
            ctx.moveTo(base, start + 35)
            ctx.lineTo(base + 320, start + 35)
            ctx.strokeStyle = '#e0e0e0'
            ctx.lineWidth = 1
            ctx.stroke()
            start = start + 50
        }
        ctx.beginPath()
        ctx.moveTo(base + 183, 65)
        ctx.lineTo(base + 183, start - 15)
        ctx.strokeStyle = '#e0e0e0'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(base + 236, 65)
        ctx.lineTo(base + 236, start - 15)
        ctx.strokeStyle = '#e0e0e0'
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(base + 320, 75)
        ctx.lineTo(base + 320, height - 10)
        ctx.strokeStyle = '#e0e0e0'
        ctx.lineWidth = 1
        ctx.stroke()
        base = base + 320
    }
    await upload(`${moment().format(`YYYY-MM-DD`)}.png`, image.toBuffer())
   
}
function getColor(type: 'Cu' | 'Co' | 'Pa') {
    if (type === 'Co') return '#2b6acf'
    if (type === 'Cu') return '#cf2ba1'
    if (type === 'Pa') return '#c99a2a'
    return '#000'
}