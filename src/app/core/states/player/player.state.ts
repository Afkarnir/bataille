import { inject, Injectable } from '@angular/core';
import { State, Selector, createSelector, Action, StateContext } from '@ngxs/store';
import { Player } from '../../models/player';
import { GetGames } from '../game/game.actions';
import { ApiService } from '../../services/api/api.service';
import { tap } from 'rxjs';
import { CreatePlayer } from './player.actions';

export interface PlayerStateModel {
    list: Player[];
    loading: boolean;
}

@State<PlayerStateModel>({
    name: 'player',
    defaults: {
        list: [],
        loading: false
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
        ctx.patchState({ loading: true });
        return this.api.getPlayers().pipe(
            tap(players => ctx.patchState({ list: players, loading: false }))
        );
    }
    
    @Action(CreatePlayer)
    createPlayer(ctx: StateContext<PlayerStateModel>, action: CreatePlayer) {
        const state = ctx.getState();
        
        if(state.list.map(player => player.name).includes(action.name)) {
            return;
        }

        ctx.patchState({ loading: true });
        return this.api.postPlayer({ name: action.name }).pipe(
            tap(player => ctx.patchState({ list: [...state.list, player], loading: false }))
        );
    }
}
