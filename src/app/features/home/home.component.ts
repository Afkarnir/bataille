import { afterNextRender, Component, inject, signal } from '@angular/core';
import { select, Store } from '@ngxs/store';
import { GetGames } from '../../core/states/game/game.actions';
import { GameState } from '../../core/states/game/game.state';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { GameCardComponent } from './game-card/game-card.component';
import { TranslatePipe } from '@ngx-translate/core';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { GameSettingsComponent } from './game-settings/game-settings.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProgressSpinnerModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    GameCardComponent,
    TranslatePipe,
    DialogComponent,
    GameSettingsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private store = inject(Store);

  games = select(GameState.getGames);
  loading = select(GameState.getLoading);

  visible = signal(false);

  constructor() {
    afterNextRender(() => {
      this.store.dispatch(new GetGames());
    })
  }
}
