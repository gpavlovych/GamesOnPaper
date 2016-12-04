import {Component, OnInit, Input} from '@angular/core';
import {UserInfo} from "../user";
import {Sex} from "../sex.enum";

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.css']
})
export class UserAvatarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  @Input() user: UserInfo;
  getUserImage() {
    let maleDefaultImage = "assets/images/male_unknown.png";
    let femaleDefaultImage = "assets/images/female_unknown.png";
    let result = maleDefaultImage;
    if (this.user != null) {
      result = this.user.userPic || (this.user.sex == Sex.female ? femaleDefaultImage : maleDefaultImage)
    }
    return result;
  }
}
