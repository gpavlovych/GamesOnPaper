import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, BaseRequestOptions } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MystubComponent } from './mystub/mystub.component';
import { ModalModule, PaginationModule, DropdownDirective, DropdownMenuDirective, DropdownToggleDirective, ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { GameTicTacToeComponent } from './game-tic-tac-toe/game-tic-tac-toe.component';
import { DisplayCrossZeroPipe } from './game-tic-tac-toe/display-cross-zero.pipe';
import { GroupByPipe } from './group-by.pipe';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Top100playersComponent } from './top100players/top100players.component';
import { AlertComponent } from './alert/alert.component'
import { AuthGuard } from "./auth.guard";
import { MockBackend } from "@angular/http/testing";
import { AuthenticationService } from "./authentication.service";
import { AlertService } from "./alert.service";
import { fakeBackendProvider } from "./fake-backend-provider";
import { UserService } from "./user.service";
import { GameService } from "./game.service";
import { CreateGameComponent } from './create-game/create-game.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
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
    DropdownDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    LoginComponent,
    RegisterComponent,
    Top100playersComponent,
    AlertComponent,
    CreateGameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ModalModule,
    PaginationModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    {
      provide: ComponentsHelper,
      useClass: ComponentsHelper
    },
    AuthGuard,
    AlertService,
    AuthenticationService,
    GameService,
    UserService,

    // providers used to create fake backend
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions],
  bootstrap: [AppComponent]
})
export class AppModule { }
