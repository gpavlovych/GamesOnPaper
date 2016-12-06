import { Component, OnInit } from '@angular/core';
import { GameDefinitionInfo } from "../game-definition";
import { GameInfo } from "../game";
import {UserDetails, UserInfo} from "../user";
import { AuthenticationService } from "../authentication.service";
import { GameService } from "../game.service";
import { UserService } from "../user.service";
import {RefreshService} from "../refresh.service";
import {AlertService} from "../alert.service";
import {GameFinishRequestState} from "../game-finish-request-state.enum";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService,
              private gameService: GameService,
              private userService: UserService,
              private refreshService: RefreshService,
              private alertService: AlertService) {
    this.inited = false;

    this.finishedGames = [];
    this._finishedGamesCurrentPage = 1;
    this.finishedGamesTotalCount = 0;

    this.incomingInvitations = [];
    this._incomingInvitationsCurrentPage = 1;
    this.incomingInvitationsTotalCount = 0;

    this.gamesToBeCreated = [];
    this._gamesToBeCreatedCurrentPage = 1;
    this.gamesToBeCreatedTotalCount = 0;

    this.outgoingInvitations = [];
    this._outgoingInvitationsCurrentPage = 1;
    this.outgoingInvitationsTotalCount = 0;

    this.activeGames = [];
    this._activeGamesCurrentPage = 1;
    this.activeGamesTotalCount = 0;
  }

  ngOnInit() {
    if (!this.inited) {
      this.refresh();
      this.refreshService.getRefresher().subscribe(() => this.refresh());
      this.inited = true;
    }
  }

  inited: boolean;

  refresh() {
    this.user = null;
    let userId = this.authenticationService.getAuthorizedUserId();

    if (userId == null) {
      return;
    }

    this.userService.getById(userId).subscribe(
      user => {
        this.user = user;
      });

    this.refreshGameToBeCreatedTotalCount();
    this.refreshGameToBeCreated();

    this.refreshIncomingInvitationsTotalCount();
    this.refreshIncomingInvitations();

    this.refreshOutgoingInvitationsTotalCount();
    this.refreshOutgoingInvitations();

    this.refreshActiveGamesTotalCount();
    this.refreshActiveGames();

    this.refreshFinishedGamesTotalCount();
    this.refreshFinishedGames();
  }

  private _finishedGamesCurrentPage: number;

  get finishedGamesCurrentPage(): number {
    return this._finishedGamesCurrentPage;
  }

  set finishedGamesCurrentPage(value: number) {
    this._finishedGamesCurrentPage = value;
    this.refreshFinishedGames();
    this.refreshFinishedGamesTotalCount();
  }

  finishedGames: GameInfo[];
  finishedGamesTop: number = 5;
  finishedGamesTotalCount: number;

  private refreshFinishedGames() {
    this.gameService.getFinished(this.finishedGamesTop * (this._finishedGamesCurrentPage - 1), this.finishedGamesTop).subscribe(
      data => {
        this.finishedGames = data;
      }
    );
  }

  private refreshFinishedGamesTotalCount() {
    this.gameService.getFinishedCount().subscribe(
      data => {
        this.finishedGamesTotalCount = data;
      }
    );
  }

  private _activeGamesCurrentPage: number;

  get activeGamesCurrentPage(): number {
    return this._activeGamesCurrentPage;
  }

  set activeGamesCurrentPage(value: number) {
    this._activeGamesCurrentPage = value;
    this.refreshActiveGames();
    this.refreshActiveGamesTotalCount();
  }

  activeGames: GameInfo[];
  activeGamesTop: number = 5;
  activeGamesTotalCount: number;

  private refreshActiveGames() {
    this.activeGames = [];
    this.activeFinishRequests={};

    this.gameService.getActive(this.activeGamesTop * (this.activeGamesCurrentPage - 1), this.activeGamesTop).subscribe(
      data => {
        if (data) {
          this.activeGames = data;
          this.refreshActiveGameFinishedRequests();
        }
      }
    );
  }

  private refreshActiveGamesTotalCount() {
    this.gameService.getActiveCount().subscribe(
      data => {
        this.activeGamesTotalCount = data;
      }
    );
  }

  private _outgoingInvitationsCurrentPage: number;

  get outgoingInvitationsCurrentPage(): number {
    return this._outgoingInvitationsCurrentPage;
  }

  set outgoingInvitationsCurrentPage(value: number) {
    this._outgoingInvitationsCurrentPage = value;
    this.refreshOutgoingInvitations();
    this.refreshOutgoingInvitationsTotalCount();
  }

  outgoingInvitations: GameInfo[];
  outgoingInvitationsTop: number = 5;
  outgoingInvitationsTotalCount: number;

  private refreshOutgoingInvitations() {
    this.gameService.getOutgoing(this.outgoingInvitationsTop * (this.outgoingInvitationsCurrentPage - 1), this.outgoingInvitationsTop).subscribe(
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

  private _incomingInvitationsCurrentPage: number;

  get incomingInvitationsCurrentPage() {
    return this._incomingInvitationsCurrentPage;
  }

  set incomingInvitationsCurrentPage(value: number) {
    this._incomingInvitationsCurrentPage = value;
    this.refreshIncomingInvitations();
    this.refreshIncomingInvitationsTotalCount();
  }

  incomingInvitations: GameInfo[];
  incomingInvitationsTop: number = 5;
  incomingInvitationsTotalCount: number;

  private refreshIncomingInvitations() {
    this.gameService.getIncoming(this.incomingInvitationsTop * (this.incomingInvitationsCurrentPage - 1), this.incomingInvitationsTop).subscribe(
      data => {
        this.incomingInvitations = data;
      }
    );
  }

  private refreshIncomingInvitationsTotalCount() {
    this.gameService.getIncomingCount().subscribe(
      data => {
        this.incomingInvitationsTotalCount = data;
      }
    );
  }

  private _gamesToBeCreatedCurrentPage: number;

  get gamesToBeCreatedCurrentPage(): number {
    return this._gamesToBeCreatedCurrentPage;
  }

  set gamesToBeCreatedCurrentPage(value: number) {
    this._gamesToBeCreatedCurrentPage = value;
    this.refreshGameToBeCreated();
    this.refreshGameToBeCreatedTotalCount();
  }

  gamesToBeCreated: GameDefinitionInfo[];
  gamesToBeCreatedTop: number = 5;
  gamesToBeCreatedTotalCount: number;

  private refreshGameToBeCreated() {
    this.gameService.getGameDefinitions(this.gamesToBeCreatedTop * (this.gamesToBeCreatedCurrentPage - 1), this.gamesToBeCreatedTop).subscribe(
      data => {
        this.gamesToBeCreated = data;
      }
    );
  }

  private refreshGameToBeCreatedTotalCount() {
    this.gameService.getGameDefinitionsCount().subscribe(
      data => {
        this.gamesToBeCreatedTotalCount = data;
      }
    );
  }

  getUserName(user: UserInfo) {
    if (this.authenticationService.getAuthorizedUserId() == user.id){
      return "yourself";
    }
    else {
      return user.userName;
    }
  }

  accept(game: GameInfo) {
    this.gameService.accept(game.id).subscribe(() => {
      this.alertService.successWithLink("You've just accepted the game invitation from "+this.getUserName(game.players[0]), "/game/"+game.id, "Go to game");
      this.refreshService.refresh();
    });
  }

  decline(game: GameInfo) {
    this.gameService.decline(game.id).subscribe(() => {
      this.alertService.successWithLink("You've just declined the game invitation from "+this.getUserName(game.players[0]), "/game/"+game.id, "Go to game");
      this.refreshService.refresh();
    });
  }

  finish(game: GameInfo) {
    this.gameService.requestFinish({gameId: game.id}).subscribe(()=>{
      this.alertService.success("You've just requested the game finish");
      this.refreshService.refresh();
    });
  }

  finishApprove(gameFinishRequestId: any) {
    this.gameService.requestFinishApprove(gameFinishRequestId).subscribe(()=>{
      this.alertService.success("You've just approved the game finish request");
      this.refreshService.refresh();
    });
  }

  finishDecline(gameFinishRequestId: any) {
    this.gameService.requestFinishDecline(gameFinishRequestId).subscribe(()=>{
      this.alertService.success("You've just declined the game finish request");
      this.refreshService.refresh();
    });
  }

  private getActiveFinishRequest(game: GameInfo){
    for (let gameRequest of game.finishRequests){
      if (gameRequest.state == GameFinishRequestState.new){
        return gameRequest;
      }
    }
    return null;
  }

  private refreshActiveGameFinishedRequests() {
    for (let activeGame of this.activeGames) {
      let activeGameFinishRequest = this.getActiveFinishRequest(activeGame);
      if (activeGameFinishRequest) {
        this.activeFinishRequests[activeGame.id] = activeGameFinishRequest;
      }
    }
  }

  activeFinishRequests: {};
  user: UserDetails;//TODO: best approach to user login
}
