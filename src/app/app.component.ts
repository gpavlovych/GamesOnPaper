import {Component, ViewContainerRef, OnInit} from '@angular/core';
import {ComponentsHelper} from 'ng2-bootstrap/ng2-bootstrap';
import {UserDetails} from './user';
import {GameDefinitionInfo} from './game-definition';
import {GameInfo} from './game'
import {GameService} from "./game.service";
import {RefreshService} from "./refresh.service";
import {GameFinishRequestState} from "./game-finish-request-state.enum";
import {UserInfoService} from "./user-info.service";
import {GameFinishRequestInfo} from "./game-finish-request-info";
import {Locale, LocalizationService, LocaleService} from "angular2localization";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  currentUser: UserDetails = null;

  gamesToBeCreated: GameDefinitionInfo[] = [];
  gamesToBeCreatedTop: number = 10;
  gamesToBeCreatedTotalCount: number = 0;

  incomingInvitations: GameInfo[] = [];
  incomingInvitationsTop: number = 5;
  incomingInvitationsTotalCount: number = 0;

  outgoingInvitations: GameInfo[] = [];
  outgoingInvitationsTop: number = 5;
  outgoingInvitationsTotalCount: number = 0;

  activeGames: GameInfo[] = [];
  activeGamesTop: number = 10;
  activeGamesTotalCount: number = 0;

  finishedGames: GameInfo[] = [];
  finishedGamesTop: number = 10;
  finishedGamesTotalCount: number = 0;

  activeFinishRequests: {} = {};

  public constructor(
    componentsHelper: ComponentsHelper,
    vcr: ViewContainerRef,
    private gameService: GameService,
    private refreshService: RefreshService,
    private userInfoService: UserInfoService,
    public locale: LocaleService,
    public localization: LocalizationService) {

    // Adds the languages (ISO 639 two-letter or three-letter code).
    this.locale.addLanguages(['en', 'ru', 'uk']);

    // Required: default language, country (ISO 3166 two-letter, uppercase code) and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
    // Selects the default language and country, regardless of the browser language, to avoid inconsistencies between the language and country.
    this.locale.definePreferredLocale('en', 'US', 30);

    // Optional: default currency (ISO 4217 three-letter code).
    this.locale.definePreferredCurrency('USD');

    // Initializes LocalizationService: asynchronous loading.
    this.localization.translationProvider('assets/resources/locale-'); // Required: initializes the translation provider with the given path prefix.
    this.localization.updateTranslation(); // Need to update the translation.
    componentsHelper.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.refresh();
    this.refreshService.getRefresher().subscribe(() => this.refresh());
  }

  private refresh() {
    this.refreshCurrentUser();

    this.refreshGamesToBeCreatedTotalCount();
    this.refreshGamesToBeCreated();

    this.refreshIncomingInvitationsTotalCount();
    this.refreshIncomingInvitations();

    this.refreshOutgoingInvitationsTotalCount();
    this.refreshOutgoingInvitations();

    this.refreshActiveGamesTotalCount();
    this.refreshActiveGames();

    this.refreshFinishedGamesTotalCount();
    this.refreshFinishedGames();
  }

  // Sets a new locale & currency.
  public selectLocale(language: string, country: string, currency: string): void {

    this.locale.setCurrentLocale(language, country);
    this.locale.setCurrentCurrency(currency);

  }

  private refreshFinishedGames() {
    this.gameService.getFinished(0, this.finishedGamesTop).subscribe(data => {
      if (data) {
        this.finishedGames = data;
      }
    });
  }

  private refreshFinishedGamesTotalCount() {
    this.gameService.getFinishedCount().subscribe(data => this.finishedGamesTotalCount = data);
  }

  private refreshActiveGames() {
    this.gameService.getActive(0, this.activeGamesTop).subscribe(data => {
      if (data) {
        this.activeGames = data;
        this.refreshActiveGameFinishedRequests();
      }
    });
  }

  private refreshActiveGamesTotalCount() {
    this.gameService.getActiveCount().subscribe(data => this.activeGamesTotalCount = data);
  }

  private refreshOutgoingInvitations() {
    this.gameService.getOutgoing(0, this.outgoingInvitationsTop).subscribe(data => {
      if (data) {
        this.outgoingInvitations = data;
      }
    });
  }

  private refreshOutgoingInvitationsTotalCount() {
    this.gameService.getOutgoingCount().subscribe(data => this.outgoingInvitationsTotalCount = data);
  }

  private refreshIncomingInvitations() {
    this.gameService.getIncoming(0, this.incomingInvitationsTop).subscribe(data => {
      if (data) {
        this.incomingInvitations = data;
      }
    });
  }

  private refreshIncomingInvitationsTotalCount() {
    this.gameService.getIncomingCount().subscribe(data => this.incomingInvitationsTotalCount = data);
  }

  private refreshGamesToBeCreated() {
    this.gameService.getGameDefinitions(0, this.gamesToBeCreatedTop).subscribe(data => {
      if (data) {
        this.gamesToBeCreated = data;
      }
    });
  }

  private refreshGamesToBeCreatedTotalCount() {
    this.gameService.getGameDefinitionsCount().subscribe(data => this.gamesToBeCreatedTotalCount = data);
  }

  private refreshCurrentUser() {
    this.userInfoService.getCurrentUser().subscribe(data => this.currentUser = data);
  }

  private refreshActiveGameFinishedRequests() {
    this.activeFinishRequests = {};

    for (let activeGame of this.activeGames) {
      let activeGameFinishRequest = AppComponent.getActiveFinishRequest(activeGame);
      if (activeGameFinishRequest) {
        this.activeFinishRequests[activeGame.id] = activeGameFinishRequest;
      }
    }
  }

  private static getActiveFinishRequest(game: GameInfo): GameFinishRequestInfo {
    for (let gameRequest of game.finishRequests) {
      if (gameRequest.state == GameFinishRequestState.new) {
        return gameRequest;
      }
    }
    return null;
  }

  get lang(): string{
    return this.locale.getCurrentLanguage();
  }
}
