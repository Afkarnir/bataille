import { TestBed } from '@angular/core/testing';
import {  provideStore,  Store } from '@ngxs/store';
import { PlayerState } from './player.state';
import { Player } from '../../models/player';
import { provideHttpClient } from '@angular/common/http';

describe('Player state', () => {
    let store: Store;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideStore([PlayerState]),
          provideHttpClient(),
        ]
      
      });

      store = TestBed.inject(Store);
    });

    it('should create an empty list of players', () => {
        const actual = store.selectSnapshot(PlayerState.getPlayers);
        const expected: Player[] = []
        expect(actual).toEqual(expected);
    });

});
