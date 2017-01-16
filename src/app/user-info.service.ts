import { Injectable } from '@angular/core';
import {AuthenticationService} from "./authentication.service";
import {UserService} from "./user.service";
import {Observable} from "rxjs";
import {UserDetails} from "./user";

@Injectable()
export class UserInfoService {

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService) {
  }

  getCurrentUser(): Observable<UserDetails>{
    let currentUserId = this.authenticationService.getAuthorizedUserId();
    return this.userService.getById(currentUserId);
  }
}
