import { inject, Injectable } from '@angular/core';
import { State, Selector, createSelector, Action, StateContext } from '@ngxs/store';
import { Player } from '../../models/player';
import { GetGames } from '../game/game.actions';
import { ApiService } from '../../services/api/api.service';
import { tap } from 'rxjs';

export interface PlayerStateModel {
    list: Player[];
}

@State<PlayerStateModel>({
    name: 'player',
    defaults: {
        list: []
    }
})
@Injectable()
export class PlayerState {
    private api = inject(ApiService);

    @Selector()
    static getPlayers(state: PlayerStateModel) {
        return state.list;
    }

    static getPlayerById(id: number) {
        return createSelector([PlayerState], (state: PlayerStateModel) => state.list.find(player => player.id === id));
    }

    @Action(GetGames)
    getPlayers(ctx: StateContext<PlayerStateModel>) {
        return this.api.getPlayers().pipe(
            tap(players => ctx.patchState({ list: players })
        ));
    }
}
