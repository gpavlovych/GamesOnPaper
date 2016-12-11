import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {GameTicTacToeMoveViewModel} from "./view-models/game-tic-tac-toe-move-view-model";
import {Observable} from "rxjs";

@Injectable()
export class GameTicTacToeService {

  constructor(private http: Http) {
  }

  checkCell(move: GameTicTacToeMoveViewModel): Observable<any> {
    return this.http.post('/api/games/tictactoe', move);
  }
}
