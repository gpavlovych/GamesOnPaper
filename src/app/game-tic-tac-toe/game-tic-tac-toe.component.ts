import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ng2-bootstrap";
import {GameDetails} from "../game";
import {GameState} from "../game-state.enum";
import {GameTicTacToeData} from "./game-tic-tac-toe-data";
import {Sex} from "../sex.enum";

@Component({
  selector: 'app-game-tic-tac-toe',
  templateUrl: './game-tic-tac-toe.component.html',
  styleUrls: ['./game-tic-tac-toe.component.css']
})
export class GameTicTacToeComponent implements OnInit {
  @ViewChild("showWinnerModal") public showWinnerModal: ModalDirective;

  game: GameDetails<GameTicTacToeData>;

  constructor() { }

  ngOnInit() {//TODO: http://hostname/tictactoe/<gameId>
    this.game = {
      id: 1,
      gameDefinition: {
        id: 1,
        name: 'tic-tac-toe',
        icon: ''
      },
      players: [{
        id: 1,
        userName: 'lisa ann',
        sex: Sex.female,
        userPic: '',
      }, {
        id: 2,
        userName: 'mandingo',
        sex: Sex.male,
        userPic: ''
      }],
      state: GameState.active,
      activePlayer: 0,
      winner: null,
      data: {
        rows: [
          [null, null, null],
          [null, null, null],
          [null, null, null]],
        result: [
          [false, false, false],
          [false, false, false],
          [false, false, false]],
        moves: 9
      }
    };
  }

  checkCell(rowIndex: number, columnIndex: number){
    if (this.game.state != GameState.active || this.game.data.rows[rowIndex][columnIndex] != null) {
      return;
    }

    this.game.data.rows[rowIndex][columnIndex] = this.game.activePlayer;
    this.game.data.moves--;

    if (this.checkWinner(rowIndex, columnIndex)) {
      this.game.winner = this.game.activePlayer;
      this.game.state = GameState.finished;
    }

    if (this.game.data.moves==0){
      this.game.state = GameState.finished;
    }

    if (this.game.state==GameState.finished){
      this.showWinnerModal.show();
    }

    this.game.activePlayer = (this.game.activePlayer + 1)%2;
  }

  private checkWinner(rowIndex:number, columnIndex:number): boolean{
    let currentValue = this.game.data.rows[rowIndex][columnIndex];
    let result = false;

    //horizontal won
    if (this.game.data.rows[0][columnIndex] == currentValue &&
        this.game.data.rows[1][columnIndex] == currentValue &&
        this.game.data.rows[2][columnIndex] == currentValue) {
      this.game.data.result[0][columnIndex] = true;
      this.game.data.result[1][columnIndex] = true;
      this.game.data.result[2][columnIndex] = true;
      result = true;
    }

    //vertical won
    if (this.game.data.rows[rowIndex][0] == currentValue &&
        this.game.data.rows[rowIndex][1] == currentValue &&
        this.game.data.rows[rowIndex][2] == currentValue) {
      this.game.data.result[rowIndex][0] = true;
      this.game.data.result[rowIndex][1] = true;
      this.game.data.result[rowIndex][2] = true;
      result = true;
    }

    //diagonal won
    if ((rowIndex == columnIndex)||(2-rowIndex == columnIndex)) {
      if (this.game.data.rows[0][0] == currentValue &&
        this.game.data.rows[1][1] == currentValue &&
        this.game.data.rows[2][2] == currentValue) {
        this.game.data.result[0][0] = true;
        this.game.data.result[1][1] = true;
        this.game.data.result[2][2] = true;
        result = true;
      }
      if (this.game.data.rows[2][0] == currentValue &&
        this.game.data.rows[1][1] == currentValue &&
        this.game.data.rows[0][2] == currentValue) {
        this.game.data.result[2][0] = true;
        this.game.data.result[1][1] = true;
        this.game.data.result[0][2] = true;
        result = true;
      }
    }

    return result;
  }
}
