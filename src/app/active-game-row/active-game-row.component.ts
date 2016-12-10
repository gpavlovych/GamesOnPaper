import {Component, OnInit, Input} from '@angular/core';
import {GameInfo} from "../game";
import {ConfirmationService} from "../confirmation.service";
import {GameService} from "../game.service";
import {AlertService} from "../alert.service";
import {RefreshService} from "../refresh.service";
import {UserInfoService} from "../user-info.service";
import {UserDetails} from "../user";
import {GameFinishRequestInfo} from "../game-finish-request-info";

@Component({
  selector: 'app-active-game-row',
  templateUrl: './active-game-row.component.html',
  styleUrls: ['./active-game-row.component.css']
})
export class ActiveGameRowComponent implements OnInit {

  currentUser: UserDetails = null;

  @Input() activeFinishRequests: {};
  @Input() activeGame: GameInfo;

  constructor(private confirmationService: ConfirmationService,
              private userInfoService: UserInfoService,
              private gameService: GameService,
              private alertService: AlertService,
              private refreshService: RefreshService) {
  }


  ngOnInit() {
    this.refresh();
    this.refreshService.getRefresher().subscribe(() => this.refresh());
  }

  private refresh() {
    this.refreshCurrentUser();
  }

  private refreshCurrentUser() {
    this.currentUser = null;
    this.userInfoService.getCurrentUser().subscribe(data => this.currentUser = data);
  }

  finish(game: GameInfo) {
    if (this.currentUser != null) {
      this.confirmationService.confirm(ActiveGameRowComponent.isAutoFinished(game) ? "Do you really want to finish the game?" : "Do you want to request the game finish?", "Finish the game").then(isOk => {
        if (isOk) {
          this.gameService.requestFinish({gameId: game.id}).subscribe(() => {
            this.alertService.success("You've just requested the game finish");
            this.refreshService.refresh();
          });
        }
      });
    }
  }

  private static isAutoFinished(game: GameInfo): boolean {
    if (game.players.length > 0) {
      for (let playerIndex = 1; playerIndex < game.players.length; playerIndex++) {
        if (game.players[playerIndex].id != game.players[0].id) {
          return false;
        }
      }
    }
    return true;
  }

  finishApprove(gameFinishRequest: GameFinishRequestInfo) {
    if (this.currentUser != null) {
      this.confirmationService.confirm("Do you want to approve the game finish request from " + gameFinishRequest.createdBy.userName + "?", "Finish the game").then(isOk => {
        if (isOk) {
          this.gameService.requestFinishApprove(gameFinishRequest.id).subscribe(() => {
            this.alertService.success("You've just approved the game finish request from " + gameFinishRequest.createdBy.userName);
            this.refreshService.refresh();
          });
        }
      });
    }
  }

  finishDecline(gameFinishRequest: GameFinishRequestInfo) {
    if (this.currentUser != null) {
      this.confirmationService.confirm("Do you want to decline the game finish request from " + gameFinishRequest.createdBy.userName + "?", "Finish the game").then(isOk => {
        if (isOk) {
          this.gameService.requestFinishDecline(gameFinishRequest.id).subscribe(() => {
            this.alertService.success("You've just declined the game finish request from " + gameFinishRequest.createdBy.userName);
            this.refreshService.refresh();
          });
        }
      });
    }
  }
}
