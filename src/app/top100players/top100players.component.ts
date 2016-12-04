import { Component, OnInit } from '@angular/core';
import {UserInfo} from "../user";
import {Sex} from "../sex.enum";

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
      sex: Sex.male,
      userName: "kitty girl"
    },
    {
      id: 32,
      userPic: "",
      sex: Sex.female,
      userName: "lisa ann"
    },
    {
      id: 455,
      userPic: "",
      sex: Sex.female,
      userName: "red mistress"
    }];
}
