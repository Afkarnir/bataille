import { TestBed } from '@angular/core/testing';
import {  provideStore,  Store } from '@ngxs/store';
import { PlayerState } from './player.state';
import { Player } from '../../models/player';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api/api.service';
import { of } from 'rxjs';
import { GetGames } from '../game/game.actions';

describe('Player state', () => {
    let store: Store;
    let api: ApiService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideStore([PlayerState]),
          provideHttpClient(),
        ]
      });

      store = TestBed.inject(Store);
      api = TestBed.inject(ApiService);

      spyOn(api, 'getPlayers').and.returnValue(of<Player[]>([
        {
          id: 1,
          name: 'John Doe'
        },
        {
          id: 2,
          name: 'Jane Doe'
        }
      ]));
    });

    it('should create an empty list of players', () => {
      const actual = store.selectSnapshot(PlayerState.getPlayers);
      const expected: Player[] = []
      expect(actual).toEqual(expected);
    });

    it('should get a list of players', () => {
      store.dispatch(GetGames);
      const actual = store.selectSnapshot(PlayerState.getPlayers);
      expect(actual.length).toEqual(2);
    });
});
