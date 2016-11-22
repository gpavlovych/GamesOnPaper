import { Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { UserInfo } from './user';
import { GameDefinitionInfo } from './game-definition';
import { GameInfo } from './game'
import { GameState } from "./game-state.enum";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public constructor(componentsHelper: ComponentsHelper, vcr: ViewContainerRef) {
    componentsHelper.setRootViewContainerRef(vcr);
  }

  gamesToBeCreated: GameDefinitionInfo[] = [
    {
      id: 1,
      name: 'tic-tac-toe',
      icon: ''
    },
    {
      id: 2,
      name: 'dots',
      icon: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR1Ik3WDQW4wqZGGfJhaoYr85zKOv9J-4o04ZIksD5L2SNuCYKlOA'
    }];
  incomingInvitations: GameInfo[] = [{
    id: 1000,
    gameDefinition: {
      id: 3,
      name: "tic-tac-toe",
      icon: ""
    },
    state: GameState.new,
    winner: null,
    players: [  {
      id: 112,
      userPic: "",
      userName: "kitty girl"
    },
      {
        id: 32,
        userPic: "",
        userName: "lisa ann"
      }],
    activePlayer: -1
  }];
  incomingInvitationsTotalCount = 11;
  outgoingInvitations: GameInfo[] = [];
  outgoingInvitationsTotalCount = 11;
  activeGames: GameInfo[] = [];
  activeGamesTotalCount = 11;
  finishedGames: GameInfo[] = [];
  finishedGamesTotalCount = 11;
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
  title: string = 'app works!';
  user: UserInfo =
    {
      id: 32,
      userPic: "",
      userName: "lisa ann"
    };//TODO: best approach to user login
}
