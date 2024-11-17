import { afterNextRender, Component, computed, effect, inject } from '@angular/core';
import { select, Store } from '@ngxs/store';
import { GameState } from '../../core/states/game/game.state';
import { PlayerComponent } from './player/player.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { LeaveGame, SaveGame, StartGame } from '../../core/states/game/game.actions';
import { TitleCasePipe } from '@angular/common';
import confetti from 'canvas-confetti';
import { ScoreCardComponent } from './score-card/score-card.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    PlayerComponent,
    ProgressSpinnerModule,
    DialogComponent,
    TranslatePipe,
    ButtonModule,
    TitleCasePipe,
    ScoreCardComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  private store = inject(Store);

  game = select(GameState.getCurrentGame);
  loading = select(GameState.getLoading);

  visible = computed(() => !!this.game()?.gameWinners);

  constructor() {
    afterNextRender(() => this.store.dispatch(new StartGame()));

    effect(() => {
      if (this.game()?.gameWinners) {
        this.playConfetti();
      }
    });
  }

  save() {
    this.store.dispatch(new SaveGame());
  }

  leave() {
    this.store.dispatch(new LeaveGame());
  }

  playConfetti() {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5 },
      zIndex: 1000
    });
  }
}
