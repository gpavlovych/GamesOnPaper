import {GameDotsDataPolygonPoint} from "./game-dots/game-dots-data-polygon-point";

export enum LineIntersectResult{
  none = 0,
  adjacent = 1,
  intersect = 3
}

interface Denominator {
  x: number,
  y: number,
  onLine1: boolean,
  onLine2: boolean
}

export class LineService {
  public static pointBelongsToLine(point: GameDotsDataPolygonPoint, line: GameDotsDataPolygonPoint[]): boolean {
    let a = (line[1].y - line[0].y) / (line[1].x - line[0].x);
    let b = line[0].y - a * line[0].x;
    return (point.y == (a * point.x + b) && ((line[1].x - point.x) * (point.x - line[0].x) >= 0));
  }

  private static checkLineIntersection(line1StartX: number, line1StartY: number, line1EndX: number, line1EndY: number, line2StartX: number, line2StartY: number, line2EndX: number, line2EndY: number): Denominator {
  // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
  let denominator, a, b, numerator1, numerator2, result: Denominator = {
    x: null,
    y: null,
    onLine1: false,
    onLine2: false
  };
  denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
  if (denominator == 0) {
    return result;
  }
  a = line1StartY - line2StartY;
  b = line1StartX - line2StartX;
  numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
  numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
  a = numerator1 / denominator;
  b = numerator2 / denominator;

  // if we cast these lines infinitely in both directions, they intersect here:
  result.x = line1StartX + (a * (line1EndX - line1StartX));
  result.y = line1StartY + (a * (line1EndY - line1StartY));
  /*
   // it is worth noting that this should be the same as:
   x = line2StartX + (b * (line2EndX - line2StartX));
   y = line2StartX + (b * (line2EndY - line2StartY));
   */
  // if line1 is a segment and line2 is infinite, they intersect if:
  if (a > 0 && a < 1) {
    result.onLine1 = true;
  }
  // if line2 is a segment and line1 is infinite, they intersect if:
  if (b > 0 && b < 1) {
    result.onLine2 = true;
  }
  // if line1 and line2 are segments, they intersect if both of the above are true
  return result;
}

  public static intersect(line1: GameDotsDataPolygonPoint[], line2: GameDotsDataPolygonPoint[]): LineIntersectResult {

    let samePointsAmount = 0;
    if (line1[0].x == line2[0].x && line1[0].y == line2[0].y)
      samePointsAmount++;
    if (line1[0].x == line2[1].x && line1[0].y == line2[1].y)
      samePointsAmount++;
    if (line1[1].x == line2[0].x && line1[1].y == line2[0].y)
      samePointsAmount++;
    if (line1[1].x == line2[1].x && line1[1].y == line2[1].y)
      samePointsAmount++;
    if (samePointsAmount > 0) {
      return LineIntersectResult.adjacent;
    }

    let result = LineService.checkLineIntersection(line1[0].x, line1[0].y, line1[1].x, line1[1].y, line2[0].x, line2[0].y, line2[1].x, line2[1].y);
    if (result.onLine1 && result.onLine2) {
      return LineIntersectResult.intersect;
    }

    return LineIntersectResult.none;
  }
}
