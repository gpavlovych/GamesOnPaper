import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {GameDefinitionInfo, GameDefinitionDetails} from "./game-definition";
import { GameInfo } from "./game";
import {GameState} from "./game-state.enum";
import {UserInfo, UserDetails} from "./user";
import {CreateGameViewModel} from "./view-models/create-game-view-model";
import {GameViewModel} from "./view-models/game-view-model";
import {CreateUserViewModel} from "./view-models/create-user-view-model";

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: Http,
  useFactory: (backend: MockBackend, options: BaseRequestOptions) => {
    // array in local storage for registered users
    let users: any[] = JSON.parse(localStorage.getItem('users')) || [];
    let games: any[] = JSON.parse(localStorage.getItem('games')) || [];
    function getUserFromToken(token: string) {
      if (token) {
        console.log(token);
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

    function toIdDictionary(arr: any[]){
      var result = {};
      for (let arrItem of arr) {
        result[arrItem.id] = arrItem;
      }
      return result;
    }

    let gameDefinitionInfos: GameDefinitionInfo[] = [
      {
        id: 1,
        name: 'tic-tac-toe',
        icon: ''
      },
      {
        id: 2,
        name: 'dots',
        icon: ''
      }
    ];

    let userInfos: UserInfo[]=[];
    for (let user of users){
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

    let gameInfos: GameInfo[]= [];
    for (let game of games) {
      let gameDefinitionInfo: GameDefinitionInfo = gameDefinitionInfosDictionary[game.gameDefinitionId];

      let players: UserInfo[] = [];
      for (let playerId of game.playerIds) {
        players.push(userInfosDictionary[playerId]);
      }

      let gameInfo: GameInfo = {
        gameDefinition: gameDefinitionInfo,
        players: players,
        activePlayer: 0,
        state: game.state,
        id: game.id,
        winner: game.winner
      };

      gameInfos.push(gameInfo);
    }

    // configure fake backend
    backend.connections.subscribe((connection: MockConnection) => {
      console.log('connection!');
      // wrap in timeout to simulate server api call
      setTimeout(() => {
        let authenticatedUser = getUserFromToken(connection.request.headers.get('Authorization'));

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
                token: 'fake_user_token:'+user.username
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
            connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: gameDefinitionInfos.slice(skip, take+skip) })));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
          }
        }

        // get game definitions count
        if (connection.request.url.endsWith('/api/gamedefinitions/count') && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: gameDefinitionInfos.length })));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
          }
        }

        let incoming = [];
        let outgoing = [];
        let active = [];
        let finished = [];
        if (authenticatedUser) {
          for (let gameInfo of gameInfos) {
            for (let playerIdIndex = 0; playerIdIndex < gameInfo.players.length; playerIdIndex++) {
              if (gameInfo.players[playerIdIndex].id == authenticatedUser.id) {
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
            connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: incoming.slice(skip, take+skip) })));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
          }
        }

        // get incoming invitations count
        if (connection.request.url.endsWith('/api/games/incoming/count') && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          let authenticatedUser = getUserFromToken(connection.request.headers.get('Authorization'));
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: incoming.length })));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
          }
        }

        // get outgoing invitations
        let outgoingMatch = connection.request.url.match(/\/api\/games\/outgoing\?skip=(\d+)&take=(\d+)$/);
        if (outgoingMatch && outgoingMatch.length === 3 && connection.request.method === RequestMethod.Get) {
          let skip = parseInt(outgoingMatch[1]);
          let take = parseInt(outgoingMatch[2]);
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          let authenticatedUser = getUserFromToken(connection.request.headers.get('Authorization'));
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: outgoing.slice(skip, take+skip) })));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
          }
        }

        // get outgoing invitations count
        if (connection.request.url.endsWith('/api/games/outgoing/count') && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          let authenticatedUser = getUserFromToken(connection.request.headers.get('Authorization'));
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: outgoing.length })));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
          }
        }

        // get active games
        let activeMatch = connection.request.url.match(/\/api\/games\/active\?skip=(\d+)&take=(\d+)$/);
        if (activeMatch && activeMatch.length === 3 && connection.request.method === RequestMethod.Get) {
          let skip = parseInt(activeMatch[1]);
          let take = parseInt(activeMatch[2]);
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          let authenticatedUser = getUserFromToken(connection.request.headers.get('Authorization'));
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: active.slice(skip, take+skip) })));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
          }
        }

        // get active games count
        if (connection.request.url.endsWith('/api/games/active/count') && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          let authenticatedUser = getUserFromToken(connection.request.headers.get('Authorization'));
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: active.length })));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
          }
        }

        // get finished games
        let finishedMatch = connection.request.url.match(/\/api\/games\/finished\?skip=(\d+)&take=(\d+)$/);
        if (finishedMatch && finishedMatch.length === 3 && connection.request.method === RequestMethod.Get) {
          let skip = parseInt(finishedMatch[1]);
          let take = parseInt(finishedMatch[2]);
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          let authenticatedUser = getUserFromToken(connection.request.headers.get('Authorization'));
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: finished.slice(skip, take+skip) })));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
          }
        }

        // get finished games count
        if (connection.request.url.endsWith('/api/games/finished/count') && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          let authenticatedUser = getUserFromToken(connection.request.headers.get('Authorization'));
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: finished.length })));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
          }
        }

        // get users
        let usersMatch = connection.request.url.match(/\/api\/users\?skip=(\d+)&take=(\d+)$/);
        if (usersMatch && usersMatch.length === 3 && connection.request.method === RequestMethod.Get) {
          let skip = parseInt(usersMatch[1]);
          let take = parseInt(usersMatch[2]);
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          let authenticatedUser = getUserFromToken(connection.request.headers.get('Authorization'));
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: users.slice(skip, take+skip)})));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
          }
        }

        // get users count
        let usersCountMatch = connection.request.url.match(/\/api\/users\/count$/);
        if (usersCountMatch && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          let authenticatedUser = getUserFromToken(connection.request.headers.get('Authorization'));
          if (authenticatedUser) {
            connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: users.length})));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
          }
        }

        // get game definition by id
        if (connection.request.url.match(/\/api\/gamedefinitions\/\d+$/) && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
          let authenticatedUser = getUserFromToken(connection.request.headers.get('Authorization'));
          if (authenticatedUser) {
            // find user by id in users array
            let urlParts = connection.request.url.split('/');
            let id = parseInt(urlParts[urlParts.length - 1]);

            let gameDefinition: GameDefinitionDetails = {id: id, icon:"", name:"tic tac toe"};

            // respond 200 OK with user
            connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: gameDefinition })));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
          }
        }

        // get user by id
        if (connection.request.url.match(/\/api\/users\/\d+$/) && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
          let authenticatedUser = getUserFromToken(connection.request.headers.get('Authorization'));
          if (authenticatedUser) {
            // find user by id in users array
            let urlParts = connection.request.url.split('/');
            let id = parseInt(urlParts[urlParts.length - 1]);
            let matchedUsers = users.filter(user => { return user.id === id; });
            let user = matchedUsers.length ? matchedUsers[0] : null;

            // respond 200 OK with user
            connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: user })));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
          }
        }

        // create game
        if (connection.request.url.endsWith('/api/games') && connection.request.method === RequestMethod.Post) {
          // get new game object from post body
          let newGameCreateVm: CreateGameViewModel = JSON.parse(connection.request.getBody());
          let newGame: GameViewModel = {
            id: games.length+1,
            data: {},
            playerIds: newGameCreateVm.playerIds,
            gameDefinitionId: newGameCreateVm.gameDefinitionId,
            state: GameState.new
          };

          // save new game
          games.push(newGame);
          localStorage.setItem('games', JSON.stringify(games));

          // respond 200 OK
          connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: newGame.id })));
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
          let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
          if (duplicateUser) {
            return connection.mockError(new Error('Username "' + newUser.username + '" is already taken'));
          }

          // save new user
          newUser.id = users.length + 1;
          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));

          // respond 200 OK
          connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
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
        console.log('connection request'+JSON.stringify(connection.request));
        console.log('connection response'+connection.response);

      }, 500);

    });

    return new Http(backend, options);
  },
  deps: [MockBackend, BaseRequestOptions]
};
