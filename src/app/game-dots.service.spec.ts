/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GameDotsService } from './game-dots.service';

describe('GameDotsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameDotsService]
    });
  });

  it('should ...', inject([GameDotsService], (service: GameDotsService) => {
    expect(service).toBeTruthy();
  }));
});
