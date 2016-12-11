import {Component, OnInit, ViewChild, Input, OnChanges} from '@angular/core';
import {ModalDirective} from "ng2-bootstrap";
import {GameDetails} from "../game";
import {RefreshService} from "../refresh.service";
import {GameTicTacToeService} from "../game-tic-tac-toe.service";

@Component({
  selector: 'app-game-tic-tac-toe',
  templateUrl: './game-tic-tac-toe.component.html',
  styleUrls: ['./game-tic-tac-toe.component.css']
})
export class GameTicTacToeComponent {
  @Input() game: GameDetails;

  constructor(private refreshService: RefreshService, private gameTicTacToeService: GameTicTacToeService) { }

  checkCell(rowIndex: number, columnIndex: number){
    this.gameTicTacToeService.checkCell({
      rowIndex: rowIndex,
      columnIndex: columnIndex,
      gameId: this.game.id
    }).subscribe(()=>this.refreshService.refresh());
  }
}
