import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import { AuthenticationService } from "./authentication.service";
import {GameDefinitionInfo} from "./game-definition";
import {GameDetails, FinishRequestInfo, FinishApprovalState} from "./game";
import {GameState} from "./game-state.enum";
import {CreateGameViewModel} from "./view-models/create-game-view-model";

@Injectable()
export class GameService {

  constructor(
    private http: Http,
    private authenticationService: AuthenticationService) { }

  getGameDefinitionDetails(id: number)
  {
    return this.http.get('/api/gamedefinitions/'+id, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  getGameDefinitions(skip: number, take: number)
  {
    return this.http.get('/api/gamedefinitions?skip=' + skip + '&take=' + take, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  getGameDefinitionsCount()
  {
    return this.http.get('/api/gamedefinitions/count', this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  getOutgoing(skip: number, take: number)
  {
    return this.http.get('/api/games/outgoing?skip=' + skip + '&take=' + take, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  getOutgoingCount()
  {
    return this.http.get('/api/games/outgoing/count', this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  getIncoming(skip: number, take: number)
  {
    return this.http.get('/api/games/incoming?skip=' + skip + '&take=' + take, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  getIncomingCount()
  {
    return this.http.get('/api/games/incoming/count', this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  getActive(skip: number, take: number)
  {
    return this.http.get('/api/games/active?skip=' + skip + '&take=' + take, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  getActiveCount()
  {
    return this.http.get('/api/games/active/count', this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  getFinished(skip: number, take: number)
  {
    return this.http.get('/api/games/finished?skip=' + skip + '&take=' + take, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  getFinishedCount()
  {
    return this.http.get('/api/games/finished/count', this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  getById(id: any)
  {
    return this.http.get('/api/games/' + id, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  accept(id: any)
  {
    return this.http.post('/api/games/'+id+'/accept', this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  decline(id: any)
  {
    return this.http.post('/api/games/'+id+'/decline', this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  create(game: CreateGameViewModel)
  {
    return this.http.post('/api/games', game, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  update<T>(game: GameDetails<T>)
  {
    return this.http.put('/api/games/' + game.id, game, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  getFinishRequests(gameId: any)
  {
    return this.http.get('/api/gamefinishes?gameId='+gameId, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  createFinishRequest(gameId: any)
  {
    return this.http.post('/api/gamefinishes', {gameId: gameId}, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  createFinishApproval(finishRequestId: any, state: FinishApprovalState)
  {
    return this.http.post('/api/gamefinishapprovals', {finishRequestId: finishRequestId, state: state}, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }
}
