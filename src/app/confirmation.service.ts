import { Injectable } from '@angular/core';

@Injectable()
export class ConfirmationService {

  confirm: (message?: string, title?: string) => Promise<boolean>;

}
