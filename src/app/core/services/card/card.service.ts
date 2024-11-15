import { Injectable } from '@angular/core';
import { Deck, Card } from '../../models/card';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  getNewDeck(): Deck {
    let deck: Card[] = [];

    for (let i = 0; i < 52; i++) {
      deck.push(i);
    }

    deck = this.shuffle<Card>(deck);

    return deck;
  }

  // implements Fisher-Yates shuffle algorithm because it is known to be faster and less biased than others
  shuffle<T>(array: T[]): T[] {
    const sortedArray = [...array];

    for (let i = array.length - 1; i > 0; i--) {
      // random number between 0 and 1 (better than Math.random() but slower)
      const random = crypto.getRandomValues(new Uint8Array(1))[0] / 255;
      const j = Math.floor(random * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    if(array === sortedArray) {
      return this.shuffle(array);
    }

    return array;
  };
}
