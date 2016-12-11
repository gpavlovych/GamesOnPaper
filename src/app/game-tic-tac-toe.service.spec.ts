/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GameTicTacToeService } from './game-tic-tac-toe.service';

describe('GameTicTacToeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameTicTacToeService]
    });
  });

  it('should ...', inject([GameTicTacToeService], (service: GameTicTacToeService) => {
    expect(service).toBeTruthy();
  }));
});
