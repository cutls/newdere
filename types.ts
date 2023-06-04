export interface IChara {
    type: 'Cu' | 'Co' | 'Pa'
    name: string
    image: string
    count: [number, number, number]
    date: string
    days: number
}
export interface ISkill {
    skillName: string
    idols: {
        type: 'Cu' | 'Co' | 'Pa'
        name: string
        image: string
        interval: number
        property: 'Vo' | 'Vi' | 'Da'
        since?: string // date
    }[]
}
export type IType = 'limited' | 'noir' | 'blane' | 'normal'
export interface ITweet {
    id_str: string
    text: string
}