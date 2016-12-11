import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {GameTicTacToeMoveViewModel} from "./view-models/game-tic-tac-toe-move-view-model";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";

@Injectable()
export class GameTicTacToeService {

  constructor(private http: Http, private authenticationService: AuthenticationService) {
  }

  checkCell(move: GameTicTacToeMoveViewModel): Observable<any> {
    return this.http.post('/api/games/tictactoe', move, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }
}
