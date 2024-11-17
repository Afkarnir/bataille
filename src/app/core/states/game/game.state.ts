import { inject, Injectable } from '@angular/core';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { Game, GamePayload } from '../../models/game';
import { CreateGame, EndGame, EndTurn, GetGames, LeaveGame, PlayCard, SaveGame, StartGame, UpdateDecks } from './game.actions';
import { ApiService } from '../../services/api/api.service';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { PlayerState } from '../player/player.state';
import { Player, PlayerCard, PlayerInGame } from '../../models/player';
import { CreatePlayer } from '../player/player.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CardService } from '../../services/card/card.service';
import { Card } from '../../models/card';
import { environment } from '../../../../environments/environment';

export interface GameStateModel {
    list: Game[];
    current: {
        playerTurn: number;
        cardsInPlay: PlayerCard[];
        playersInGame: PlayerInGame[];
        turnWinner: PlayerInGame | null;
        gameWinners: PlayerInGame[] | null;
        isInPause: boolean;
    } | null;
    loading: boolean;
} 

@State<GameStateModel>({
    name: 'game',
    defaults: {
        list: [],
        current: null,
        loading: false,
    }
})
@Injectable()
export class GameState {
    private api = inject(ApiService);
    private store = inject(Store);
    private router = inject(Router);
    private cardService = inject(CardService);

    @Selector()
    static getGames(state: GameStateModel) {
        return state.list;
    }

    @Selector()
    static getCurrentGame(state: GameStateModel) {
        return state.current;
    }

    @Selector()
    static isCurrentGame(state: GameStateModel) {
        return !!state.current;
    }

    @Selector()
    static getLoading(state: GameStateModel) {
        return state.loading;
    }

    @Action(GetGames)
    getGames(ctx: StateContext<GameStateModel>) {
        ctx.patchState({ loading: true });
        return this.api.getGames().pipe(
            tap(games => ctx.patchState({ list: games, loading: false }))
        )
    }

    @Action(CreateGame)
    createGame(ctx: StateContext<GameStateModel>, action: CreateGame) {
        ctx.patchState({ loading: true });

        const playersToCreate = action.players.filter((player: Partial<Player>) => !!player.name);
        const selectedPlayersId = action.players.filter((player: Partial<Player>) => !!player.id);

        const actions: CreatePlayer[] = playersToCreate
            .map((playerToCreate: Partial<Player>) => new CreatePlayer(playerToCreate.name as string));

        return ctx.dispatch(actions).pipe(
            tap(async () => {
                const players = this.store.selectSnapshot(PlayerState.getPlayers);

                const selectedPlayers = players
                    .filter(player => {
                        const isSelected = selectedPlayersId
                            .map(selectedPlayer => selectedPlayer.id)
                            .includes(player.id);
                        const isCreated = playersToCreate
                            .map(createdPlayer => createdPlayer.name)
                            .includes(player.name);
                        return isSelected || isCreated;
                    });

                const deck = this.cardService.getNewShuffledDeck();
                const dealedDeck = this.cardService.dealDecks(deck, selectedPlayers.length);

                const playersInGame: PlayerInGame[] = selectedPlayers
                    .map((player: Player, index: number) => ({
                        playerId: player.id,
                        playerName: player.name,
                        deck: dealedDeck[index],
                        score: 0
                    }));

                ctx.patchState({
                    current: {
                        playersInGame: playersInGame,
                        cardsInPlay: [],
                        playerTurn: playersInGame[0].playerId,
                        turnWinner: null,
                        gameWinners: null,
                        isInPause: false,
                    }
                });

                await this.router.navigate(['game']);
                ctx.patchState({ loading: false });
            }),
            catchError((error: HttpErrorResponse) => {
                ctx.patchState({ loading: false });
                return throwError(() => error.error);
            })
        )
    }

    @Action(StartGame)
    startGame(ctx: StateContext<GameStateModel>) {
        // To be sure that the state is up to date
        const state = () => this.getCurrentGameState(ctx);

        if(state().isInPause && !state().gameWinners) {
            ctx.patchState({
                current: {
                    ...state(),
                    isInPause: false,
                }
            });
        }

        if(state().turnWinner || state().cardsInPlay.length >= state().playersInGame.length) {
            ctx.patchState({
                current: {
                    ...state(),
                    cardsInPlay: [],
                    turnWinner: null,
                }
            });
        }

        ctx.patchState({
            loading: false
        });
    }

    @Action(PlayCard)
    async playCard(ctx: StateContext<GameStateModel>, action: PlayCard) {
        // To be sure that the state is up to date
        const state = () => this.getCurrentGameState(ctx);

        const cardsInPlay: PlayerCard[] = [
            ...state().cardsInPlay,
            {
                playerId: state().playerTurn,
                card: action.card as unknown as Card, // as unknown because ts context is strange in this case
            } as PlayerCard
        ];

        ctx.patchState({
            current: {
                ...state(),
                cardsInPlay: [...cardsInPlay],
            }
        });

        if(cardsInPlay.length === state().playersInGame.length) {
            ctx.patchState({
                current: {
                    ...state(),
                    isInPause: true
                }
            });

            ctx.dispatch(new EndTurn());
        }

        const currentPlayerTurnIndex = state().playersInGame.findIndex(player => player.playerId === state().playerTurn);
        const newPlayerTurnId = state().playersInGame[currentPlayerTurnIndex + 1]?.playerId ?? state().playersInGame[0].playerId;

        ctx.patchState({
            current: {
                ...state(),
                playerTurn: newPlayerTurnId,
            }
        })
    }

    @Action(EndTurn)
    endTurn(ctx: StateContext<GameStateModel>) {
        // To be sure that the state is up to date
        const state = () => this.getCurrentGameState(ctx);

        let winnerId: number = state().cardsInPlay
            .reduce((prev, curr) => {
                const newValue = this.cardService.compareCards(prev.card, curr.card)
                return newValue === prev.card ? prev : curr;
            }, state().cardsInPlay[0]).playerId;


        let newPlayersInGame = [...state().playersInGame];

        let winner: PlayerInGame = {} as PlayerInGame;

        newPlayersInGame = newPlayersInGame.map((player: PlayerInGame) => {
            if(player.playerId === winnerId) {
                player.score += 1;
                winner = player;
            }
            return player;
        });

        ctx.patchState({
            current: {
                ...state(),
                turnWinner: winner,
            }
        });

        
        setTimeout(() => {
            ctx.patchState({
                current: {
                    ...state(),
                    cardsInPlay: [],
                    turnWinner: null,
                    isInPause: false,
                }
            });

            ctx.dispatch(new UpdateDecks());

        }, environment.waitBetweenTurns);
    }

    @Action(UpdateDecks)
    updateDecks(ctx: StateContext<GameStateModel>) {
        const state = ctx.getState().current;
        if(!state) throw new Error('No game in progress');

        let newPlayersInGame = [...state.playersInGame];

        newPlayersInGame = newPlayersInGame.map((player: PlayerInGame) => {
            player.deck = player.deck.splice(1, player.deck.length);
            return player;
        });

        ctx.patchState({
            current: {
                ...state,
                playersInGame: newPlayersInGame,
            }
        });

        if(newPlayersInGame[0].deck.length === 0) {
            ctx.dispatch(new EndGame());
        }
    }

    @Action(EndGame)
    endGame(ctx: StateContext<GameStateModel>) {
        const state = ctx.getState().current;
        if(!state) throw new Error('No game in progress');

        const highScore = state.playersInGame
            .map(player => player.score)
            .reduce((prev, curr) => prev > curr ? prev : curr);

        const winners = state.playersInGame
            .filter(player => player.score === highScore);

        ctx.patchState({
            current: {
                ...state,
                isInPause: true,
                gameWinners: winners,
            }
        });
    }

    @Action(SaveGame)
    saveGame(ctx: StateContext<GameStateModel>) {
        const state = ctx.getState().current;
        if(!state) throw new Error('No game in progress');

        const gamePayload: GamePayload = state.playersInGame.map(player => ({ playerId: player.playerId, score: player.score }));

        ctx.patchState({ loading: true });
        
        return this.api.postGame(gamePayload).pipe(
            switchMap(() => ctx.dispatch(new LeaveGame()))
        );
    }

    @Action(LeaveGame)
    async leaveGame(ctx: StateContext<GameStateModel>) {
        ctx.patchState({ current: null, loading: true });
        return this.router.navigate(['']).then(() => ctx.patchState({ loading: false }));
    }

    getCurrentGameState(ctx: StateContext<GameStateModel>) {
        const currentState = ctx.getState().current;
        if(!currentState) throw new Error('No game in progress');
        return currentState;
    }
}
