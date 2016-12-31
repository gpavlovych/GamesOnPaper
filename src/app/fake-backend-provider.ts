import {Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, ConnectionBackend} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {GameDefinitionInfo, GameDefinitionDetails, GameDefinition} from "./game-definition";
import {GameInfo, Game, GameDetails} from "./game";
import {GameState} from "./game-state.enum";
import {UserInfo, UserDetails, User} from "./user";
import {CreateGameViewModel} from "./view-models/create-game-view-model";
import {CreateUserViewModel} from "./view-models/create-user-view-model";
import {GameFinishRequest} from "./game-finish-request";
import {GameFinishRequestState} from "./game-finish-request-state.enum";
import {GameFinishRequestInfo} from "./game-finish-request-info";
import {CreateGameFinishRequestViewModel} from "./view-models/create-game-finish-request-view-model";
import {GameTicTacToeMoveViewModel} from "./view-models/game-tic-tac-toe-move-view-model";
import {GameTicTacToeData} from "./game-tic-tac-toe/game-tic-tac-toe-data";
import {GameDotsData} from "./game-dots/game-dots-data";
import {GameDotsDataDot} from "./game-dots/game-dots-data-dot";
import {GameDotsMoveViewModel} from "./view-models/game-dots-move-view-model";
import {PolygonService} from "./polygon-service";
import {GameDotsDataPolygonPoint} from "./game-dots/game-dots-data-polygon-point";

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: Http,
  useFactory: (backend: MockBackend, options: BaseRequestOptions) => {
    // array in local storage for registered users
    //localStorage.removeItem('users');
    //localStorage.removeItem('games');
    //localStorage.removeItem('gameFinishRequests');
    // configure fake backend
    backend.connections.subscribe((connection: MockConnection) => {
//      console.log('connection!');
      // wrap in timeout to simulate server api call
      setTimeout(() => {
        console.log("url:"+connection.request.url);
       /* if (!connection.request.url.startsWith("/api/")) {
          console.log("not an api call");
          return;
        }*/

        let users: User[] = JSON.parse(localStorage.getItem('users')) || [];
        let gameDefinitions: GameDefinition[] = [{
          id: 1,
          name: "GAME_TIC_TAC_TOE",
          icon: ""
        }, {
          id: 2,
          name: "GAME_DOTS",
          icon: ""
        }];
          let games: Game[] = JSON.parse(localStorage.getItem('games')) || [];
        let gameFinishRequests: GameFinishRequest[] = JSON.parse(localStorage.getItem('gameFinishRequests')) || [];

        function makeTurnDots(game: Game, indexX: number, indexY: number, currentUserId: any) {
          console.log("rowIndex " + indexX + ":" + "columnIndex " + indexX + " turn");
          let data: GameDotsData = game.data;
          let dot = data.dots[indexX][indexY];
          if (game.state != GameState.active || dot == null || (!dot.free) || dot.playerIndex != null || game.playerIds[data.activePlayer] != currentUserId) {

            return false;
          }

          function wave(i, j, markedProperty, enemyVertices) {
            let waveFront = [];
            let goalReached = false;
            let marked = [];

            function pushIfAccessible(item) {
              if ((item.x < 0 || item.x >= data.dots.length) || (item.y < 0 || item.y >= data.dots[item.x].length)) {
                goalReached = true;
                return;
              }
              let currentCell = data.dots[item.x][item.y];
              if (currentCell.playerIndex == 1 - data.dots[i][j].playerIndex) {
                enemyVertices.push(item);
                return;
              }
              if (!currentCell.hasOwnProperty(markedProperty)) {
                marked.push(currentCell);
                currentCell[markedProperty] = true;
                waveFront.push(item);
              }
            }

            pushIfAccessible({x: i, y: j});
            while (!goalReached && waveFront.length > 0) {
              let item = waveFront.pop();
              pushIfAccessible({x: item.x + 1, y: item.y});
              pushIfAccessible({x: item.x, y: item.y + 1});
              pushIfAccessible({x: item.x - 1, y: item.y});
              pushIfAccessible({x: item.x, y: item.y - 1});
            }
            while (marked.length > 0) {
              delete marked.pop()[markedProperty];
            }
            return goalReached;
          }

          function searchFor(list: GameDotsDataPolygonPoint[]) {
            function isConnected(u: number, v: number) {
              return u != v &&
                ((list[u].x - list[v].x) * (list[u].x - list[v].x) <= 1) &&
                ((list[u].y - list[v].y) * (list[u].y - list[v].y) <= 1);
            }

            function findCycle(u: number, v: number) {
              marked[v] = true;
              for (let w = 0; w < list.length; w++) {
                if (cycle) return;
                if (isConnected(v, w)) {
                  if (!marked.hasOwnProperty(w)) {
                    edgeTo[w] = v;
                    findCycle(v, w);
                  }
                  else if (w != u) {
                    edgeTo[w] = v;
                    cycle = [];
                    for (let x = v; x != w && x !== undefined; x = edgeTo[x]) {
                      cycle.push(x);
                    }
                    cycle.push(w);
                  }
                }
              }
            }

            function removeDuplicates() {
              let u = {}, a = [];
              for (let i = 0, l = list.length; i < l; ++i) {
                let propName = list[i].x + "_" + list[i].y;
                if (u.hasOwnProperty(propName)) {
                  continue;
                }
                a.push(list[i]);
                u[propName] = 1;
              }
              list = a;
            }

            let result = [];
            let marked;
            let edgeTo;
            let cycle;

            removeDuplicates();
            for (let listIndex = 0; listIndex < list.length; listIndex++) {
              let cycleStart = listIndex;
              marked = {};
              edgeTo = {};
              cycle = null;
              findCycle(-1, cycleStart);
              if (cycle) {
                let poly = [];
                while (cycle.length > 0) {
                  poly.push(list[cycle.pop()]);
                }
                result.push(poly);
              }
            }
            return result;
          }

          function poly1ContainsInPoly2(poly1Path, poly2Path) {
            let contains = true;
            for (let vert1 of poly1Path) {
              contains = contains && PolygonService.checkPointInsidePoly(vert1, poly2Path);
            }
            return contains;
          }

          function addPolyAndRemoveAllWhichFullyBelongTo(poly) {
            if (poly.path.length <= 2) return;
            data.polygons = data.polygons || [];
            for (let i = 0; i < data.polygons.length; i++) {
              if ((poly1ContainsInPoly2(data.polygons[i].path, poly.path))) {
                data.polygons.splice(i, 1);
                i--;
              }
            }
            data.polygons.push(poly);
          }

          function countScores() {
            for (let scoreIndex = 0; scoreIndex < data.scores.length; scoreIndex++) {
              data.scores[scoreIndex] = 0;
            }

            for (let i = 0; i < data.dots.length; i++) {
              for (let j = 0; j < data.dots[i].length; j++)
                if (data.scores.hasOwnProperty(data.dots[i][j].playerIndex)) {
                  data.scores[data.dots[i][j].playerIndex]++;
                }
            }
          }

          function canDoAMove(indexX, indexY) {
            if (data.dots[indexX][indexY].playerIndex == null) {
              let containsInPoly = false;
              for (let poly of data.polygons) {
                containsInPoly = containsInPoly || PolygonService.checkPointInsidePoly({
                    x: indexX,
                    y: indexY
                  }, poly.path);
              }

              if (!containsInPoly) {
                return true;
              }
            }

            return false;
          }

          function countRemainingMoves() {
            data.remainingMoves = 0;
            for (let i = 0; i < data.dots.length; i++) {
              for (let j = 0; j < data.dots[i].length; j++)
                if (canDoAMove(i, j)) {
                  data.remainingMoves++;
                }
            }
          }

          if (canDoAMove(indexX, indexY)) {
            data.dots[indexX][indexY].playerIndex = data.activePlayer;
            let lostPoints = [];
            for (let i = 0; i < data.dots.length; i++) {
              for (let j = 0; j < data.dots[i].length; j++) {
                if (data.dots[i][j].playerIndex == 1 - data.activePlayer) {
                  let markedValues = [];
                  let enemyVertices = [];
                  let markedProperty = "marked" + Math.floor(Math.random() * 10000000000000001);
                  if (!wave(i, j, markedProperty, enemyVertices)) {
                    lostPoints.push({x: i, y: j, enemyVertices: enemyVertices});
                  }
                }
              }
            }

            while (lostPoints.length > 0) {
              let pointInfo = lostPoints.pop();
              data.dots[pointInfo.x][pointInfo.y].playerIndex = 1 - data.dots[pointInfo.x][pointInfo.y].playerIndex;
              let polys = searchFor(pointInfo.enemyVertices);
              while (polys.length > 0) {
                let path = polys.pop();
                addPolyAndRemoveAllWhichFullyBelongTo({
                  path: path,
                  color: data.dots[pointInfo.x][pointInfo.y].playerIndex
                });
              }
            }

            countScores();
            countRemainingMoves();
            data.activePlayer = (data.activePlayer + 1) % game.playerIds.length;
            return true;
          }

          return false;
        }

        function checkCell(game: Game, rowIndex: number, columnIndex: number, currentUserId: any): boolean {
          console.log("rowIndex "+rowIndex+":"+"columnIndex "+columnIndex+" checked");
          function checkWinner(game: Game, rowIndex:number, columnIndex:number): boolean {
            let currentValue = game.data.rows[rowIndex][columnIndex];
            let result = false;

            //horizontal won
            if (game.data.rows[0][columnIndex] == currentValue &&
              game.data.rows[1][columnIndex] == currentValue &&
              game.data.rows[2][columnIndex] == currentValue) {
              game.data.result[0][columnIndex] = true;
              game.data.result[1][columnIndex] = true;
              game.data.result[2][columnIndex] = true;
              result = true;
            }

            //vertical won
            if (game.data.rows[rowIndex][0] == currentValue &&
              game.data.rows[rowIndex][1] == currentValue &&
              game.data.rows[rowIndex][2] == currentValue) {
              game.data.result[rowIndex][0] = true;
              game.data.result[rowIndex][1] = true;
              game.data.result[rowIndex][2] = true;
              result = true;
            }

            //diagonal won
            if ((rowIndex == columnIndex) || (2 - rowIndex == columnIndex)) {
              if (game.data.rows[0][0] == currentValue &&
                game.data.rows[1][1] == currentValue &&
                game.data.rows[2][2] == currentValue) {
                game.data.result[0][0] = true;
                game.data.result[1][1] = true;
                game.data.result[2][2] = true;
                result = true;
              }
              if (game.data.rows[2][0] == currentValue &&
                game.data.rows[1][1] == currentValue &&
                game.data.rows[0][2] == currentValue) {
                game.data.result[2][0] = true;
                game.data.result[1][1] = true;
                game.data.result[0][2] = true;
                result = true;
              }
            }

            return result;
          }

          if (game.state != GameState.active ||
            game.data.rows[rowIndex][columnIndex] != null ||
            game.playerIds[game.data.activePlayer] != currentUserId) {

            return false;
          }

          game.data.rows[rowIndex][columnIndex] = game.data.activePlayer;
          game.data.moves--;

          if (checkWinner(game, rowIndex, columnIndex)) {
            game.winnerId = game.playerIds[game.data.activePlayer];
            game.state = GameState.finished;
          }

          if (game.data.moves == 0) {
            game.state = GameState.finished;
          }

          game.data.activePlayer = (game.data.activePlayer + 1) % 2;
          return true;
        }

        function getGameDefinitionById(id: any): GameDefinition {
          for (let gameDefinition of gameDefinitions){
            if (gameDefinition.id == id){
              return gameDefinition;
            }
          }
          return null;
        }

        function getGameDefinitionDetailsById(id: any): GameDefinitionDetails {
          let gameDefinition = getGameDefinitionById(id);
          if (gameDefinition != null) {
            return {
              id: gameDefinition.id,
              name: gameDefinition.name,
              icon: gameDefinition.icon
            };
          }
          return null;
        }

        function getNewTicTacToeGameData(): GameTicTacToeData {
          return {
            activePlayer: 0,
            rows: [
              [null, null, null],
              [null, null, null],
              [null, null, null]],
            result: [
              [false, false, false],
              [false, false, false],
              [false, false, false]],
            moves: 9
          };
        }

        function getNewDotsGameData(): GameDotsData {
          let sizeX = 60;
          let sizeY = 43;
          let dots = new Array<GameDotsDataDot[]>(sizeX);
          for (let i = 0; i < sizeX; i++) {
            dots[i] = new Array<GameDotsDataDot>(sizeY);
            for (let j = 0; j < sizeY; j++) {
              dots[i][j] = {playerIndex: null, free: true};
            }
          }
          let remainingMoves = sizeX * sizeY; //total amount of moves
          let polygons = [];
          let scores = [0, 0];
          return {
            activePlayer: 0,
            dots: dots,
            polygons: polygons,
            scores: scores,
            remainingMoves: remainingMoves
          };
        }

        function getGameById(id: any): Game {
          for (let game of games){
            if (game.id == id){
              return game;
            }
          }
          return null;
        }

        function getGameDetailsById(id: any): GameDetails {
          let game: Game = getGameById(id);
          if (game != null) {
            let players: UserInfo[] = [];
            for (let playerId of game.playerIds) {
              players.push(userInfosDictionary[playerId]);
            }

            return {
              data: game.data,
              id: game.id,
              gameDefinition: gameDefinitionInfosDictionary[game.gameDefinitionId],
              createdBy: userInfosDictionary[game.createdById],
              createdDate: game.createdDate,
              players: players,
              state: game.state,
              winner: userInfosDictionary[game.winnerId]
            };
          }

          return null;
        }

        function hasSameItems(values: any[]): boolean {
          if (values && values.length > 0) {
            let firstItem = values[0];
            for (let index = 1; index < values.length; index++) {
              if (values[index] != firstItem) {
                return false;
              }
            }
          }
          return true;
        }

        function getUserFromToken(token: string) {
          if (token) {
            let tokenMatch = token.match(/^Bearer fake_user_token:(.*)$/);
            if (tokenMatch && tokenMatch.length > 1) {
              let userName = tokenMatch[1];
              for (let user of users) {
                if (user.username == userName) {
                  return user;
                }
              }
            }
          }
          return null;
        }

        function toIdDictionary(arr: any[]) {
          let result = {};
          for (let arrItem of arr) {
            result[arrItem.id] = arrItem;
          }
          return result;
        }

        let gameDefinitionInfos: GameDefinitionInfo[] = [];
        for (let gameDefinition of gameDefinitions) {
          gameDefinitionInfos.push({
            id: gameDefinition.id,
            name: gameDefinition.name,
            icon: gameDefinition.icon
          });
        }

        let userInfos: UserInfo[] = [];
        for (let user of users) {
          let userInfo: UserInfo = {
            id: user.id,
            sex: user.sex || 0,
            userName: user.username,
            userPic: ""
          };
          userInfos.push(userInfo);
        }

        let userInfosDictionary = toIdDictionary(userInfos);
        let gameDefinitionInfosDictionary = toIdDictionary(gameDefinitionInfos);

        let gameInfos: GameInfo[] = [];
        for (let game of games) {
          let players: UserInfo[] = [];
          for (let playerId of game.playerIds) {
            players.push(userInfosDictionary[playerId]);
          }

          let gameInfo: GameInfo = {
            gameDefinition: gameDefinitionInfosDictionary[game.gameDefinitionId],
            players: players,
            state: game.state,
            id: game.id,
            createdBy: userInfosDictionary[game.createdById],
            createdDate: game.createdDate,
            finishRequests: [],
            winner: userInfosDictionary[game.winnerId]
          };

          gameInfos.push(gameInfo);
        }
        let gameInfosDictionary = toIdDictionary(gameInfos);

        for (let gameFinishRequest of gameFinishRequests) {
          let gameFinishRequestInfo: GameFinishRequestInfo = {
            createdBy: userInfosDictionary[gameFinishRequest.createdById],
            createdDate: gameFinishRequest.createdDate,
            id: gameFinishRequest.id,
            state: gameFinishRequest.state
          };
          gameInfosDictionary[gameFinishRequest.gameId].finishRequests.push(gameFinishRequestInfo);
        }

        let authenticatedUser = getUserFromToken(connection.request.headers.get('Authorization'));

        // English localization
        if (connection.request.url.startsWith('i18n/en')) {
          connection.mockRespond(new Response(new ResponseOptions({
            status: 200,
            body: {
              "GAMES_ON_PAPER": "Games on paper",
              "CHANGE_COUNTRY": "Language",
              "CREATE_GAME": "Create Game",
              "INVITE_USERS_TO_PLAY": "Invite user to play",
              "SHOW_MORE": "Show more",
              "INVITATIONS": "Invitations",
              "INCOMING_INVITATIONS": "Incoming invitations",
              "INCOMING_INVITATIONS_DESCRIPTION": "Invitations you've received",
              "OUTGOING_INVITATIONS": "Outgoing invitations",
              "OUTGOING_INVITATIONS_DESCRIPTION": "Invitations you've sent",
              "ACTIVE_GAMES": "Active Games",
              "ACTIVE_GAMES_DESCRIPTION": "Games which are being played now",
              "FINISHED_GAMES": "Finished Games",
              "FINISHED_GAMES_DESCRIPTION": "Games which are finished",
              "WELCOME_USER": "Welcome, {{username}}!",
              "LOGOUT": "Logout",
              "PLAYING_WITH_YOURSELF": "Playing with yourself",
              "PLAYING_WITH": "Playing with",
              "GO_TO": "Go to",
              "FINISH": "Finish",
              "USER_WANTS_TO_FINISH": "{{userName}} wants to finish the game.",
              "YOU_WANT_TO_FINISH": "You want to finish the game. Waiting for opponent decision.",
              "ACCEPT": "Accept",
              "DECLINE": "Decline",
              "CANCEL": "Cancel",
              "OK": "Ok",
              "PLEASE_WAIT": "Please wait",
              "INVITE_USER_TO_PLAY_GAME": "Invite user to play {{name}} with you!",
              "INVITE": "Invite",
              "YOUR_DOTS": "Your dots:",
              "YOUR_DOT": "Your dot:",
              "NONE_YOUR_DOTS": "None of your dots",
              "SCORES": "Scores",
              "LOGIN_FORM": "Login",
              "ACCOUNT": "Account",
              "ACCOUNT_REQUIRED": "Account is required",
              "PASSWORD": "Password",
              "PASSWORD_REQUIRED": "Password is required",
              "LOGIN": "Login",
              "REGISTER": "Register",
              "MYSTUB_WORKS": "My stub works",
              "INVITE_USER": "Invite user",
              "INVITED_YOU_TO_PLAY": "invited you to play {{name}}!",
              "INVITED_TO_PLAY": "invited to play {{name}} with you!",
              "PAGE_NOT_FOUND_WORKS": "page-not-found works!",
              "REGISTER_FORM": "Register New User",
              "SEX": "Sex",
              "FIRST_NAME": "First Name",
              "FIRST_NAME_REQUIRED": "First Name is required",
              "LAST_NAME": "Last Name",
              "LAST_NAME_REQUIRED": "Last Name is required",
              "REGISTER_SUBMIT": "Register",
              "TOP_100_FORM": "TOP-100",
              "TOP_100_FORM_DESCRIPTION": "Here is a list of top 100 most successful players:",
              "EN_LANGUAGE": "English",
              "RU_LANGUAGE": "Русский",
              "UA_LANGUAGE": "Українська",
              "WANT_FINISH": "Do you really want to finish the game?",
              "WANT_REQUEST_FINISH": "Do you want to request the game finish?",
              "FINISH_GAME": "Finish the game",
              "FINISH_REQUESTED": "You've just requested the game finish",
              "WANT_FINISH_APPROVE": "Do you want to approve the game finish request from {{userName}}?",
              "FINISH_APPROVED": "You've just approved the game finish request from {{userName}}!",
              "WANT_FINISH_DECLINE": "Do you want to decline the game finish request from {{userName}}?",
              "FINISH_DECLINED": "You've just approved the game finish request from {{userName}}!",
              "WANT_PLAY_USER": "Do you really want to play with user {{userName}}?",
              "WANT_PLAY_YOURSELF": "Do you really want to play with yourself?",
              "INVITED_USER": "You've just invited user {{userName}} to play the {{gameDefinitionName}}!",
              "INVITED_YOURSELF": "You've just started playing the {{name}} with yourself",
              "GO_TO_GAME": "Go to game",
              "WON_MESSAGE": "Congratulations! You've just won the game!",
              "LOSE_MESSAGE": "Uh-oh! You've just lose the game...",
              "DRAW": "Draw!",
              "INCOMING_INVITATION_FORM": "Incoming Invitation",
              "WANT_ACCEPT_INVITATION": "Do you really want to accept the invitation to play {{gameDefinitionName}} from {{userName}}?",
              "ACCEPT_SUCCESS": "You've just accepted the invitation to play {{gameDefinitionName}} from {{userName}}!",
              "WANT_DECLINE_INVITATION": "Do you really want to decline the invitation to play {{gameDefinitionName}} from {{userName}}?",
              "DECLINE_SUCCESS": "You've just declined the invitation to play {{gameDefinitionName}} from {{userName}}!",
              "OUTGOING_INVITATION_FORM": "Outgoing Invitation",
              "WANT_CANCEL_INVITATION": "Do you really want to cancel your invitation of {{userName}} to play {{gameDefinitionName}}?",
              "CANCEL_SUCCESS": "You've just cancelled your invitation of {{userName}} to play {{gameDefinitionName}}!",
              "REGISTRATION_SUCCESS": "Registration successful",
              "GAME_TIC_TAC_TOE": "tic-tac-toe",
              "GAME_DOTS": "dots",
              "USERS": "Users"
            }
          })));
        }

        // Russian localization
        if (connection.request.url.startsWith('i18n/ru')) {
          connection.mockRespond(new Response(new ResponseOptions({
            status: 200,
            body: {
              "GAMES_ON_PAPER": "Игры на бумаге",
              "CHANGE_COUNTRY": "Язык",
              "CREATE_GAME":"Создать игру",
              "INVITE_USERS_TO_PLAY": "Пригласить пользователей поиграть",
              "SHOW_MORE": "Показать больше",
              "INVITATIONS": "Приглашения",
              "INCOMING_INVITATIONS": "Входящие приглашения",
              "INCOMING_INVITATIONS_DESCRIPTION": "Приглашения, которые Вы получили",
              "OUTGOING_INVITATIONS": "Исходящие приглашения",
              "OUTGOING_INVITATIONS_DESCRIPTION": "Приглашения, которые Вы отправили",
              "ACTIVE_GAMES": "Активные игры",
              "ACTIVE_GAMES_DESCRIPTION": "Игры, в которые сейчас играют",
              "FINISHED_GAMES": "Завершенные игры",
              "FINISHED_GAMES_DESCRIPTION": "Игры, которые уже завершены",
              "WELCOME_USER": "Здравствуйте, {{username}}!",
              "LOGOUT": "Выйти",
              "PLAYING_WITH_YOURSELF": "Игра с самим собой",
              "PLAYING_WITH": "Игра с",
              "GO_TO": "Перейти",
              "FINISH": "Завершить",
              "USER_WANTS_TO_FINISH": "{{userName}} хочет завершить игру.",
              "YOU_WANT_TO_FINISH": "Вы хотите завершить игру. Ожидание решения оппонента.",
              "ACCEPT": "Принять",
              "DECLINE": "Отклонить",
              "CANCEL": "Отменить",
              "OK": "Да",
              "PLEASE_WAIT": "Пожалуйста, подождите",
              "INVITE_USER_TO_PLAY_GAME": "Пригласить пользователя сыграть {{name}} с Вами!",
              "INVITE": "Пригласить",
              "YOUR_DOTS": "Ваши точки:",
              "YOUR_DOT": "Ваша точка:",
              "NONE_YOUR_DOTS": "Нет ваших точек",
              "SCORES": "Очки",
              "LOGIN_FORM": "Вход",
              "ACCOUNT": "Имя пользователя",
              "ACCOUNT_REQUIRED": "Имя пользователя является обязательным",
              "PASSWORD": "Пароль",
              "PASSWORD_REQUIRED": "Пароль является обязательным",
              "LOGIN": "Войти",
              "REGISTER": "Создать нового пользователя",
              "MYSTUB_WORKS": "Моя заготовка работает",
              "INVITE_USER": "Приглашение пользователя",
              "INVITED_YOU_TO_PLAY": "пригласил(-а) Вас сыграть в {{name}}!",
              "INVITED_TO_PLAY": "приглашен(-а) сыграть в {{name}} с Вами!",
              "PAGE_NOT_FOUND_WORKS": "Страница не найдена!",
              "REGISTER_FORM": "Регистрация нового пользователя",
              "SEX": "Пол",
              "FIRST_NAME": "Имя",
              "FIRST_NAME_REQUIRED": "Имя является обязательным",
              "LAST_NAME": "Фамилия",
              "LAST_NAME_REQUIRED": "Фамилия является обязательной",
              "REGISTER_SUBMIT": "Создать",
              "TOP_100_FORM": "100 лучших",
              "TOP_100_FORM_DESCRIPTION": "Здесь список наиболее успешных 100 игроков:",
              "EN_LANGUAGE": "English",
              "RU_LANGUAGE": "Русский",
              "UA_LANGUAGE": "Українська",
              "WANT_FINISH": "Вы действительно хотите закончить игру?",
              "WANT_REQUEST_FINISH": "Вы действительно хотите запросить окончание игры?",
              "FINISH_GAME": "Завершение игры",
              "FINISH_REQUESTED": "Вы только что запросили окончание игры",
              "WANT_FINISH_APPROVE": "Вы действительно хотите одобрить запрос на окончание игры от {{userName}}?",
              "FINISH_APPROVED": "Вы только что одобрили запрос на окончание игры от {{userName}}!",
              "WANT_FINISH_DECLINE": "Вы действительно хотите отклонить запрос на окончание игры от {{userName}}?",
              "FINISH_DECLINED": "Вы только что отклонили запрос на окончание игры от {{userName}}!",
              "WANT_PLAY_USER": "Вы действительно хотите поиграть с {{userName}}?",
              "WANT_PLAY_YOURSELF": "Вы действительно хотите поиграть сами с собой?",
              "INVITED_USER": "Вы только что пригласили {{userName}} сыграть с Вами в {{gameDefinitionName}}!",
              "INVITED_YOURSELF": "Вы только что начали играть в {{name}} сами с собой",
              "GO_TO_GAME": "Перейти к игре",
              "WON_MESSAGE": "Поздравляем! Вы только что выиграли!",
              "LOSE_MESSAGE": "Эххх! Вы только что проиграли...",
              "DRAW": "Ничья!",
              "INCOMING_INVITATION_FORM": "Входящее приглашение",
              "WANT_ACCEPT_INVITATION": "Вы действительно хотите принять приглашение пользователя {{userName}} сыграть в {{gameDefinitionName}}?",
              "ACCEPT_SUCCESS": "Вы только что приняли приглашение пользователя {{userName}} сыграть в {{gameDefinitionName}}!",
              "WANT_DECLINE_INVITATION": "Вы действительно хотите отклонить приглашение пользователя {{userName}} сыграть в {{gameDefinitionName}}?",
              "DECLINE_SUCCESS": "Вы только что отклонили приглашение пользователя  {{userName}} сыграть в {{gameDefinitionName}}!",
              "OUTGOING_INVITATION_FORM": "Исходящее приглашение",
              "WANT_CANCEL_INVITATION": "Вы действительно хотите отменить приглашение пользователя {{userName}} сыграть в {{gameDefinitionName}}?",
              "CANCEL_SUCCESS": "Вы только что отменили приглашение пользователя {{userName}} сыграть в {{gameDefinitionName}}!",
              "REGISTRATION_SUCCESS": "Регистрация успешна",
              "GAME_TIC_TAC_TOE": "крестики-нолики",
              "GAME_DOTS": "точки",
              "USERS": "Пользователи"
            }
          })));
        }

        // Ukrainian localization
        if (connection.request.url.startsWith('i18n/uk')) {
          connection.mockRespond(new Response(new ResponseOptions({
            status: 200,
            body: {
              "GAMES_ON_PAPER": "Ігри на папері",
              "CHANGE_COUNTRY": "Мова",
              "CREATE_GAME":"Створити гру",
              "INVITE_USERS_TO_PLAY": "Запросити користувачів до гри",
              "SHOW_MORE": "Показати більше",
              "INVITATIONS": "Запрошення",
              "INCOMING_INVITATIONS": "Вхідні запрошення",
              "INCOMING_INVITATIONS_DESCRIPTION": "Запрошення, що Ви отримали",
              "OUTGOING_INVITATIONS": "Вихідні запрошення",
              "OUTGOING_INVITATIONS_DESCRIPTION": "Запрошення, що Ви надіслали",
              "ACTIVE_GAMES": "Активні ігри",
              "ACTIVE_GAMES_DESCRIPTION": "Ігри, в які зараз грають",
              "FINISHED_GAMES": "Завершені ігри",
              "FINISHED_GAMES_DESCRIPTION": "Ігри, які вже завершено",
              "WELCOME_USER": "Вітаємо, {{username}}!",
              "LOGOUT": "Вийти",
              "PLAYING_WITH_YOURSELF": "Гра проти самого себе",
              "PLAYING_WITH": "Гра проти",
              "GO_TO": "Перейти",
              "FINISH": "Закінчити",
              "USER_WANTS_TO_FINISH": "{{userName}} бажає завершити гру.",
              "YOU_WANT_TO_FINISH": "Ви бажаєте завершити гру. Очікування рішення опонента.",
              "ACCEPT": "Прийняти",
              "DECLINE": "Відхилити",
              "CANCEL": "Скасувати",
              "OK": "Так",
              "PLEASE_WAIT": "Зачекайте, будь-ласка",
              "INVITE_USER_TO_PLAY_GAME": "Запросити користувача зіграти {{name}} з Вами!",
              "INVITE": "Запросити",
              "YOUR_DOTS": "Ваши точки:",
              "YOUR_DOT": "Ваша точка:",
              "NONE_YOUR_DOTS": "Немає ваших точок",
              "SCORES": "Очки",
              "LOGIN_FORM": "Вхід",
              "ACCOUNT": "Им'я користувача",
              "ACCOUNT_REQUIRED": "Им'я користувача є обов'язковим",
              "PASSWORD": "Пароль",
              "PASSWORD_REQUIRED": "Пароль є обов'язковим",
              "LOGIN": "Увійти",
              "REGISTER": "Створити нового користувача",
              "MYSTUB_WORKS": "Моя заготовка працює",
              "INVITE_USER": "Запрошення користувача",
              "INVITED_YOU_TO_PLAY": " запросив(-ла) Вас пограти в {{name}}!",
              "INVITED_TO_PLAY": " запрошений(-на) зіграти в {{name}} з Вами!",
              "PAGE_NOT_FOUND_WORKS": "Сторінку не знайдено!",
              "REGISTER_FORM": "Реєстрація нового користувача",
              "SEX": "Стать",
              "FIRST_NAME": "Им'я",
              "FIRST_NAME_REQUIRED": "Им'я є обов'язковим",
              "LAST_NAME": "Прізвище",
              "LAST_NAME_REQUIRED": "Прізвище є обов'язковим",
              "REGISTER_SUBMIT": "Створити",
              "TOP_100_FORM": "100 найкращих",
              "TOP_100_FORM_DESCRIPTION": "Ось список найуспішніших 100 гравців:",
              "EN_LANGUAGE": "English",
              "RU_LANGUAGE": "Русский",
              "UA_LANGUAGE": "Українська",
              "WANT_FINISH": "Ви дійсно бажаєте завершити гру?",
              "WANT_REQUEST_FINISH": "Ви дійсно бажаєте запросити завершення гри?",
              "FINISH_GAME": "Завершення гри",
              "FINISH_REQUESTED": "Ви щойно запросили завершення гри",
              "WANT_FINISH_APPROVE": "Ви дійсно бажаєте схвалити запит на закінчення гри від {{userName}}?",
              "FINISH_APPROVED": "Ви щойно схвалили запит на закінчення гри від {{userName}}!",
              "WANT_FINISH_DECLINE": "Вы дійсно бажаєте відхилити запит на закінчення гри від {{userName}}?",
              "FINISH_DECLINED": "Ви щойно відхилили запит на закінчення гри від {{userName}}!",
              "WANT_PLAY_USER": "Ви дійсно бажаєте пограти з {{userName}}?",
              "WANT_PLAY_YOURSELF": "Ви дійсно бажаєте пограти сами з собою?",
              "INVITED_USER": "Ви щойно запросили {{userName}} зіграти з Вами в {{gameDefinitionName}}!",
              "INVITED_YOURSELF": "Ви щойно розпочали грати в {{name}} сами с собой",
              "GO_TO_GAME": "Перейти до гри",
              "WON_MESSAGE": "Вітаємо! Ви щойно виграли!",
              "LOSE_MESSAGE": "Охххх! Ви щойно програли...",
              "DRAW": "Нічия!",
              "INCOMING_INVITATION_FORM": "Вхідне запрошення",
              "WANT_ACCEPT_INVITATION": "Ви дійсно бажаєте прийняти запрошення користувача {{userName}} зіграти в {{gameDefinitionName}}?",
              "ACCEPT_SUCCESS": "Ви щойно прийняли запрошення користувача {{userName}} зіграти в {{gameDefinitionName}}!",
              "WANT_DECLINE_INVITATION": "Ви дійсно бажаєте відхилити запрошення користувача {{userName}} зіграти в {{gameDefinitionName}}?",
              "DECLINE_SUCCESS": "Ви щойно відхилили запрошення користувача {{userName}} зіграти в {{gameDefinitionName}}!",
              "OUTGOING_INVITATION_FORM": "Вихідне запрошення",
              "WANT_CANCEL_INVITATION": "Ви дійсно бажаєте скасувати запрошення користувача {{userName}} зіграти в {{gameDefinitionName}}?",
              "CANCEL_SUCCESS": "Ви щойно скасували запрошення користувача {{userName}} зіграти в {{gameDefinitionName}}!",
              "REGISTRATION_SUCCESS": "Реєстрація успішна",
              "GAME_TIC_TAC_TOE": "хрестики-нолики",
              "GAME_DOTS": "точки",
              "USERS": "Користувачі"
            }
          })));
        }

        // authenticate
        if (connection.request.url.endsWith('/api/authenticate') && connection.request.method === RequestMethod.Post) {
          // get parameters from post request
          let params = JSON.parse(connection.request.getBody());

          // find if any user matches login credentials
          let filteredUsers = users.filter(user => {
            return user.username === params.username && user.password === params.password;
          });

          if (filteredUsers.length) {
            // if login details are valid return 200 OK with user details and fake jwt token
            let user = filteredUsers[0];
            connection.mockRespond(new Response(new ResponseOptions({
              status: 200,
              body: {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake_user_token:' + user.username
              }
            })));
          } else {
            // else return 400 bad request
            connection.mockError(new Error('Username or password is incorrect'));
          }
        }

        // get game definitions
        let gameDefinitionsMatch = connection.request.url.match(/\/api\/gamedefinitions\?skip=(\d+)&take=(\d+)$/);
        if (gameDefinitionsMatch && gameDefinitionsMatch.length === 3 && connection.request.method === RequestMethod.Get) {
          let skip = parseInt(gameDefinitionsMatch[1]);
          let take = parseInt(gameDefinitionsMatch[2]);
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({
              status: 200,
              body: gameDefinitionInfos.slice(skip, take + skip)
            })));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({status: 401})));
          }
        }

        // get game definitions count
        if (connection.request.url.endsWith('/api/gamedefinitions/count') && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({status: 200, body: gameDefinitionInfos.length})));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({status: 401})));
          }
        }

        let incoming = [];
        let outgoing = [];
        let active = [];
        let finished = [];
        if (authenticatedUser) {
          for (let gameInfo of gameInfos) {
            for (let playerIdIndex = 0; playerIdIndex < gameInfo.players.length; playerIdIndex++) {
              if (gameInfo.players[playerIdIndex] && gameInfo.players[playerIdIndex].id == authenticatedUser.id) {
                if (gameInfo.state == GameState.new) {
                  if (playerIdIndex > 0) {
                    incoming.push(gameInfo);
                  }
                  else {
                    outgoing.push(gameInfo);
                  }
                }
                if (gameInfo.state == GameState.active) {
                  active.push(gameInfo);
                }
                if (gameInfo.state == GameState.finished) {
                  finished.push(gameInfo);
                }
                break;
              }
            }
          }
        }

        // get incoming invitations
        let incomingMatch = connection.request.url.match(/\/api\/games\/incoming\?skip=(\d+)&take=(\d+)$/);
        if (incomingMatch && incomingMatch.length === 3 && connection.request.method === RequestMethod.Get) {
          let skip = parseInt(incomingMatch[1]);
          let take = parseInt(incomingMatch[2]);
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({
              status: 200,
              body: incoming.slice(skip, take + skip)
            })));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({status: 401})));
          }
        }

        // get incoming invitations count
        if (connection.request.url.endsWith('/api/games/incoming/count') && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({status: 200, body: incoming.length})));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({status: 401})));
          }
        }

        // get outgoing invitations
        let outgoingMatch = connection.request.url.match(/\/api\/games\/outgoing\?skip=(\d+)&take=(\d+)$/);
        if (outgoingMatch && outgoingMatch.length === 3 && connection.request.method === RequestMethod.Get) {
          let skip = parseInt(outgoingMatch[1]);
          let take = parseInt(outgoingMatch[2]);
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({
              status: 200,
              body: outgoing.slice(skip, take + skip)
            })));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({status: 401})));
          }
        }

        // get outgoing invitations count
        if (connection.request.url.endsWith('/api/games/outgoing/count') && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({status: 200, body: outgoing.length})));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({status: 401})));
          }
        }

        // get active games
        let activeMatch = connection.request.url.match(/\/api\/games\/active\?skip=(\d+)&take=(\d+)$/);
        if (activeMatch && activeMatch.length === 3 && connection.request.method === RequestMethod.Get) {
          let skip = parseInt(activeMatch[1]);
          let take = parseInt(activeMatch[2]);
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({
              status: 200,
              body: active.slice(skip, take + skip)
            })));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({status: 401})));
          }
        }

        // get active games count
        if (connection.request.url.endsWith('/api/games/active/count') && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({status: 200, body: active.length})));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({status: 401})));
          }
        }

        // get finished games
        let finishedMatch = connection.request.url.match(/\/api\/games\/finished\?skip=(\d+)&take=(\d+)$/);
        if (finishedMatch && finishedMatch.length === 3 && connection.request.method === RequestMethod.Get) {
          let skip = parseInt(finishedMatch[1]);
          let take = parseInt(finishedMatch[2]);
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          if (authenticatedUser) {
            let result: GameInfo[]=finished.slice(skip, take + skip);
            console.log(JSON.stringify(result));
            connection.mockRespond(new Response(new ResponseOptions({
              status: 200,
              body: result
            })));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({status: 401})));
          }
        }

        // get finished games count
        if (connection.request.url.endsWith('/api/games/finished/count') && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({status: 200, body: finished.length})));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({status: 401})));
          }
        }

        // get users
        let usersMatch = connection.request.url.match(/\/api\/users\?skip=(\d+)&take=(\d+)$/);
        if (usersMatch && usersMatch.length === 3 && connection.request.method === RequestMethod.Get) {
          let skip = parseInt(usersMatch[1]);
          let take = parseInt(usersMatch[2]);
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({
              status: 200,
              body: userInfos.slice(skip, take + skip)
            })));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({status: 401})));
          }
        }

        // get users count
        let usersCountMatch = connection.request.url.match(/\/api\/users\/count$/);
        if (usersCountMatch && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({status: 200, body: users.length})));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({status: 401})));
          }
        }

        // get game definition by id
        let gameDefinitionDetailsMatch = connection.request.url.match(/\/api\/gamedefinitions\/(\d+)$/);
        if (gameDefinitionDetailsMatch && gameDefinitionDetailsMatch.length > 1 && connection.request.method === RequestMethod.Get) {
          let gameDefinitionDetailsId = parseInt(gameDefinitionDetailsMatch[1]);

          // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
          if (authenticatedUser) {

            // find user by id in users array
            let gameDefinition: GameDefinitionDetails = getGameDefinitionDetailsById(gameDefinitionDetailsId);

            // respond 200 OK with user
            connection.mockRespond(new Response(new ResponseOptions({status: 200, body: gameDefinition})));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({status: 401})));
          }
        }

        // get game by id
        let gamesMatch = connection.request.url.match(/\/api\/games\/(\d+)$/);
        if (gamesMatch && gamesMatch.length > 1 && connection.request.method === RequestMethod.Get) {
          let gameId = parseInt(gamesMatch[1]);
          // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
          if (authenticatedUser) {
            let gameDetails: GameDetails = getGameDetailsById(gameId);

            // respond 200 OK with user
            connection.mockRespond(new Response(new ResponseOptions({status: 200, body: gameDetails})));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({status: 401})));
          }
        }

        // make tic-tac-toe game move
        if (connection.request.url.endsWith('/api/games/tictactoe') && connection.request.method === RequestMethod.Post) {
          // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
          if (authenticatedUser) {
            // get new game object from post body
            let moveVm: GameTicTacToeMoveViewModel = JSON.parse(connection.request.getBody());
            let game: Game = getGameById(moveVm.gameId);

            if (checkCell(game, moveVm.rowIndex, moveVm.columnIndex, authenticatedUser.id)){
              localStorage.setItem('games', JSON.stringify(games));
            }
            // respond 200 OK with user
            connection.mockRespond(new Response(new ResponseOptions({status: 200})));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({status: 401})));
          }
        }

        // make dots game move
        if (connection.request.url.endsWith('/api/games/dots') && connection.request.method === RequestMethod.Post) {
          // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
          if (authenticatedUser) {
            // get new game object from post body
            let moveVm: GameDotsMoveViewModel = JSON.parse(connection.request.getBody());
            let game: Game = getGameById(moveVm.gameId);

            if (makeTurnDots(game, moveVm.indexX, moveVm.indexY, authenticatedUser.id)){
              localStorage.setItem('games', JSON.stringify(games));
            }
            // respond 200 OK with user
            connection.mockRespond(new Response(new ResponseOptions({status: 200})));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({status: 401})));
          }
        }

        // get user by id
        if (connection.request.url.match(/\/api\/users\/\d+$/) && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
          if (authenticatedUser) {
            // find user by id in users array
            let urlParts = connection.request.url.split('/');
            let id = parseInt(urlParts[urlParts.length - 1]);
            let matchedUsers = users.filter(user => {
              return user.id === id;
            });
            let user = matchedUsers.length ? matchedUsers[0] : null;

            // respond 200 OK with user
            connection.mockRespond(new Response(new ResponseOptions({status: 200, body: user})));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({status: 401})));
          }
        }

        // create game
        if (connection.request.url.endsWith('/api/games') && connection.request.method === RequestMethod.Post) {
          if (authenticatedUser) {
            // get new game object from post body
            let newGameCreateVm: CreateGameViewModel = JSON.parse(connection.request.getBody());
            let playerIds = [authenticatedUser.id];
            for (let playerId of newGameCreateVm.playerIds){
              playerIds.push(playerId);
            }

            let data: any = null;
            if (newGameCreateVm.gameDefinitionId == 1) {//tic-tac-toe
              data = getNewTicTacToeGameData();
            }
            else if (newGameCreateVm.gameDefinitionId == 2) {//dots
              data = getNewDotsGameData();
            }

            let newGame: Game = {
              id: games.length + 1,
              data: data,
              createdDate: new Date(),
              createdById: authenticatedUser.id,
              playerIds: playerIds,
              winnerId: null,
              gameDefinitionId: newGameCreateVm.gameDefinitionId,
              state: hasSameItems(playerIds)
                ? GameState.active
                : GameState.new
            };

            // save new game
            games.push(newGame);
            localStorage.setItem('games', JSON.stringify(games));

            // respond 200 OK
            connection.mockRespond(new Response(new ResponseOptions({status: 200, body: newGame.id})));
          }
          else {
            connection.mockRespond(new Response(new ResponseOptions({status: 401})));
          }
        }

        // create user
        if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Post) {
          // get new user object from post body
          let createUserViewModel: CreateUserViewModel = JSON.parse(connection.request.getBody());
          let newUser: UserDetails = {
            id: users.length + 1,
            sex: createUserViewModel.sex,
            firstName: createUserViewModel.firstName,
            lastName: createUserViewModel.lastName,
            password: createUserViewModel.password,
            username: createUserViewModel.username,
            userPic: createUserViewModel.userPic
          };

          // validation
          let duplicateUser = users.filter(user => {
            return user.username === newUser.username;
          }).length;
          if (duplicateUser) {
            return connection.mockError(new Error('Username "' + newUser.username + '" is already taken'));
          }

          // save new user
          newUser.id = users.length + 1;
          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));

          // respond 200 OK
          connection.mockRespond(new Response(new ResponseOptions({status: 200})));
        }

        let gameAcceptMatch = connection.request.url.match(/\/api\/games\/(\d+)\/accept$/);
        if (gameAcceptMatch && gameAcceptMatch.length > 1 && connection.request.method === RequestMethod.Post) {
          let id = parseInt(gameAcceptMatch[1]);
          for (let game of games) {
            if (game.id == id) {
              game.state = GameState.active;
              localStorage.setItem('games', JSON.stringify(games));
              // respond 200 OK
              connection.mockRespond(new Response(new ResponseOptions({status: 200})));
              return;
            }
          }
          connection.mockRespond(new Response(new ResponseOptions({status: 401})))
        }

        let gameDeclineMatch = connection.request.url.match(/\/api\/games\/(\d+)\/decline$/);
        if (gameDeclineMatch && gameDeclineMatch.length > 1 && connection.request.method === RequestMethod.Post) {
          let id = parseInt(gameDeclineMatch[1]);
          for (let game of games) {
            if (game.id == id) {
              game.state = GameState.declined;
              localStorage.setItem('games', JSON.stringify(games));
              // respond 200 OK
              connection.mockRespond(new Response(new ResponseOptions({status: 200})));
              return;
            }
          }
          connection.mockRespond(new Response(new ResponseOptions({status: 401})))
        }

        let gameFinishingRequestsMatch = connection.request.url.match(/\/api\/gamefinishingrequests$/);
        if (gameFinishingRequestsMatch && gameFinishingRequestsMatch.length > 0 && connection.request.method === RequestMethod.Post) {
          if (authenticatedUser) {
            let createGameFinishRequestViewModel: CreateGameFinishRequestViewModel = JSON.parse(connection.request.getBody());
            for (let game of games) {
              if (game.id == createGameFinishRequestViewModel.gameId) {
                let state: GameFinishRequestState = hasSameItems(game.playerIds) ? GameFinishRequestState.approved : GameFinishRequestState.new;
                let gameFinishRequest: GameFinishRequest = {
                  state: state,
                  gameId: game.id,
                  id: gameFinishRequests.length + 1,
                  createdDate: new Date(),
                  createdById: authenticatedUser.id
                };
                gameFinishRequests.push(gameFinishRequest);
                localStorage.setItem('gameFinishRequests', JSON.stringify(gameFinishRequests));
                if (state == GameFinishRequestState.approved){
                  game.state = GameState.finished;
                  localStorage.setItem('games', JSON.stringify(games));
                }
                // respond 200 OK
                connection.mockRespond(new Response(new ResponseOptions({status: 200, body: gameFinishRequest.id})));
                return;
              }
            }
          }

          connection.mockRespond(new Response(new ResponseOptions({status: 401})))
        }

        let gameFinishingRequestsApprovedMatch = connection.request.url.match(/\/api\/gamefinishingrequests\/(\d+)\/approve$/);
        if (gameFinishingRequestsApprovedMatch && gameFinishingRequestsApprovedMatch.length > 1 && connection.request.method === RequestMethod.Post) {
          let id = parseInt(gameFinishingRequestsApprovedMatch[1]);
          for (let gameFinishRequest of gameFinishRequests) {
            if (gameFinishRequest.id == id) {
              gameFinishRequest.state = GameFinishRequestState.approved;
              localStorage.setItem('gameFinishRequests', JSON.stringify(gameFinishRequests));
              // set game.state to finished
              for (let game of games) {
                if (game.id == gameFinishRequest.gameId) {
                  game.state = GameState.finished;
                  localStorage.setItem('games', JSON.stringify(games));
                  break;
                }
              }
              // respond 200 OK
              connection.mockRespond(new Response(new ResponseOptions({status: 200})));
              return;
            }
          }
          connection.mockRespond(new Response(new ResponseOptions({status: 401})))
        }

        let gameFinishingRequestsDeclinedMatch = connection.request.url.match(/\/api\/gamefinishingrequests\/(\d+)\/decline$/);
        if (gameFinishingRequestsDeclinedMatch && gameFinishingRequestsDeclinedMatch.length > 1 && connection.request.method === RequestMethod.Post) {
          let id = parseInt(gameFinishingRequestsDeclinedMatch[1]);
          for (let gameFinishRequest of gameFinishRequests) {
            if (gameFinishRequest.id == id) {
              gameFinishRequest.state = GameFinishRequestState.declined;
              localStorage.setItem('gameFinishRequests', JSON.stringify(gameFinishRequests));
              // respond 200 OK
              connection.mockRespond(new Response(new ResponseOptions({status: 200})));
              return;
            }
          }
          connection.mockRespond(new Response(new ResponseOptions({status: 401})))
        }

        // delete user
        if (connection.request.url.match(/\/api\/users\/\d+$/) && connection.request.method === RequestMethod.Delete) {
          // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
          let authenticatedUser = getUserFromToken(connection.request.headers.get('Authorization'));
          if (authenticatedUser) {
            // find user by id in users array
            let urlParts = connection.request.url.split('/');
            let id = parseInt(urlParts[urlParts.length - 1]);
            for (let i = 0; i < users.length; i++) {
              let user = users[i];
              if (user.id === id) {
                // delete user
                users.splice(i, 1);
                localStorage.setItem('users', JSON.stringify(users));
                break;
              }
            }
            // respond 200 OK
            connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
          }
        }
//        console.log('connection request'+JSON.stringify(connection.request));
//        console.log('connection response'+connection.response);

      }, 500);

    });

    return new Http(backend, options);
  },
  deps: [MockBackend, BaseRequestOptions]
};
