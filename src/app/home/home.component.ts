import { Component, OnInit } from '@angular/core';
import {GameDefinitionInfo} from "../game-definition";
import {GameInfo} from "../game";
import {GameState} from "../game-state.enum";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  gamesToBeCreated: GameDefinitionInfo[] = [{
    id: 1,
    icon: "",
    name: "tic-tac toe"
  },{
    id: 2,
    icon: "",
    name: "dots"
  },];
  incomingInvitations: GameInfo[] = [{
    id: 2,
    gameDefinition: {
      id: 1,
      icon: "",
      name: "tic-tac toe"
    },
    winner: null,
    activePlayer: 0,
    state:GameState.new,
    players: [{
      id: 1,
      userName: "lisa ann",
      userPic: ""
    },{
      id: 2,
      userName: "mandingo",
      userPic: ""
    },]
  }];
  outgoingInvitations: GameInfo[] = [{
    id: 2,
    gameDefinition: {
      id: 1,
      icon: "",
      name: "tic-tac toe"
    },
    activePlayer: 0,
    winner: null,
    state:GameState.new,
    players: [{
      id: 1,
      userName: "lisa ann",
      userPic: ""
    },{
      id: 2,
      userName: "mandingo",
      userPic: ""
    },]
  }];
  activeGames: GameInfo[] = [{
    id: 2,
    gameDefinition: {
      id: 1,
      icon: "",
      name: "tic-tac toe"
    },
    winner: null,
    activePlayer: 0,
    state:GameState.active,
    players: [{
      id: 1,
      userName: "lisa ann",
      userPic: ""
    },{
      id: 2,
      userName: "mandingo",
      userPic: ""
    },]
  },{
    id: 3,
    gameDefinition: {
      id: 1,
      icon: "",
      name: "tic-tac toe"
    },
    activePlayer: 0,
    winner: 1,
    state:GameState.active,
    players: [{
      id: 1,
      userName: "lisa ann",
      userPic: ""
    },{
      id: 2,
      userName: "mandingo",
      userPic: ""
    },]
  },{
    id: 4,
    gameDefinition: {
      id: 2,
      icon: "",
      name: "dots"
    },
    activePlayer: 0,
    winner: 0,
    state:GameState.active,
    players: [{
      id: 1,
      userName: "lisa ann",
      userPic: ""
    },{
      id: 2,
      userName: "mandingo",
      userPic: ""
    },]
  }]; finishedGames: GameInfo[] = [{
  id: 5,
  gameDefinition: {
    id: 1,
    icon: "",
    name: "tic-tac toe"
  },
  activePlayer: 0,
  state:GameState.finished,
  winner: 0,
  players: [{
    id: 1,
    userName: "lisa ann",
    userPic: ""
  },{
    id: 2,
    userName: "mandingo",
    userPic: ""
  },]
},{
  id: 6,
  gameDefinition: {
    id: 1,
    icon: "",
    name: "tic-tac toe"
  },
  activePlayer: 0,
  winner: null,
  state:GameState.finished,
  players: [{
    id: 1,
    userName: "lisa ann",
    userPic: ""
  },{
    id: 2,
    userName: "mandingo",
    userPic: ""
  },]
},{
  id: 7,
  gameDefinition: {
    id: 2,
    icon: "",
    name: "dots"
  },
  activePlayer: 0,
  winner: 2,
  state:GameState.finished,
  players: [{
    id: 1,
    userName: "lisa ann",
    userPic: ""
  },{
    id: 2,
    userName: "mandingo",
    userPic: ""
  },]
}];
}
