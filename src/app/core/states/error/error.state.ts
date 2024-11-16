import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { ApiError } from '../../models/api';
import { SetError } from './error.actions';

export interface ErrorStateModel {
    error: ApiError | null;
}

@State<ErrorStateModel>({
    name: 'error',
    defaults: {
        error: null
    }
})
@Injectable()
export class ErrorState {

    @Selector()
    static getError(state: ErrorStateModel): ApiError | null {
        return state.error;
    }

    @Selector()
    static isError(state: ErrorStateModel): boolean {
        return !!state.error;
    }

    @Action(SetError)
    setError(ctx: StateContext<ErrorStateModel>, action: SetError) {
        ctx.patchState({ error: action.error });
    }
}
