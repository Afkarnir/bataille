import { Component, computed, effect, inject, input } from '@angular/core';
import { PlayerInGame } from '../../../core/models/player';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
import { TitleCasePipe } from '@angular/common';
import { select, Store } from '@ngxs/store';
import { PlayCard } from '../../../core/states/game/game.actions';
import { Card } from 'primeng/card';
import confetti from 'canvas-confetti';
import { GameState } from '../../../core/states/game/game.state';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    ButtonModule,
    TranslatePipe,
    TitleCasePipe,
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {
  private store = inject(Store);

  game = select(GameState.getCurrentGame);

  player = input.required<PlayerInGame>();
  playerTurn = input.required<number>();

  hasPlayed = computed<boolean>(() => !!this.game()?.cardsInPlay.some(cardInPlay => cardInPlay.playerId === this.player().playerId ));
  cardPlayed = computed<Card>(() => this.game()?.cardsInPlay.find(cardInPlay => cardInPlay.playerId === this.player().playerId)?.card as unknown as Card);

  constructor() {
    effect(() => {
      if (this.player() === this.game()?.turnWinner) {
        this.playConfetti();
      }
    });
  }

  playCard() {
    const cardToPlay = this.player().deck[0] as unknown as Card;
    this.store.dispatch(new PlayCard(cardToPlay));
  }

  playConfetti() {
    confetti({
      particleCount: 10,
      spread: 100,
      origin: { y: 0.5 },
      zIndex: 1000
    });
  }
}
