import {GameState} from "../game-state.enum";

export interface GameViewModel {
  id: number;
  state: GameState;
  playerIds: number[];
  gameDefinitionId: number;
  data: any;
}
