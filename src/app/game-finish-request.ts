import {GameFinishRequestState} from "./game-finish-request-state.enum";

export interface GameFinishRequest {
  id: any;
  createdById: any;
  createdDate: Date;
  gameId: any;
  state: GameFinishRequestState;
}
