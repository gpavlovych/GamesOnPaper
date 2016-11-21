import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ng2-bootstrap";

@Component({
  selector: 'app-game-tic-tac-toe',
  templateUrl: './game-tic-tac-toe.component.html',
  styleUrls: ['./game-tic-tac-toe.component.css']
})
export class GameTicTacToeComponent implements OnInit {
  @ViewChild("showWinnerModal") public showWinnerModal: ModalDirective;
  rows: number[][];
  result: boolean[][];
  current: number;
  winner: any;
  moves: number;
  constructor() { }

  ngOnInit() {
    this.rows = [[0,0,0],[0,0,0],[0,0,0]];
    this.result = [[false,false,false],[false,false,false],[false,false,false]];
    this.current = 0;
    this.moves = 9;
    this.winner = null;
  }

  checkCell(rowIndex: number, columnIndex: number){
    console.log("rowIndex: "+rowIndex+" columnIndex: "+columnIndex);
    if (this.moves == 0 || this.winner != null || this.rows[rowIndex][columnIndex] != 0) {
      return;
    }

    this.rows[rowIndex][columnIndex] = this.current + 1;
    this.moves--;
    if (this.checkWinner(rowIndex, columnIndex)) {
      this.winner = this.current + 1;
    }

    this.current = (this.current+1)%2;

    if (this.winner != null || this.moves==0){
      this.showWinnerModal.show();
    }
  }

  private checkWinner(rowIndex:number, columnIndex:number): boolean{
    let currentValue = this.rows[rowIndex][columnIndex];
    let result = false;
    //horizontal won
    if (this.rows[0][columnIndex] == currentValue &&
        this.rows[1][columnIndex] == currentValue &&
        this.rows[2][columnIndex] == currentValue) {
      this.result[0][columnIndex] = true;
      this.result[1][columnIndex] = true;
      this.result[2][columnIndex] = true;
      result = true;
    }

    //vertical won
    if (this.rows[rowIndex][0] == currentValue &&
        this.rows[rowIndex][1] == currentValue &&
        this.rows[rowIndex][2] == currentValue) {
      this.result[rowIndex][0] = true;
      this.result[rowIndex][1] = true;
      this.result[rowIndex][2] = true;
      result = true;
    }

    //diagonal won
    if ((rowIndex == columnIndex)||(2-rowIndex == columnIndex)) {
      if (this.rows[0][0] == currentValue &&
        this.rows[1][1] == currentValue &&
        this.rows[2][2] == currentValue) {
        this.result[0][0] = true;
        this.result[1][1] = true;
        this.result[2][2] = true;
        result = true;
      }
      if (this.rows[2][0] == currentValue &&
        this.rows[1][1] == currentValue &&
        this.rows[0][2] == currentValue) {
        this.result[2][0] = true;
        this.result[1][1] = true;
        this.result[0][2] = true;
        result = true;
      }
    }

    return result;
  }
}
