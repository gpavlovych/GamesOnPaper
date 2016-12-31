import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {GameInfo} from "../game";
import {ConfirmationService} from "../confirmation.service";
import {GameService} from "../game.service";
import {AlertService} from "../alert.service";
import {RefreshService} from "../refresh.service";
import {UserInfoService} from "../user-info.service";
import {UserDetails, UserInfo} from "../user";
import {GameFinishRequestInfo} from "../game-finish-request-info";
import {TranslateService} from "ng2-translate";

@Component({
  selector: 'app-active-game-row',
  templateUrl: './active-game-row.component.html',
  styleUrls: ['./active-game-row.component.css']
})
export class ActiveGameRowComponent implements OnInit, OnChanges {

  currentUser: UserDetails = null;

  withYourself: boolean = false;

  @Input() activeFinishRequests: {};
  @Input() activeGame: GameInfo;

  constructor(private confirmationService: ConfirmationService,
              private userInfoService: UserInfoService,
              private gameService: GameService,
              private alertService: AlertService,
              private refreshService: RefreshService,
              private translateService: TranslateService) {
  }


  ngOnInit() {
    this.refresh();
    this.refreshService.getRefresher().subscribe(() => this.refresh());
  }

  ngOnChanges() {
    this.refreshWithYourself();
  }

  private static allEqualTo(arr: UserInfo[], val: UserDetails): boolean {
    for (let arrItem of arr) {
      if (arrItem.id != val.id) {
        return false;
      }
    }
    return true;
  }

  private refresh() {
    this.refreshCurrentUser();
  }

  private refreshCurrentUser() {
    this.userInfoService.getCurrentUser().subscribe(data => {
      this.currentUser = data;
      this.refreshWithYourself();
    });
  }

  private refreshWithYourself() {
    if (this.currentUser && this.activeGame.players) {
      this.withYourself = ActiveGameRowComponent.allEqualTo(this.activeGame.players, this.currentUser);
    }
  }

  finish(game: GameInfo) {
    if (this.currentUser != null) {
      let message = "WANT_REQUEST_FINISH";
      if (ActiveGameRowComponent.isAutoFinished(game)) {
        message = "WANT_FINISH";
      }

      let header = "FINISH_GAME";

      this.translateService.get(header).subscribe(headerTranslation => {
        this.translateService.get(message).subscribe(messageTranslation => {
          this.confirmationService.confirm(messageTranslation, headerTranslation).then(isOk => {
            if (isOk) {
              this.gameService.requestFinish({gameId: game.id}).subscribe(() => {
                let successMessage = "FINISH_REQUESTED";
                this.translateService.get(successMessage).subscribe(successMessageTranslation => {
                  this.alertService.success(successMessageTranslation);
                  this.refreshService.refresh();
                });
              });
            }
          });
        });
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
      let messageQuestion = "WANT_FINISH_APPROVE";
      let header = "FINISH_GAME";
      this.translateService.get(header).subscribe(headerTranslation => {
        this.translateService.get(messageQuestion, gameFinishRequest.createdBy).subscribe(messageQuestionTranslation => {
          this.confirmationService.confirm(messageQuestionTranslation, headerTranslation).then(isOk => {
            if (isOk) {
              this.gameService.requestFinishApprove(gameFinishRequest.id).subscribe(() => {
                let successMessage = "FINISH_APPROVED";
                this.translateService.get(successMessage, gameFinishRequest.createdBy).subscribe(successMessageTranslation => {
                  this.alertService.success(successMessageTranslation);
                  this.refreshService.refresh();
                });
              });
            }
          });
        });
      });
    }
  }

  finishDecline(gameFinishRequest: GameFinishRequestInfo) {
    if (this.currentUser != null) {
      let messageQuestion = "WANT_FINISH_DECLINE";
      let header = "FINISH_GAME";
      this.translateService.get(header).subscribe(headerTranslation => {
        this.translateService.get(messageQuestion, gameFinishRequest.createdBy).subscribe(messageQuestionTranslation => {
          this.confirmationService.confirm(messageQuestionTranslation, headerTranslation).then(isOk => {
            if (isOk) {
              this.gameService.requestFinishDecline(gameFinishRequest.id).subscribe(() => {
                let successMessage = "FINISH_DECLINED";
                this.translateService.get(successMessage, gameFinishRequest.createdBy).subscribe(successMessageTranslation => {
                  this.alertService.success(successMessageTranslation);
                  this.refreshService.refresh();
                });
              });
            }
          });
        });
      });
    }
  }
}
