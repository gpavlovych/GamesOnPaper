import {LineService, LineIntersectResult} from "./line-service";
import {GameDotsDataPolygonPoint} from "./game-dots/game-dots-data-polygon-point";
export class PolygonService {
  /**
   * Created by pavlheo on 5/31/2016.
   */
  public static checkPolygonSelfIntersect(vertices: GameDotsDataPolygonPoint[]): boolean {
    let edges = [];
    for (let i = 0; i < vertices.length; i++) {
      edges.push([vertices[i], vertices[(i + 1) % vertices.length]])
    }
    for (let i = 0; i < edges.length - 1; i++)
      for (let j = i + 1; j < edges.length; j++) {
        if (LineService.intersect(edges[i], edges[j]) == LineIntersectResult.intersect) {
          return true;
        }
      }
    return false;
  }

  public static checkPointInsidePoly(point: GameDotsDataPolygonPoint, vertices: GameDotsDataPolygonPoint[]): boolean {
    let polyCorners = vertices.length;
    let i, j = polyCorners - 1;
    let oddNodes = false;
    for (i = 0; i < polyCorners; i++) {
      if (vertices[i].x == point.x && vertices[i].y == point.y) {
        return true;
      }
      if (LineService.pointBelongsToLine(point, [vertices[i], vertices[(i + 1) % vertices.length]])) {
        return true;
      }
      if (vertices[i].y < point.y && vertices[j].y >= point.y
        || vertices[j].y < point.y && vertices[i].y >= point.y) {
        if (vertices[i].x + (point.y - vertices[i].y) / (vertices[j].y - vertices[i].y) * (vertices[j].x - vertices[i].x) < point.x) {
          oddNodes = !oddNodes;
        }
      }
      j = i;
    }
    return oddNodes;
  }
}
