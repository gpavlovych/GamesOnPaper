import { Injectable } from '@angular/core';
import {Subject, Observable} from "rxjs";

@Injectable()
export class RefreshService {

  private subject = new Subject<any>();

  constructor() {
  }

  public getRefresher(): Observable<any> {
    return this.subject;
  }

  public refresh(){
    this.subject.next();
  }
}
