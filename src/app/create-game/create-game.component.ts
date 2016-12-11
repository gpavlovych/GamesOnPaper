import { Component, OnInit } from '@angular/core';
import {UserInfo, UserDetails} from "../user";
import {GameDefinitionDetails} from "../game-definition";
import {GameService} from "../game.service";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../user.service";
import {AlertService} from "../alert.service";
import {GameTicTacToeData} from "../game-tic-tac-toe/game-tic-tac-toe-data";
import {GameDetails} from "../game";
import {ConfirmationService} from "../confirmation.service";
import {CreateGameViewModel} from "../view-models/create-game-view-model";
import {AuthenticationService} from "../authentication.service";
import {RefreshService} from "../refresh.service";
import {UserInfoService} from "../user-info.service";

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {

  private sub: any;

  private currentUser: UserDetails = null;

  users: UserInfo[] = [];
  usersTop: number = 10;
  usersTotalCount: number = 0;
  gameDefinition: GameDefinitionDetails = null;
  gameDefinitionId: any = null;

  constructor(private gameService: GameService,
              private userService: UserService,
              private alertService: AlertService,
              private route: ActivatedRoute,
              private confirmationService: ConfirmationService,
              private refreshService: RefreshService,
              private userInfoService: UserInfoService) {
  }

  // Load data ones componet is ready
  ngOnInit() {
    // Subscribe to route params
    this.sub = this.route.params.subscribe(params => {
      this.gameDefinitionId = params['id'];
      this.refresh();
      this.refreshService.getRefresher().subscribe(() => this.refresh());
    });
  }

  ngOnDestroy() {
    // Clean sub to avoid memory leak
    this.sub.unsubscribe();
  }

  private refresh() {
    this.refreshCurrentUser();
    this.refreshGameDefinition();
    this.usersCurrentPage = 1;
  }

  private refreshGameDefinition() {
    this.gameService.getGameDefinitionDetails(this.gameDefinitionId).subscribe(data => this.gameDefinition = data);
  }

  private refreshCurrentUser() {
    this.userInfoService.getCurrentUser().subscribe(data => this.currentUser = data);
  }

  private refreshUsers() {
    this.userService.getAll(this.usersTop * (this._usersCurrentPage - 1), this.usersTop).subscribe(data => {
      if (data) {
        this.users = data
      }
    });
  }

  private refreshUsersTotalCount() {
    this.userService.getAllCount().subscribe(data => this.usersTotalCount = data);
  }

  private _usersCurrentPage: number = 1;

  get usersCurrentPage(): number {
    return this._usersCurrentPage;
  }

  set usersCurrentPage(value: number) {
    this._usersCurrentPage = value;
    this.refreshUsersTotalCount();
    this.refreshUsers();
  }

  inviteUser(user: UserInfo) {
    if (this.currentUser != null) {
      let isOtherUser = user.id != this.currentUser.id;
      let confirmationMessage: string;
      if (isOtherUser) {
        confirmationMessage = "Do you really want to play with user " + user.userName + "?";
      }
      else {
        confirmationMessage = "Do you really want to play with yourself?"
      }

      this.confirmationService.confirm(confirmationMessage, "Invite user").then(isOk => {
        if (isOk) {
          this.gameService.create(<CreateGameViewModel>{
            playerIds: [user.id],
            gameDefinitionId: this.gameDefinition.id
          }).subscribe(gameId => {
            let alertMessage: string;
            if (isOtherUser) {
              alertMessage = "You've just invited user " + user.userName + " to play the " + this.gameDefinition.name + "!";
            }
            else {
              alertMessage = "You've just started playing the " + this.gameDefinition.name + " with yourself";
            }

            this.alertService.successWithLink(alertMessage, "/game/" + gameId, "Go to game");
            this.refreshService.refresh();
          });
        }
      });
    }
  }
}
