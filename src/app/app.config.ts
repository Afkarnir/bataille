import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { provideStore } from '@ngxs/store';
import { GameState } from './core/states/game/game.state';
import { PlayerState } from './core/states/player/player.state';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authenticationInterceptor } from './core/interceptors/authentication/authentication.interceptor';
import { errorInterceptor } from './core/interceptors/error/error.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import {provideTranslateService} from "@ngx-translate/core";
import { ErrorState } from './core/states/error/error.state';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(
      [GameState, PlayerState, ErrorState],
      withNgxsReduxDevtoolsPlugin({ disabled: !isDevMode() }),
      withNgxsStoragePlugin({ keys: '*' })
    ),
    provideHttpClient(withInterceptors([authenticationInterceptor, errorInterceptor])),
    provideAnimations(),
    provideTranslateService({
      defaultLanguage: 'fr'
    })
  ]
};
