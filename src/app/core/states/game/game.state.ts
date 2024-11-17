import { inject, Injectable } from '@angular/core';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { Game } from '../../models/game';
import { CreateGame, GetGames } from './game.actions';
import { ApiService } from '../../services/api/api.service';
import { catchError, tap, throwError } from 'rxjs';
import { PlayerState } from '../player/player.state';
import { Player, PlayerInGame } from '../../models/player';
import { CreatePlayer } from '../player/player.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CardService } from '../../services/card/card.service';
import { Deck } from '../../models/card';

export interface GameStateModel {
    list: Game[];
    current: {
        playersInGame: PlayerInGame[]
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

        const actions: CreatePlayer[] = playersToCreate.map((playerToCreate: Partial<Player>) => new CreatePlayer(playerToCreate.name as string));

        return ctx.dispatch(actions).pipe(
            tap(async () => {
                const players = this.store.selectSnapshot(PlayerState.getPlayers);

                const selectedPlayers = players
                    .filter(player => {
                        const isSelected = selectedPlayersId.map(selectedPlayer => selectedPlayer.id).includes(player.id);
                        const isCreated = playersToCreate.map(createdPlayer => createdPlayer.name).includes(player.name);
                        return isSelected || isCreated;
                    });

                const deck = this.cardService.getNewShuffledDeck();
                const dealedDeck = this.cardService.dealDecks(deck, selectedPlayers.length);

                const playersInGame: PlayerInGame[] = selectedPlayers
                    .map((player: Player, index: number) => ({ playerId: player.id, playerName: player.name, deck: dealedDeck[index], score: 0 }));

                ctx.patchState({ current: { playersInGame: playersInGame } });
                await this.router.navigate(['game']);
                ctx.patchState({ loading: false });
            }),
            catchError((error: HttpErrorResponse) => {
                ctx.patchState({ loading: false });
                return throwError(() => error.error);
            })
        )
    }
}
