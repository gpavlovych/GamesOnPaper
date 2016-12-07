import {Component, OnInit, Input} from '@angular/core';
import {UserInfo} from "../user";
import {GameInfo} from "../game";
import {AlertService} from "../alert.service";
import {AuthenticationService} from "../authentication.service";
import {RefreshService} from "../refresh.service";
import {GameService} from "../game.service";

@Component({
  selector: 'app-new-game-row',
  templateUrl: './new-game-row.component.html',
  styleUrls: ['./new-game-row.component.css']
})
export class NewGameRowComponent implements OnInit {

  constructor(private alertService: AlertService,
              private authenticationService: AuthenticationService,
              private refreshService: RefreshService,
              private gameService: GameService) { }

  ngOnInit() {
    this.currentUserId = this.authenticationService.getAuthorizedUserId();
  }

  currentUserId: any;
  @Input() newGame: GameInfo;

  getUserName(user: UserInfo) {
    if (this.currentUserId == user.id){
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
}
