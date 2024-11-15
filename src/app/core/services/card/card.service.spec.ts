import { TestBed } from '@angular/core/testing';
import { CardService } from './card.service';

describe('CardService', () => {
  let service: CardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get new deck of 52 cards', () => {
    expect(service.getNewDeck().length).toBe(52);
  });

  it('should be shuffled', () => {
    let arrayToShuffle: number[] = []
    let sortedArray: number[] = []

    for (let i = 0; i < 10; i++) {
      sortedArray.push(i);
      arrayToShuffle.push(i);
    }

    arrayToShuffle = service.shuffle(arrayToShuffle);

    expect(arrayToShuffle).not.toEqual(sortedArray);
  });
});
