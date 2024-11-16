import { Routes } from '@angular/router';
import { gameGuard } from './core/guards/game.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent),
    },
    {
        path: 'game',
        loadComponent: () => import('./features/game/game.component').then(c => c.GameComponent),
        canActivate: [gameGuard],
    },
    {
        path: '**',
        redirectTo: '',
    }
];
