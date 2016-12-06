import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import {UserDetails, UserInfo} from './user';
import { GameDefinitionInfo } from './game-definition';
import { GameInfo } from './game'
import { GameState } from "./game-state.enum";
import { GameService } from "./game.service";
import { AuthenticationService } from "./authentication.service";
import {UserService} from "./user.service";
import {RefreshService} from "./refresh.service";
import {AlertService} from "./alert.service";
import {GameFinishRequestState} from "./game-finish-request-state.enum";

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
    private refreshService: RefreshService,
    private alertService: AlertService)
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
    this.activeFinishRequests = {};

    this.outgoingInvitations = [];
    this.outgoingInvitationsTotalCount = 0;

    this.user = null;

    let userId = this.authenticationService.getAuthorizedUserId();
    if (userId) {
      this.userService.getById(userId).subscribe(data => this.user = data);
    }

    this.gameService.getGameDefinitions(0, this.gamesToBeCreatedTop).subscribe(data => this.gamesToBeCreated = data);
    this.gameService.getGameDefinitionsCount().subscribe(data => this.gamesToBeCreatedTotalCount = data);

    this.gameService.getIncoming(0, this.incomingInvitationsTop).subscribe(data => this.incomingInvitations = data);
    this.gameService.getIncomingCount().subscribe(data => this.incomingInvitationsTotalCount = data);

    this.gameService.getOutgoing(0, this.outgoingInvitationsTop).subscribe(data => this.outgoingInvitations = data);
    this.gameService.getOutgoingCount().subscribe(data => this.outgoingInvitationsTotalCount = data);

    this.gameService.getActive(0, this.activeGamesTop).subscribe(data => {
        if (data) {
          this.activeGames = data;
          for (let activeGame of this.activeGames) {
            let activeGameFinishRequest = this.getActiveFinishRequest(activeGame);
            if (activeGameFinishRequest) {
              this.activeFinishRequests[activeGame.id] = activeGameFinishRequest;
            }
          }
        }
      }
    );

    this.gameService.getActiveCount().subscribe(data => this.activeGamesTotalCount = data);

    this.gameService.getFinished(0, this.finishedGamesTop).subscribe(data => this.finishedGames = data);
    this.gameService.getFinishedCount().subscribe(data => this.finishedGamesTotalCount = data);
  }

  getUserInfo(user: UserDetails): UserInfo {
    return {
      id: user.id,
      sex: user.sex,
      userName: user.username,
      userPic: user.userPic
    };
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

  activeFinishRequests: {};
}
