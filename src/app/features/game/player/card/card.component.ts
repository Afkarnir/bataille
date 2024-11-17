import { Component, inject, input } from '@angular/core';
import { Card } from 'primeng/card';
import { PlayCard } from '../../../../core/states/game/game.actions';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    ButtonModule,
    TranslatePipe,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  private store = inject(Store);

  card = input.required<Card>();
  hasPlayed = input.required<boolean>();
  disabled = input.required<boolean>();

  playCard() {
    this.store.dispatch(new PlayCard(this.card()));
  }
}
