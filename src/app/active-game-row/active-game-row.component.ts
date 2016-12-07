import {Component, OnInit, Input} from '@angular/core';
import {GameInfo} from "../game";
import {ConfirmationService} from "../confirmation.service";
import {GameService} from "../game.service";
import {AlertService} from "../alert.service";
import {RefreshService} from "../refresh.service";
import {AuthenticationService} from "../authentication.service";

@Component({
  selector: 'app-active-game-row',
  templateUrl: './active-game-row.component.html',
  styleUrls: ['./active-game-row.component.css']
})
export class ActiveGameRowComponent implements OnInit {

  constructor(private confirmationService: ConfirmationService,
              private authenticationService: AuthenticationService,
  private gameService: GameService,
  private alertService: AlertService,
  private refreshService: RefreshService) { }

  ngOnInit() {
    this.userId = this.authenticationService.getAuthorizedUserId();
  }

  finish(game: GameInfo) {
    this.confirmationService.confirm(ActiveGameRowComponent.isAutoFinished(game) ? "Do you really want to finish the game?": "Do you want to request the game finish?", "Finish the game").then(result => {
      if (result) {
        this.gameService.requestFinish({gameId: game.id}).subscribe(() => {
          this.alertService.success("You've just requested the game finish");
          this.refreshService.refresh();
        });
      }
    });
  }

  private static isAutoFinished(game: GameInfo) {
    let autoFinish: boolean = true;
    for (let playerIndex = 1; playerIndex < game.players.length; playerIndex++) {
      if (game.players[playerIndex].id != game.players[0].id) {
        autoFinish = true;
        break;
      }
    }
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

  @Input() activeFinishRequests: {};
  @Input() activeGame: GameInfo;
  userId: any;
}
