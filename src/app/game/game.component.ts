import {Component, OnInit} from '@angular/core';
import {RefreshService} from "../refresh.service";
import {UserDetails} from "../user";
import {UserInfoService} from "../user-info.service";
import {GameDetails} from "../game";
import {GameService} from "../game.service";
import {ActivatedRoute} from "@angular/router";
import {GameTicTacToeComponent} from "../game-tic-tac-toe/game-tic-tac-toe.component";
import {AlertService} from "../alert.service";
import {GameState} from "../game-state.enum";
import {TranslateService} from "ng2-translate";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  private sub: any;

  currentUser: UserDetails = null;
  game: GameDetails = null;
  gameId: number = 0;

  constructor(private refreshService: RefreshService,
              private userInfoService: UserInfoService,
              private route: ActivatedRoute,
              private gameService: GameService,
              private alertService: AlertService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    // Subscribe to route params
    this.sub = this.route.params.subscribe(params => {
      this.gameId = params['id'];
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
    this.refreshGame();
  }

  private refreshCurrentUser() {
    this.userInfoService.getCurrentUser().subscribe(data => this.currentUser = data);
  }

  private refreshGame() {
    this.gameService.getById(this.gameId).subscribe(data => {
      this.congratulateOnceIfNeeded(data, this.game);
      this.game = data;
    });
  }

  private congratulateOnceIfNeeded(newGame: GameDetails, oldGame: GameDetails) {
    if ((newGame != null && newGame.state == GameState.finished) && (oldGame != null && oldGame.state == GameState.active)) {
      if (newGame.winner != null) {
        if (newGame.winner.id == this.currentUser.id) {
          this.translateService.get("WON_MESSAGE").subscribe(wonMessageTranslation => {
            this.alertService.success(wonMessageTranslation);
          });
        }
        else {
          this.translateService.get("LOSE_MESSAGE").subscribe(loseMessageTranslation => {
            this.alertService.success(loseMessageTranslation);
          });
        }
      }
      else {
        this.translateService.get("DRAW").subscribe(drawTranslation => {
          this.alertService.success(drawTranslation);
        });
      }
    }
  }
}
