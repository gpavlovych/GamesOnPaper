import { Injectable } from '@angular/core';
import {GameDotsMoveViewModel} from "./view-models/game-dots-move-view-model";
import {Observable} from "rxjs";
import {Http, Response} from "@angular/http";
import {AuthenticationService} from "./authentication.service";

@Injectable()
export class GameDotsService {

  constructor(private http: Http, private authenticationService: AuthenticationService) {
  }

  makeTurn(move: GameDotsMoveViewModel): Observable<any> {
    return this.http.post('/api/games/dots', move, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

}
