import { Player } from "../../models/player";

export class GetGames {
    static readonly type = '[Game] Get games';
}

export class CreateGame {
    static readonly type = '[Game] Create game';
    constructor(readonly players: Partial<Player>[]) { }
}