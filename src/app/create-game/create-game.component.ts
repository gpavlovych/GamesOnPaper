import { Component, OnInit } from '@angular/core';
import {UserInfo} from "../user";
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

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {

  private sub: any;
  constructor(
    private gameService: GameService,
    private userService: UserService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private authenticationService: AuthenticationService,
    private refreshService: RefreshService) {
    this.gameDefinition = null;
    this.users = [];
    this._usersCurrentPage = 1;
    this.usersTop = 10;
    this.usersTotalCount = 0;
  }

  // Load data ones componet is ready
  ngOnInit() {
    // Subscribe to route params
    this.sub = this.route.params.subscribe(params => {

      let id = params['id'];

      this.gameService.getGameDefinitionDetails(id).subscribe(data => this.gameDefinition = data);

      this.refresh();
      this.refreshService.getRefresher().subscribe(() => this.refresh());
    });
  }

  ngOnDestroy() {
    // Clean sub to avoid memory leak
    this.sub.unsubscribe();
  }

  private refresh() {
    this.refreshGameToBeCreated();
    this.refreshGameToBeCreatedTotalCount();
  }

  private _usersCurrentPage: number;

  get usersCurrentPage(): number {
    return this._usersCurrentPage;
  }

  set usersCurrentPage(value: number) {
    this._usersCurrentPage = value;
    this.refreshGameToBeCreated();
    this.refreshGameToBeCreatedTotalCount();
  }

  users: UserInfo[];
  usersTop: number = 5;
  usersTotalCount: number;

  private refreshGameToBeCreated() {
    this.userService.getAll(this.usersTop * (this.usersCurrentPage - 1), this.usersTop).subscribe(
      data => {
        this.users = data;
      }
    );
  }

  private refreshGameToBeCreatedTotalCount() {
    this.userService.getAllCount().subscribe(
      data => {
        this.usersTotalCount = data;
      }
    );
  }
  inviteUser(user: UserInfo) {
    let currentUserId = this.authenticationService.getAuthorizedUserId();
    this.confirmationService.confirm("Do you "+currentUserId+" really want to play with user " + user.id + "?", "Invite user").then(result => {
      if (result) {
        this.gameService.create(<CreateGameViewModel>{
          playerIds: [
            currentUserId,
            user.id
          ],
          gameDefinitionId: this.gameDefinition.id
        }).subscribe(gameId => {
          this.alertService.success("You've just invited user " + user.userName+"; game with id "+gameId+" is created "); //TODO: message
          this.refreshService.refresh();
        });
      }
    });
  }
gameDefinition: GameDefinitionDetails;
}
