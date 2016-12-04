import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { UserDetails } from './user';
import { GameDefinitionInfo } from './game-definition';
import { GameInfo } from './game'
import { GameState } from "./game-state.enum";
import { GameService } from "./game.service";
import { AuthenticationService } from "./authentication.service";
import {UserService} from "./user.service";
import {RefreshService} from "./refresh.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public constructor(
    componentsHelper: ComponentsHelper,
    vcr: ViewContainerRef,
    private gameService: GameService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private refreshService: RefreshService)
  {
    componentsHelper.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.refresh();
    this.refreshService.getRefresher().subscribe(() => this.refresh());
  }

  refresh() {
    this.gamesToBeCreated = [];
    this.gamesToBeCreatedTotalCount = 0;
    this.incomingInvitations = [];
    this.incomingInvitationsTotalCount = 0;
    this.outgoingInvitations = [];
    this.outgoingInvitationsTotalCount = 0;
    this.user = null;

    let userId = this.authenticationService.getAuthorizedUserId();
    if (userId) {
      this.userService.getById(userId).subscribe(data => {
        this.user = data;
        console.log("data");
      });
    }

    this.gameService.getGameDefinitions(0, this.gamesToBeCreatedTop).subscribe(data => this.gamesToBeCreated = data);

    this.gameService.getGameDefinitionsCount().subscribe(data => this.gamesToBeCreatedTotalCount = data);

    this.gameService.getIncoming(0, this.incomingInvitationsTop).subscribe(
      data => {
        this.incomingInvitations = data;
      }
    );

    this.gameService.getIncomingCount().subscribe(
      data => {
        this.incomingInvitationsTotalCount = data;
      }
    );

    this.gameService.getOutgoing(0, this.outgoingInvitationsTop).subscribe(
      data => {
        this.outgoingInvitations = data;
      }
    );

    this.gameService.getOutgoingCount().subscribe(
      data => {
        this.outgoingInvitationsTotalCount = data;
      }
    );

    this.gameService.getActive(0, this.activeGamesTop).subscribe(
      data => {
        this.activeGames = data;
      }
    );

    this.gameService.getActiveCount().subscribe(
      data => {
        this.activeGamesTotalCount = data;
      }
    );

    this.gameService.getFinished(0, this.finishedGamesTop).subscribe(
      data => {
        this.finishedGames = data;
      }
    );

    this.gameService.getFinishedCount().subscribe(
      data => {
        this.finishedGamesTotalCount = data;
      }
    );
  }

  gamesToBeCreated: GameDefinitionInfo[];
  gamesToBeCreatedTop: number = 10;
  gamesToBeCreatedTotalCount: number;

  incomingInvitations: GameInfo[];
  incomingInvitationsTop: number = 5;
  incomingInvitationsTotalCount: number;

  outgoingInvitations: GameInfo[];
  outgoingInvitationsTop: number = 5;
  outgoingInvitationsTotalCount: number;

  activeGames: GameInfo[];
  activeGamesTop: number = 10;
  activeGamesTotalCount: number;

  finishedGames: GameInfo[];
  finishedGamesTop: number = 10;
  finishedGamesTotalCount: number;

  user: UserDetails;
}
