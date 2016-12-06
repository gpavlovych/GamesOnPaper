import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {AuthenticationService} from "./authentication.service";
import {CreateGameViewModel} from "./view-models/create-game-view-model";
import {CreateGameFinishRequestViewModel} from "./view-models/create-game-finish-request-view-model";
import {GameFinishRequestState} from "./game-finish-request-state.enum";

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

  requestFinish(gameFinishRequest: CreateGameFinishRequestViewModel)
  {
    return this.http.post('/api/gamefinishingrequests', gameFinishRequest, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  requestFinishApprove(id: any)
  {
    return this.http.post('/api/gamefinishingrequests/'+id+'/approve', this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  requestFinishDecline(id: any)
  {
    return this.http.post('/api/gamefinishingrequests/'+id+'/decline', this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }
}
