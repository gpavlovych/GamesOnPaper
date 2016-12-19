import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule, BaseRequestOptions} from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {MystubComponent} from './mystub/mystub.component';
import {ModalModule, PaginationModule, DropdownModule, ComponentsHelper} from 'ng2-bootstrap/ng2-bootstrap';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {HomeComponent} from './home/home.component';
import {GameTicTacToeComponent} from './game-tic-tac-toe/game-tic-tac-toe.component';
import {DisplayCrossZeroPipe} from './game-tic-tac-toe/display-cross-zero.pipe';
import {GroupByPipe} from './group-by.pipe';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {Top100playersComponent} from './top100players/top100players.component';
import {AlertComponent} from './alert/alert.component'
import {AuthGuard} from "./auth.guard";
import {MockBackend} from "@angular/http/testing";
import {AuthenticationService} from "./authentication.service";
import {AlertService} from "./alert.service";
import {fakeBackendProvider} from "./fake-backend-provider";
import {UserService} from "./user.service";
import {GameService} from "./game.service";
import {CreateGameComponent} from './create-game/create-game.component';
import {ConfirmationComponent} from './confirmation/confirmation.component';
import {ConfirmationService} from "./confirmation.service";
import {KeysPipe} from './keys.pipe';
import {UserAvatarComponent} from './user-avatar/user-avatar.component';
import {RefreshService} from "./refresh.service";
import {ActiveGameRowComponent} from './active-game-row/active-game-row.component';
import {NewGameRowComponent} from './new-game-row/new-game-row.component';
import {FinishGameRowComponent} from './finish-game-row/finish-game-row.component';
import {UserInfoService} from "./user-info.service";
import {GameComponent} from './game/game.component';
import {GameTicTacToeService} from './game-tic-tac-toe.service';
import {GameDotsComponent} from './game-dots/game-dots.component';
import {GameDotsService} from "./game-dots.service";
// Angular 2 Localization.
import {LocaleModule,LocalizationModule} from 'angular2localization';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'creategame/:id', component: CreateGameComponent, canActivate: [AuthGuard] },
  { path: 'game/:id', component: GameComponent, canActivate: [AuthGuard] },
  { path: 'tictactoe', component: GameTicTacToeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MystubComponent,
    PageNotFoundComponent,
    HomeComponent,
    GameTicTacToeComponent,
    DisplayCrossZeroPipe,
    GroupByPipe,
    LoginComponent,
    RegisterComponent,
    Top100playersComponent,
    AlertComponent,
    CreateGameComponent,
    ConfirmationComponent,
    KeysPipe,
    UserAvatarComponent,
    ActiveGameRowComponent,
    NewGameRowComponent,
    FinishGameRowComponent,
    GameComponent,
    GameDotsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ModalModule,
    DropdownModule,
    PaginationModule,
    LocalizationModule.forRoot(),
    LocaleModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    {
      provide: ComponentsHelper,
      useClass: ComponentsHelper
    },
    AuthGuard,
    AlertService,
    ConfirmationService,
    AuthenticationService,
    GameService,
    GameTicTacToeService,
    GameDotsService,
    UserService,
    RefreshService,
    UserInfoService,

    // providers used to create fake backend
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions],
  bootstrap: [AppComponent]
})
export class AppModule { }
