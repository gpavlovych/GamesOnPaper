import { Component, OnInit } from '@angular/core';
import { UserDetails } from "../user";
import { AlertService } from "../alert.service";
import { UserService } from "../user.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor( private router: Router,
               private userService: UserService,
               private alertService: AlertService) { }

  ngOnInit() {
    this.newUser();
  }

  newUser(){
    this.user = {
      id: '',
      lastName: '',
      firstName: '',
      username: '',
      password: '',
      userPic: ''
    };
  }

  onSubmit(){
    this.loading = true;
    this.userService
      .create(this.user)
      .subscribe(
        data => {
          // set success message and pass true paramater to persist the message after redirecting to the login page
          this.alertService.success('Registration successful', true);
          this.router.navigate(['/login']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  loading: boolean = false;
  user: UserDetails;
}
