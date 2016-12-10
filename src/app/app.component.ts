import {Component, ViewContainerRef, OnInit} from '@angular/core';
import {ComponentsHelper} from 'ng2-bootstrap/ng2-bootstrap';
import {UserDetails} from './user';
import {GameDefinitionInfo} from './game-definition';
import {GameInfo} from './game'
import {GameService} from "./game.service";
import {RefreshService} from "./refresh.service";
import {GameFinishRequestState} from "./game-finish-request-state.enum";
import {UserInfoService} from "./user-info.service";
import {GameFinishRequestInfo} from "./game-finish-request-info";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  currentUser: UserDetails = null;

  gamesToBeCreated: GameDefinitionInfo[] = [];
  gamesToBeCreatedTop: number = 10;
  gamesToBeCreatedTotalCount: number = 0;

  incomingInvitations: GameInfo[] = [];
  incomingInvitationsTop: number = 5;
  incomingInvitationsTotalCount: number = 0;

  outgoingInvitations: GameInfo[] = [];
  outgoingInvitationsTop: number = 5;
  outgoingInvitationsTotalCount: number = 0;

  activeGames: GameInfo[] = [];
  activeGamesTop: number = 10;
  activeGamesTotalCount: number = 0;

  finishedGames: GameInfo[] = [];
  finishedGamesTop: number = 10;
  finishedGamesTotalCount: number = 0;

  activeFinishRequests: {} = {};

  public constructor(
    componentsHelper: ComponentsHelper,
    vcr: ViewContainerRef,
    private gameService: GameService,
    private refreshService: RefreshService,
    private userInfoService: UserInfoService)
  {
    componentsHelper.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.refresh();
    this.refreshService.getRefresher().subscribe(() => this.refresh());
  }

  private refresh() {
    this.refreshCurrentUser();

    this.refreshGamesToBeCreatedTotalCount();
    this.refreshGamesToBeCreated();

    this.refreshIncomingInvitationsTotalCount();
    this.refreshIncomingInvitations();

    this.refreshOutgoingInvitationsTotalCount();
    this.refreshOutgoingInvitations();

    this.refreshActiveGamesTotalCount();
    this.refreshActiveGames();

    this.refreshFinishedGamesTotalCount();
    this.refreshFinishedGames();
  }

  private refreshFinishedGames() {
    this.finishedGames = [];
    this.gameService.getFinished(0, this.finishedGamesTop).subscribe(data => {
      if (data) {
        this.finishedGames = data;
      }
    });
  }

  private refreshFinishedGamesTotalCount() {
    this.finishedGamesTotalCount = 0;
    this.gameService.getFinishedCount().subscribe(data => this.finishedGamesTotalCount = data);
  }

  private refreshActiveGames() {
    this.activeGames = [];
    this.activeFinishRequests = {};
    this.gameService.getActive(0, this.activeGamesTop).subscribe(data => {
      if (data) {
        this.activeGames = data;
        this.refreshActiveGameFinishedRequests();
      }
    });
  }

  private refreshActiveGamesTotalCount() {
    this.activeGamesTotalCount = 0;
    this.gameService.getActiveCount().subscribe(data => this.activeGamesTotalCount = data);
  }

  private refreshOutgoingInvitations() {
    this.outgoingInvitations = [];
    this.gameService.getOutgoing(0, this.outgoingInvitationsTop).subscribe(data => {
      if (data) {
        this.outgoingInvitations = data;
      }
    });
  }

  private refreshOutgoingInvitationsTotalCount() {
    this.outgoingInvitationsTotalCount = 0;
    this.gameService.getOutgoingCount().subscribe(data => this.outgoingInvitationsTotalCount = data);
  }

  private refreshIncomingInvitations() {
    this.incomingInvitations = [];
    this.gameService.getIncoming(0, this.incomingInvitationsTop).subscribe(data => {
      if (data) {
        this.incomingInvitations = data;
      }
    });
  }

  private refreshIncomingInvitationsTotalCount() {
    this.incomingInvitationsTotalCount = 0;
    this.gameService.getIncomingCount().subscribe(data => this.incomingInvitationsTotalCount = data);
  }

  private refreshGamesToBeCreated() {
    this.gamesToBeCreated = [];
    this.gameService.getGameDefinitions(0, this.gamesToBeCreatedTop).subscribe(data => {
      if (data) {
        this.gamesToBeCreated = data;
      }
    });
  }

  private refreshGamesToBeCreatedTotalCount() {
    this.gamesToBeCreatedTotalCount = 0;
    this.gameService.getGameDefinitionsCount().subscribe(data => this.gamesToBeCreatedTotalCount = data);
  }

  private refreshCurrentUser() {
    this.currentUser = null;
    this.userInfoService.getCurrentUser().subscribe(data => this.currentUser = data);
  }

  private refreshActiveGameFinishedRequests() {
    for (let activeGame of this.activeGames) {
      let activeGameFinishRequest = AppComponent.getActiveFinishRequest(activeGame);
      if (activeGameFinishRequest) {
        this.activeFinishRequests[activeGame.id] = activeGameFinishRequest;
      }
    }
  }

  private static getActiveFinishRequest(game: GameInfo): GameFinishRequestInfo {
    for (let gameRequest of game.finishRequests) {
      if (gameRequest.state == GameFinishRequestState.new) {
        return gameRequest;
      }
    }
    return null;
  }
}
