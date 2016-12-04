import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../authentication.service";
import {AlertService} from "../alert.service";
import {Router} from "@angular/router";
import {RefreshService} from "../refresh.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
  private alertService: AlertService,
  private router: Router,
  private refreshService: RefreshService) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
    this.refreshService.refresh();
  }

  onSubmit() {
    this.loading = true;
    this.authenticationService
      .login(this.login_username, this.login_password)
      .subscribe(
        () => {
          this.router.navigate(['/']);
          this.refreshService.refresh();
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
