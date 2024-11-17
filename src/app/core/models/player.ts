import { Deck } from "./card";
import { Score } from "./game";

export type Player = {
    id: number;
    name: string;
}

export type PlayerPayload = {
    name: string;
}

export interface PlayerInGame extends Score {
    playerName: string;
    deck: Deck;
};

export type PlayerCard = {
    playerId: number;
    card: number;
}