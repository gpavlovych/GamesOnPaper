import {Component, OnInit} from '@angular/core';
import {GameDefinitionInfo} from "../game-definition";
import {GameInfo} from "../game";
import {UserDetails} from "../user";
import {GameService} from "../game.service";
import {RefreshService} from "../refresh.service";
import {GameFinishRequestState} from "../game-finish-request-state.enum";
import {UserInfoService} from "../user-info.service";
import {GameFinishRequestInfo} from "../game-finish-request-info";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  currentUser: UserDetails = null;

  activeFinishRequests: {} = {};

  finishedGames: GameInfo[] = [];
  finishedGamesTop: number = 5;
  finishedGamesTotalCount: number = 0;

  activeGames: GameInfo[] = [];
  activeGamesTop: number = 5;
  activeGamesTotalCount: number = 0;

  outgoingInvitations: GameInfo[] = [];
  outgoingInvitationsTop: number = 5;
  outgoingInvitationsTotalCount: number = 0;

  incomingInvitations: GameInfo[] = [];
  incomingInvitationsTop: number = 5;
  incomingInvitationsTotalCount: number = 0;

  gamesToBeCreated: GameDefinitionInfo[] = [];
  gamesToBeCreatedTop: number = 5;
  gamesToBeCreatedTotalCount: number = 0;

  constructor(private userInfoService: UserInfoService,
              private gameService: GameService,
              private refreshService: RefreshService) {
  }

  ngOnInit() {
    this.refresh();
    this.refreshService.getRefresher().subscribe(() => this.refresh());
  }

  private refresh() {
    this.refreshCurrentUser();
    this.gamesToBeCreatedCurrentPage = 1;
    this.incomingInvitationsCurrentPage = 1;
    this.outgoingInvitationsCurrentPage = 1;
    this.activeGamesCurrentPage = 1;
    this.finishedGamesCurrentPage = 1;
  }

  private refreshCurrentUser() {
    this.userInfoService.getCurrentUser().subscribe(data => this.currentUser = data);
  }

  private refreshFinishedGames() {
    this.gameService.getFinished(this.finishedGamesTop * (this._finishedGamesCurrentPage - 1), this.finishedGamesTop).subscribe(data => {
      if (data) {
        this.finishedGames = data;
      }
    });
  }

  private refreshFinishedGamesTotalCount() {
    this.gameService.getFinishedCount().subscribe(data => this.finishedGamesTotalCount = data);
  }

  private refreshActiveGames() {
    this.gameService.getActive(this.activeGamesTop * (this._activeGamesCurrentPage - 1), this.activeGamesTop).subscribe(data => {
      if (data) {
        this.activeGames = data;
        this.refreshActiveGameFinishedRequests();
      }
    });
  }

  private refreshActiveGamesTotalCount() {
    this.gameService.getActiveCount().subscribe(data => this.activeGamesTotalCount = data);
  }

  private refreshOutgoingInvitations() {
    this.gameService.getOutgoing(this.outgoingInvitationsTop * (this._outgoingInvitationsCurrentPage - 1), this.outgoingInvitationsTop).subscribe(
      data => {
        this.outgoingInvitations = data;
      }
    );
  }

  private refreshOutgoingInvitationsTotalCount() {
    this.gameService.getOutgoingCount().subscribe(
      data => {
        this.outgoingInvitationsTotalCount = data;
      }
    );
  }

  private refreshIncomingInvitations() {
    this.gameService.getIncoming(this.incomingInvitationsTop * (this._incomingInvitationsCurrentPage - 1), this.incomingInvitationsTop).subscribe(data => {
      if (data) {
        this.incomingInvitations = data;
      }
    });
  }

  private refreshIncomingInvitationsTotalCount() {
    this.gameService.getIncomingCount().subscribe(data => this.incomingInvitationsTotalCount = data);
  }

  private refreshGameToBeCreated() {
    this.gameService.getGameDefinitions(this.gamesToBeCreatedTop * (this._gamesToBeCreatedCurrentPage - 1), this.gamesToBeCreatedTop).subscribe(data => {
      if (data) {
        this.gamesToBeCreated = data;
      }
    });
  }

  private refreshGameToBeCreatedTotalCount() {
    this.gameService.getGameDefinitionsCount().subscribe(data => this.gamesToBeCreatedTotalCount = data);
  }

  private static getActiveFinishRequest(game: GameInfo): GameFinishRequestInfo {
    for (let gameRequest of game.finishRequests) {
      if (gameRequest.state == GameFinishRequestState.new){
        return gameRequest;
      }
    }
    return null;
  }

  private refreshActiveGameFinishedRequests() {
    this.activeFinishRequests = {};
    for (let activeGame of this.activeGames) {
      let activeGameFinishRequest = HomeComponent.getActiveFinishRequest(activeGame);
      if (activeGameFinishRequest) {
        this.activeFinishRequests[activeGame.id] = activeGameFinishRequest;
      }
    }
  }

  private _finishedGamesCurrentPage: number = 1;

  get finishedGamesCurrentPage(): number {
    return this._finishedGamesCurrentPage;
  }

  set finishedGamesCurrentPage(value: number) {
    this._finishedGamesCurrentPage = value;
    this.refreshFinishedGames();
    this.refreshFinishedGamesTotalCount();
  }

  private _activeGamesCurrentPage: number = 1;

  get activeGamesCurrentPage(): number {
    return this._activeGamesCurrentPage;
  }

  set activeGamesCurrentPage(value: number) {
    this._activeGamesCurrentPage = value;
    this.refreshActiveGames();
    this.refreshActiveGamesTotalCount();
  }

  private _outgoingInvitationsCurrentPage: number = 1;

  get outgoingInvitationsCurrentPage(): number {
    return this._outgoingInvitationsCurrentPage;
  }

  set outgoingInvitationsCurrentPage(value: number) {
    this._outgoingInvitationsCurrentPage = value;
    this.refreshOutgoingInvitations();
    this.refreshOutgoingInvitationsTotalCount();
  }

  private _incomingInvitationsCurrentPage: number = 1;

  get incomingInvitationsCurrentPage() {
    return this._incomingInvitationsCurrentPage;
  }

  set incomingInvitationsCurrentPage(value: number) {
    this._incomingInvitationsCurrentPage = value;
    this.refreshIncomingInvitations();
    this.refreshIncomingInvitationsTotalCount();
  }

  private _gamesToBeCreatedCurrentPage: number = 1;

  get gamesToBeCreatedCurrentPage(): number {
    return this._gamesToBeCreatedCurrentPage;
  }

  set gamesToBeCreatedCurrentPage(value: number) {
    this._gamesToBeCreatedCurrentPage = value;
    this.refreshGameToBeCreated();
    this.refreshGameToBeCreatedTotalCount();
  }
}
