import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { GameState } from '../states/game/game.state';

export const gameGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  const gameState = store.selectSnapshot(GameState.getCurrentGame);
  return !!gameState ? true : router.createUrlTree(['']);
};
