import { Injectable } from '@angular/core';
import { RequestOptions, Headers, Response, Http } from "@angular/http";
import {UserDetails, UserInfo} from "./user";
import { AuthenticationService } from "./authentication.service";
import {CreateUserViewModel} from "./view-models/create-user-view-model";
import {Observable} from "rxjs";

@Injectable()
export class UserService {

  constructor(
    private http: Http,
    private authenticationService: AuthenticationService) { }

  getAll(skip: number, take: number): Observable<UserInfo[]> {
    return this.http.get('/api/users?skip=' + skip + '&take=' + take, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  getAllCount(): Observable<number> {
    return this.http.get('/api/users/count', this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  getById(id: number): Observable<UserDetails> {
    return this.http.get('/api/users/' + id, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  create(user: CreateUserViewModel) {
    return this.http.post('/api/users', user, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  update(user: UserDetails) {
    return this.http.put('/api/users/' + user.id, user, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  delete(id: number) {
    return this.http.delete('/api/users/' + id, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }
}
