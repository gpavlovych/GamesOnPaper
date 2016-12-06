import { UserInfo } from "./user";
import { GameState } from "./game-state.enum";
import { GameDefinitionInfo } from "./game-definition";
import { GameFinishRequestInfo } from "./game-finish-request-info";

export interface GameInfo {
  id: any;
  gameDefinition: GameDefinitionInfo;
  state: GameState;
  players: UserInfo[];
  createdBy: UserInfo;
  createdDate: Date;
  finishRequests: GameFinishRequestInfo[];
  winner: UserInfo;
}

export interface GameDetails {
  id: any;
  gameDefinition: GameDefinitionInfo;
  state: GameState;
  players: UserInfo[];
  createdBy: UserInfo;
  createdDate: Date;
  winner: UserInfo;
  data: any;
}

export interface Game {
  id: any;
  gameDefinitionId: any;
  state: GameState;
  createdById: any;
  createdDate: Date;
  playerIds: any[];
  winnerId: any;
  data: any;
}
