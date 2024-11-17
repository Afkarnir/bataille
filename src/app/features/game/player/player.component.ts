import { afterNextRender, Component, computed, effect, ElementRef, input, viewChild } from '@angular/core';
import { PlayerInGame } from '../../../core/models/player';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
import { TitleCasePipe } from '@angular/common';
import { select } from '@ngxs/store';
import { Card } from 'primeng/card';
import confetti from 'canvas-confetti';
import { GameState } from '../../../core/states/game/game.state';
import { CardComponent } from './card/card.component';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    ButtonModule,
    TranslatePipe,
    TitleCasePipe,
    CardComponent,
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {
  game = select(GameState.getCurrentGame);

  player = input.required<PlayerInGame>();
  playerTurn = input.required<number>();

  hasPlayed = computed<boolean>(() => !!this.game()?.cardsInPlay.some(cardInPlay => cardInPlay.playerId === this.player().playerId ));
  card = computed(() => {
    this.game(); // to update each time game state changes
    return this.player().deck[0] as unknown as Card
  });

  playerCardRef = viewChild.required<CardComponent, ElementRef>(CardComponent, { read: ElementRef });

  constructor() {
    effect(() => {
      if (this.player() === this.game()?.turnWinner) {
        this.playConfetti();
      }
    });
  }

  playConfetti() {
    const data = this.playerCardRef().nativeElement.getBoundingClientRect();

    const x = (data.x + data.width / 2) / (window.visualViewport?.width || 1);
    const y = (data.y + data.height / 2) / (window.visualViewport?.height || 1);

    confetti({
      particleCount: 50,
      spread: 100,
      origin: { y, x },
      zIndex: 1000
    });
  }
}
