import { UserInfo } from "./user";
import { GameState } from "./game-state.enum";
import { GameDefinitionInfo } from "./game-definition";

export interface GameInfo {
  id: any;
  gameDefinition: GameDefinitionInfo;
  state: GameState;
  players: UserInfo[];
  activePlayer: number;
  winner: number;
}

export interface GameDetails<T> {
  id: any;
  gameDefinition: GameDefinitionInfo;
  state: GameState;
  players: UserInfo[];
  activePlayer: number;
  winner: number;
  data: T;
}

export interface FinishRequestInfo {
  id: any;
  game: GameInfo;
  createdBy: UserInfo;
  approvals: FinishApprovalInfo[];
}

export interface FinishApprovalInfo {
  finishRequestId: any;
  approvedBy: UserInfo;
  state: FinishApprovalState;
}

export enum FinishApprovalState {
  approved  = 0,
  rejected = 1
}
