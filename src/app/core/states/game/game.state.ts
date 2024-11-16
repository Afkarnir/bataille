import { inject, Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Game, Score } from '../../models/game';
import { GetGames } from './game.actions';
import { ApiService } from '../../services/api/api.service';
import { tap } from 'rxjs';

export interface GameStateModel {
    list: Game[];
    current: Score[];
    loading: boolean;
}

@State<GameStateModel>({
    name: 'game',
    defaults: {
        list: [],
        current: [],
        loading: false,
    }
})
@Injectable()
export class GameState {
    private api = inject(ApiService);

    @Selector()
    static getGames(state: GameStateModel) {
        return state.list;
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
}
