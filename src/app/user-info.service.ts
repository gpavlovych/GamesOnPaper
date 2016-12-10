import { Injectable } from '@angular/core';
import {AuthenticationService} from "./authentication.service";
import {UserService} from "./user.service";

@Injectable()
export class UserInfoService {

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService) {
  }

  getCurrentUser(){
    let currentUserId = this.authenticationService.getAuthorizedUserId();
    return this.userService.getById(currentUserId);
  }
}
