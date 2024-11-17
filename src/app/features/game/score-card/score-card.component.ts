import { TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-score-card',
  standalone: true,
  imports: [
    TranslatePipe,
    TitleCasePipe,
  ],
  templateUrl: './score-card.component.html',
  styleUrl: './score-card.component.scss'
})
export class ScoreCardComponent {
  playerName = input.required<string>();
  score = input.required<number>();
}
