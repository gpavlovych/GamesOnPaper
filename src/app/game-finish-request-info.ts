import {GameFinishRequestState} from "./game-finish-request-state.enum";
import {UserInfo} from "./user";

export interface GameFinishRequestInfo {
  id: any,
  createdBy: UserInfo,
  createdDate: Date,
  state: GameFinishRequestState
}
