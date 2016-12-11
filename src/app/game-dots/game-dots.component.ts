import {Component, OnInit, Input} from '@angular/core';
import {GameDetails} from "../game";

@Component({
  selector: 'app-game-dots',
  templateUrl: './game-dots.component.html',
  styleUrls: ['./game-dots.component.css']
})
export class GameDotsComponent implements OnInit {

  @Input() game: GameDetails;

  constructor() { }

  ngOnInit() {
  }

}
