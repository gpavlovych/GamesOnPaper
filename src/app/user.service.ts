import { Injectable } from '@angular/core';
import { RequestOptions, Headers, Response, Http } from "@angular/http";
import { UserDetails } from "./user";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class UserService {

  constructor(
    private http: Http,
    private authenticationService: AuthenticationService) { }

  getAll(skip: number, take: number) {
    return this.http.get('/api/users?skip=' + skip + '&take=' + take, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  getAllCount() {
    return this.http.get('/api/users/count', this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  getById(id: number) {
    return this.http.get('/api/users/' + id, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  create(user: UserDetails) {
    return this.http.post('/api/users', user, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  update(user: UserDetails) {
    return this.http.put('/api/users/' + user.id, user, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }

  delete(id: number) {
    return this.http.delete('/api/users/' + id, this.authenticationService.getAuthorizedRequestOptions()).map((response: Response) => response.json());
  }
}
