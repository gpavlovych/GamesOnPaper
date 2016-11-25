import { Component, OnInit } from '@angular/core';
import {UserDetails} from "../user";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor() { }

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
    this.submitted = true;
  }

  submitted: boolean = false;
  user: UserDetails;
}
