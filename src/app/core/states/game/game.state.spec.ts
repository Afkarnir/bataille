import { TestBed } from '@angular/core/testing';
import {  provideStore,  Store } from '@ngxs/store';
import { GameState } from './game.state';
import { Game } from '../../models/game';
import { provideHttpClient } from '@angular/common/http';

describe('Game state', () => {
    let store: Store;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideStore([GameState]),
          provideHttpClient(),
        ]
      });

      store = TestBed.inject(Store);
    });

    it('should create an empty list of games', () => {
        const actual = store.selectSnapshot(GameState.getGames);
        const expected: Game[] = [];
        expect(actual).toEqual(expected);
    });

});
