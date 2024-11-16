export type Game = {
    id: number,
    scores: Score[]
}

export type GamePayload = {
    items: Score[];
}

export type Score = {
    playerId: number,
    score: number
}