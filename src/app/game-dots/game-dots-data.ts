import {GameDotsDataDot} from "./game-dots-data-dot";
import {GameDotsDataPolygon} from "./game-dots-data-polygon";

export interface GameDotsData {
  activePlayer: number;
  dots: GameDotsDataDot[][];
  polygons: GameDotsDataPolygon[];
  scores: number[];
  remainingMoves: number;
}
