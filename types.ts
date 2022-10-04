export interface IChara {
    type: 'Cu' | 'Co' | 'Pa'
    name: string
    image: string
    count: [number, number, number]
    date: string
    days: number
}