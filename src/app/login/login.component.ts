import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../authentication.service";
import {AlertService} from "../alert.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
  private alertService: AlertService,
  private router: Router) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
  }

  onSubmit() {
    this.loading = true;
    this.authenticationService
      .login(this.login_username, this.login_password)
      .subscribe(
        data => {
          this.router.navigate(['/']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  loading: boolean = false;
  login_username: string = "";
  login_password: string = "";
}
