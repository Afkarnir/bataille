import { Component, input } from '@angular/core';
import { Game, Score } from '../../../core/models/game';
import { TitleCasePipe } from '@angular/common';
import { PlayerState } from '../../../core/states/player/player.state';
import { select } from '@ngxs/store';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [
    TitleCasePipe,
    IconComponent,
    TranslatePipe,
  ],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss'
})
export class GameCardComponent {
  game = input.required<Game>();

  players = select(PlayerState.getPlayers);

  getPlayerName(playerId: number) {
    return this.players().find(player => player.id === playerId)?.name;
  }

  isWinner(playerScore: number, scores: Score[]) {
    return scores.findIndex(score => playerScore < score.score) === -1;
  }
}
