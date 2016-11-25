import {UserInfo} from "./user";
import {GameState} from "./game-state.enum";
import {GameDefinitionInfo} from "./game-definition";

export interface GameInfo{
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
