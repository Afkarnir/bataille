export type Game = {
    id: number,
    scores: Score[]
}

export type GamePayload = Score[];

export type Score = {
    playerId: number,
    score: number
}