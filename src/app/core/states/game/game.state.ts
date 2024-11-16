import { inject, Injectable } from '@angular/core';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { Game, Score } from '../../models/game';
import { CreateGame, GetGames } from './game.actions';
import { ApiService } from '../../services/api/api.service';
import { catchError, forkJoin, takeLast, tap, throwError } from 'rxjs';
import { PlayerState } from '../player/player.state';
import { Player } from '../../models/player';
import { CreatePlayer } from '../player/player.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../../models/api';
import { Router } from '@angular/router';

export interface GameStateModel {
    list: Game[];
    current: {
        playerCount: number;
        scores: Score[]
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
        const selectedPlayers = action.players.filter((player: Partial<Player>) => !!player.id);

        let actions: CreatePlayer[] = [];
        playersToCreate.forEach((playerToCreate: Partial<Player>) => actions.push(new CreatePlayer(playerToCreate.name as string)));

        return ctx.dispatch(actions).pipe(
            tap(() => {
                const players = this.store.selectSnapshot(PlayerState.getPlayers);

                const scores: Score[] = players
                    .filter(player => playersToCreate.map(createdPlayer => createdPlayer.name).includes(player.name))
                    .map(player => ({ playerId: player.id, score: 0 }) as Score)
                    .concat(selectedPlayers.map(selectedPlayer => ({ playerId: selectedPlayer.id, score: 0 }) as Score));

                ctx.patchState({ current: { playerCount: players.length, scores }, loading: false });
                this.router.navigate(['game']);
            }),
            catchError((error: HttpErrorResponse) => {
                ctx.patchState({ loading: false });
                return throwError(() => error.error);
            })
        )
    }
}
