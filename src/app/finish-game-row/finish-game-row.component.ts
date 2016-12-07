import {Component, OnInit, Input} from '@angular/core';
import {GameInfo} from "../game";

@Component({
  selector: 'app-finish-game-row',
  templateUrl: './finish-game-row.component.html',
  styleUrls: ['./finish-game-row.component.css']
})
export class FinishGameRowComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() finishedGame: GameInfo;
}
