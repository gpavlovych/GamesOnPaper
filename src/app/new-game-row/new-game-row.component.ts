import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {UserDetails} from "../user";
import {GameInfo} from "../game";
import {AlertService} from "../alert.service";
import {RefreshService} from "../refresh.service";
import {GameService} from "../game.service";
import {ConfirmationService} from "../confirmation.service";
import {UserInfoService} from "../user-info.service";
import {TranslateService} from "ng2-translate";

@Component({
  selector: 'app-new-game-row',
  templateUrl: './new-game-row.component.html',
  styleUrls: ['./new-game-row.component.css']
})
export class NewGameRowComponent implements OnInit, OnChanges {

  currentUser: UserDetails = null;
  newGameTranslated;
  @Input() newGame: GameInfo;

  constructor(private alertService: AlertService,
              private refreshService: RefreshService,
              private gameService: GameService,
              private confirmationService: ConfirmationService,
              private userInfoService: UserInfoService,
              private translateService: TranslateService) {
    this.translateService.onLangChange.subscribe(event=>{
      this.refreshTranslation();
    });
  }

  ngOnInit() {
    this.refresh();
    this.refreshService.getRefresher().subscribe(() => this.refresh());
  }

  ngOnChanges() {
    this.refreshTranslation();
  }

  private refreshTranslation(){
    this.translateService.get(this.newGame.gameDefinition.name).subscribe(translated => this.newGameTranslated = {name: translated});
  }

  private refresh() {
    this.refreshCurrentUser();
  }

  private refreshCurrentUser() {
    this.currentUser = null;
    this.userInfoService.getCurrentUser().subscribe(data => this.currentUser = data);
  }

  accept() {
    if (this.currentUser != null) {
      this.translateService.get("INCOMING_INVITATION_FORM").subscribe(headerTranslation => {
        this.translateService.get("WANT_ACCEPT_INVITATION", {userName: this.newGame.players[0].userName, gameDefinitionName: this.newGameTranslated.name}).subscribe(questionTranslation => {
          this.confirmationService.confirm(questionTranslation, headerTranslation).then(isOk => {
            if (isOk) {
              this.gameService.accept(this.newGame.id).subscribe(() => {
                this.translateService.get("ACCEPT_SUCCESS", {userName: this.newGame.players[0].userName, gameDefinitionName: this.newGameTranslated.name}).subscribe(successTranslation => {
                  this.translateService.get("GO_TO_GAME").subscribe(linkTextTranslation => {
                    this.alertService.successWithLink(successTranslation, "/game/" + this.newGame.id, linkTextTranslation);
                    this.refreshService.refresh();
                  });
                });
              });
            }
          });
        });
      });
    }
  }

  decline() {
    if (this.currentUser != null) {
      this.translateService.get("INCOMING_INVITATION_FORM").subscribe(headerTranslation => {
        this.translateService.get("WANT_DECLINE_INVITATION", {userName: this.newGame.players[0].userName, gameDefinitionName: this.newGameTranslated.name}).subscribe(questionTranslation => {
          this.confirmationService.confirm(questionTranslation, headerTranslation).then(isOk => {
            if (isOk) {
              this.gameService.decline(this.newGame.id).subscribe(() => {
                this.translateService.get("DECLINE_SUCCESS", {userName: this.newGame.players[0].userName, gameDefinitionName: this.newGameTranslated.name}).subscribe(successTranslation => {
                  this.alertService.success(successTranslation);
                  this.refreshService.refresh();
                });
              });
            }
          });
        });
      });
    }
  }

  cancel() {
    if (this.currentUser != null) {
      this.translateService.get("OUTGOING_INVITATION_FORM").subscribe(headerTranslation => {
        this.translateService.get("WANT_CANCEL_INVITATION", {userName: this.newGame.players[1].userName, gameDefinitionName: this.newGameTranslated.name}).subscribe(questionTranslation => {
          this.confirmationService.confirm(questionTranslation, headerTranslation).then(isOk => {
            if (isOk) {
              this.gameService.decline(this.newGame.id).subscribe(() => {
                this.translateService.get("CANCEL_SUCCESS", {userName: this.newGame.players[1].userName, gameDefinitionName: this.newGameTranslated.name}).subscribe(successTranslation => {
                  this.alertService.success(successTranslation);
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
