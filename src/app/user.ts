import { Sex } from "./sex.enum";

export interface UserInfo {
  id: any;
  sex: Sex;
  userPic: any;
  userName: string;
}

export interface UserDetails {
  id: any;
  sex: Sex;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  userPic: any;
}

export interface User {
  id: any;
  sex: Sex;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  userPic: any;
}
