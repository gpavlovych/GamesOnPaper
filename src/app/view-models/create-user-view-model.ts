import {Sex} from "../sex.enum";
export interface CreateUserViewModel {
  sex: Sex;
  lastName: string;
  firstName: string;
  username: string;
  password: string;
  userPic: any;
}
