import { Card } from "primeng/card";
import { Player } from "../../models/player";

export class GetGames {
    static readonly type = '[Game] Get games';
}

export class CreateGame {
    static readonly type = '[Game] Create game';
    constructor(readonly players: Partial<Player>[]) { }
}

export class StartGame {
    static readonly type = '[Game] Start game';
}

export class PlayCard {
    static readonly type = '[Game] Play card';
    constructor(readonly card: Card) { }
}

export class EndTurn {
    static readonly type = '[Game] End turn';
}

export class EndGame {
    static readonly type = '[Game] End game';
}

export class SaveGame {
    static readonly type = '[Game] Save game';
}

export class LeaveGame {
    static readonly type = '[Game] Leave game';
}

export class UpdateDecks {
    static readonly type = '[Game] update decks';
}