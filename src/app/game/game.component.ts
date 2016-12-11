import {Component, OnInit} from '@angular/core';
import {RefreshService} from "../refresh.service";
import {UserDetails} from "../user";
import {UserInfoService} from "../user-info.service";
import {GameDetails} from "../game";
import {GameService} from "../game.service";
import {ActivatedRoute} from "@angular/router";

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
              private gameService: GameService) {
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
      this.game = data
    });
  }
}
