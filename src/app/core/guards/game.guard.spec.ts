import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';

import { gameGuard } from './game.guard';

import { provideStore, Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { GameState } from '../states/game/game.state';
import { provideHttpClient } from '@angular/common/http';

describe('gameGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => gameGuard(...guardParameters));

  let store: Store;
  let router: Router;

  const activatedRouteSnapshotMock = {} as ActivatedRouteSnapshot;
  const routerStateSnapshotMock = {} as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideStore([GameState]),
        provideHttpClient(),
      ]
    });

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);

    spyOn(store, 'selectSnapshot');
    spyOn(router, 'createUrlTree');
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow activation if game state exists', () => {
    store.selectSnapshot = jasmine.createSpy().and.returnValue({ playerCount: 2, scores: [] });

    expect(executeGuard(activatedRouteSnapshotMock, routerStateSnapshotMock)).toBeTrue();
    expect(store.selectSnapshot).toHaveBeenCalledWith(GameState.getCurrentGame);
  });

  it('should redirect to home if game state does not exist', () => {
    store.selectSnapshot = jasmine.createSpy().and.returnValue(null);

    expect(executeGuard(activatedRouteSnapshotMock, routerStateSnapshotMock)).toEqual(router.createUrlTree(['']));
    expect(store.selectSnapshot).toHaveBeenCalledWith(GameState.getCurrentGame);
    expect(router.createUrlTree).toHaveBeenCalledWith(['']);
  });
});
