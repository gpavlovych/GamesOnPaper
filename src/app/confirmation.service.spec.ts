/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConfirmationService } from './confirmation.service';

describe('ConfirmationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmationService]
    });
  });

  it('should ...', inject([ConfirmationService], (service: ConfirmationService) => {
    expect(service).toBeTruthy();
  }));
});
