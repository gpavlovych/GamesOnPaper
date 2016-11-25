import { Component, OnInit } from '@angular/core';
import {UserInfo} from "../user";

@Component({
  selector: 'app-top100players',
  templateUrl: './top100players.component.html',
  styleUrls: ['./top100players.component.css']
})
export class Top100playersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  top100Players: UserInfo[] = [
    {
      id: 112,
      userPic: "",
      userName: "kitty girl"
    },
    {
      id: 32,
      userPic: "",
      userName: "lisa ann"
    },
    {
      id: 455,
      userPic: "",
      userName: "red mistress"
    }];
}
