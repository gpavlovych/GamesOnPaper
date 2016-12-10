import {Component, OnInit, Input} from '@angular/core';
import {UserInfo, UserDetails} from "../user";
import {GameInfo} from "../game";
import {AlertService} from "../alert.service";
import {AuthenticationService} from "../authentication.service";
import {RefreshService} from "../refresh.service";
import {GameService} from "../game.service";
import {ConfirmationService} from "../confirmation.service";
import {UserService} from "../user.service";
import {UserInfoService} from "../user-info.service";

@Component({
  selector: 'app-new-game-row',
  templateUrl: './new-game-row.component.html',
  styleUrls: ['./new-game-row.component.css']
})
export class NewGameRowComponent implements OnInit {

  currentUser: UserDetails = null;

  @Input() newGame: GameInfo;

  constructor(private alertService: AlertService,
              private refreshService: RefreshService,
              private gameService: GameService,
              private confirmationService: ConfirmationService,
              private userInfoService: UserInfoService) {
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

  accept(game: GameInfo) {
    if (this.currentUser != null) {
      this.confirmationService.confirm("Do you really want to accept the invitation to play " + game.gameDefinition.name + " from " + game.players[0].userName + "?", "Incoming Invitation").then(isOk => {
        if (isOk) {
          this.gameService.accept(game.id).subscribe(() => {
            this.alertService.successWithLink("You've just accepted the invitation to play " + game.gameDefinition.name + " from " + game.players[0].userName, "/game/" + game.id, "Go to game");
            this.refreshService.refresh();
          });
        }
      });
    }
  }

  decline(game: GameInfo) {
    if (this.currentUser != null) {
      this.confirmationService.confirm("Do you really want to decline the invitation to play " + game.gameDefinition.name + " from " + game.players[0].userName + "?", "Incoming Invitation").then(isOk => {
        if (isOk) {
          this.gameService.decline(game.id).subscribe(() => {
            this.alertService.success("You've just declined the invitation to play " + game.gameDefinition.name + " from " + game.players[0].userName);
            this.refreshService.refresh();
          });
        }
      });
    }
  }
}
