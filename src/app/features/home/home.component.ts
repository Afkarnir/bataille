import { afterNextRender, Component, inject, signal } from '@angular/core';
import { select, Store } from '@ngxs/store';
import { GetGames } from '../../core/states/game/game.actions';
import { GameState } from '../../core/states/game/game.state';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { GameCardComponent } from './game-card/game-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProgressSpinnerModule,
    ButtonModule,
    InputTextModule,
    GameCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private store = inject(Store);

  games = select(GameState.getGames);
  loading = select(GameState.getLoading);


  constructor() {
    afterNextRender(() => {
      this.store.dispatch(new GetGames());
    })
  }
}
