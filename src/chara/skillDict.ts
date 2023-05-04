export const skillDict = {
    'Cute Ensemble': 'キュートアンサンブル',
    'Cool Ensemble': 'クールアンサンブル',
    'Passion Ensemble': 'パッションアンサンブル',
    'Mutual': 'ミューチャル',
    'Alternate': 'オルタネイト',
    'Life Sparkle': 'ライフスパークル',
    'Overdrive': 'オーバードライブ',
    // unknown
    'Score Bonus': 'スコアボーナス',
    'Combo Bonus': 'コンボボーナス',
    'Extreme Perfect Lock': 'PERFECTサポート',
    'Combo Support': 'COMBOサポート',
    'Healer': 'ライフ回復',
    'Life Guard': 'ダメージガード',
    'Overload': 'オーバーロード',
    'Concentration': 'コンセントレーション',
    'Skill Boost': 'スキルブースト',
    'Cute Focus': 'キュートフォーカス',
    'Cool Focus': 'クールフォーカス',
    'Passion Focus': 'パッションフォーカス',
    'All-Round': 'オールラウンド',
    'Encore': 'アンコール',
    'Tricolor Synergy': 'トリコロール・シナジー',
    'Coordinate': 'コーディネイト',
    'Tuning': 'チューニング',
    'Perfect Score Bonus': 'スコアアップ(ロング/フリック/スライド)', // include long, flick, slide act
    'Vocal Motif': 'ボーカルモチーフ',
    'Dance Motif': 'ダンスモチーフ',
    'Visual Motif': 'ビジュアルモチーフ',
    'Tricolor Symphony': 'トリコロール・シンフォニー',
    'Refrain': 'リフレイン',
    'Cinderella Magic': 'シンデレラマジック'
}
export const getSkillInJa = (skill: any) => {
    const name = skill.skill_type
    const skillDictAny: any = skillDict
    if (name === 'Perfect Score Bonus') {
        if (skill.explain.match('ロング')) return 'ロングアクト'
        if (skill.explain.match('スライド')) return 'スライドアクト'
        if (skill.explain.match('フリック')) return 'フリックアクト'
    }
    if (skillDictAny[name]) return skillDictAny[name]
    return name
}