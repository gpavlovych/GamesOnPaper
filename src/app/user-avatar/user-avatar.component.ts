import {Component, OnInit, Input} from '@angular/core';
import {UserInfo, UserDetails} from "../user";
import {Sex} from "../sex.enum";

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.css']
})
export class UserAvatarComponent implements OnInit {

  @Input() userDetails: UserDetails;
  @Input() user: UserInfo;

  constructor() { }

  ngOnInit() {
  }

  getUserImage() {
    let maleDefaultImage = "assets/images/male_unknown.png";
    let femaleDefaultImage = "assets/images/female_unknown.png";
    let result = maleDefaultImage;

    if (this.user != null) {
      result = this.user.userPic || (this.user.sex == Sex.female ? femaleDefaultImage : maleDefaultImage)
    }

    if (this.userDetails != null) {
      result = this.userDetails.userPic || (this.userDetails.sex == Sex.female ? femaleDefaultImage : maleDefaultImage)
    }

    return result;
  }
}
