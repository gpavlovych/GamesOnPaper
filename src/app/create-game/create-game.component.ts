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

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {

  private sub: any;
  constructor(private gameService: GameService, private userService: UserService, private alertService: AlertService, private route: ActivatedRoute, private confirmationService: ConfirmationService) {
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

      this.gameService.getGameDefinitionDetails(id).subscribe(data=>{
        this.gameDefinition = data;
      });

      this.refresh();
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

  currentUser: UserInfo;
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
    this.confirmationService.confirm("Do you really want to play with user " + user.userName + "?", "Invite user").then(result => {
      if (result) {
        this.gameService.create(<GameDetails<GameTicTacToeData>>{
          id: 1,
          activePlayer: 0,
          players: [
            this.currentUser,
            user
          ]
        }).subscribe(() => {
          this.alertService.success("You've just invited user " + user.userName); //TODO: message
        });
      }
    });
  }
gameDefinition: GameDefinitionDetails;
}
