import {Component, OnInit, Input, ViewChild, AfterViewInit} from '@angular/core';
import {GameDetails} from "../game";
import {GameDotsData} from "./game-dots-data";
import {GameDotsDataDot} from "./game-dots-data-dot";
import {GameDotsDataPolygon} from "./game-dots-data-polygon";

@Component({
  selector: 'app-game-dots',
  templateUrl: './game-dots.component.html',
  styleUrls: ['./game-dots.component.css']
})
export class GameDotsComponent implements OnInit, AfterViewInit {
  @ViewChild("myCanvas") myCanvas;
  @Input() game: GameDetails;

  private myCanvasElement: HTMLCanvasElement = null;
  private backgroundImage: HTMLImageElement = null;
  private renderingContext2d: CanvasRenderingContext2D = null;

  private pixelsPerInch : number  = 72;
  private mmsPerInch: number  = 25.4;
  private mmsPerGridCell: number = 5;
  private dotSize: number = 6;

  private pixelsPerMm:number;
  private pixelsPerGridCell: number;

  constructor() {
    this.pixelsPerMm = this.pixelsPerInch / this.mmsPerInch;
    this.pixelsPerGridCell = this.pixelsPerMm * this.mmsPerGridCell;
  }

  ngOnInit() {

  }

  ngOnChanges() {
    this.refresh();
  }

  ngAfterViewInit() {
    // After the view is initialized, this.userProfile will be available
    this.myCanvasElement = this.myCanvas.nativeElement;
    this.backgroundImage = new Image();
    this.renderingContext2d = this.myCanvasElement.getContext('2d');
    this.backgroundImage.onload = () => this.refresh();
    this.backgroundImage.src = "assets/images/squarelinedsheet.png";
  }

  private refresh() {
    if (this.backgroundImage != null && this.renderingContext2d != null) {
      this.renderingContext2d.drawImage(this.backgroundImage, 0, 0);
      if (this.game == null) {
        return;
      }

      let dotsData: GameDotsData = this.game.data;
      if (dotsData == null) {
        return;
      }

      this.drawDots(dotsData.dots);
      this.drawPolygons(dotsData.polygons);
    }
  }

  private drawDots(dots: GameDotsDataDot[][]) {
    if (dots == null) {
      return;
    }

    for (let indexX = 0; indexX < dots.length; indexX++) {
      let dotRow = dots[indexX];
      if (dotRow != null) {
        for (let indexY = 0; indexY < dotRow.length; indexY++) {
          let dot = dotRow[indexY];
          if (dot != null) {
            if (dot.playerIndex == 1 && dot.free) {
              this.renderingContext2d.fillStyle = "blue";
            }
            else if (dot.playerIndex == 0 && dot.free) {
              this.renderingContext2d.fillStyle = "red";
            }
            else if (!dot.free) {
              this.renderingContext2d.fillStyle = "gray";
            }
            else {
              continue;
            }

            this.renderingContext2d.fillRect(indexX * this.pixelsPerGridCell - this.dotSize / 2, indexY * this.pixelsPerGridCell - this.dotSize / 2, this.dotSize, this.dotSize);
          }
        }
      }
    }
  }

  private drawPolygons(polygons: GameDotsDataPolygon[]) {
    if (polygons == null) {
      return;
    }
    for (let polygon of polygons) {
      if (polygon != null) {
        let path = polygon.path;
        if (path != null) {
          this.renderingContext2d.beginPath();
          let startingPoint = path[0];
          if (startingPoint != null) {
            this.renderingContext2d.moveTo(startingPoint.x * this.pixelsPerGridCell, startingPoint.y * this.pixelsPerGridCell);
          }

          for (let pathPointIndex = 1; pathPointIndex <= path.length; pathPointIndex++) {
            let point = path[pathPointIndex % path.length];
            if (point != null) {
              this.renderingContext2d.lineTo(point.x * this.pixelsPerGridCell, point.y * this.pixelsPerGridCell);
            }
          }

          this.renderingContext2d.stroke();
        }
      }
    }
  }
}
