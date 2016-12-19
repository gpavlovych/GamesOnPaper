import {Component, OnInit, Input, ViewChild, AfterViewInit, HostListener} from '@angular/core';
import {GameDetails} from "../game";
import {GameDotsData} from "./game-dots-data";
import {GameDotsDataDot} from "./game-dots-data-dot";
import {GameDotsDataPolygon} from "./game-dots-data-polygon";
import {GameDotsService} from "../game-dots.service";
import {RefreshService} from "../refresh.service";
import {UserInfoService} from "../user-info.service";
import {UserDetails} from "../user";
import {HslToRgb} from "../hsl-to-rgb";

@Component({
  selector: 'app-game-dots',
  templateUrl: './game-dots.component.html',
  styleUrls: ['./game-dots.component.css']
})
export class GameDotsComponent implements OnInit, AfterViewInit {
  @ViewChild("myCanvas") myCanvas;
  @Input() game: GameDetails;
  currentPlayerIndex: number[] = [];
  private currentUser: UserDetails = null;
  private myCanvasElement: HTMLCanvasElement = null;
  private backgroundImage: HTMLImageElement = null;
  private renderingContext2d: CanvasRenderingContext2D = null;

  private pixelsPerInch : number  = 72;
  private mmsPerInch: number  = 25.4;
  private mmsPerGridCell: number = 5;
  private dotSize: number = 6;
  colors: string[]=[];
  private pixelsPerMm:number;
  private pixelsPerGridCell: number;

  constructor(
    private gameDotsService: GameDotsService,
    private refreshService: RefreshService,
    private currentUserService: UserInfoService) {
    this.pixelsPerMm = this.pixelsPerInch / this.mmsPerInch;
    this.pixelsPerGridCell = this.pixelsPerMm * this.mmsPerGridCell;
  }

  ngOnInit() {
    this.refresh();
    this.refreshService.getRefresher().subscribe(() => this.refresh());
  }

  ngOnChanges() {
    this.refresh();
  }

  @HostListener('mousedown', ['$event'])
  makeTurn(event: MouseEvent) {
    var lastX, lastY;
    if (event.offsetX !== undefined) {
      lastX = event.offsetX;
      lastY = event.offsetY;
    }
    let indexX = Math.round(lastX / this.pixelsPerGridCell);
    let indexY = Math.round(lastY / this.pixelsPerGridCell);
    this.gameDotsService.makeTurn({
      indexX: indexX,
      indexY: indexY,
      gameId: this.game.id
    }).subscribe(() => this.refreshService.refresh());
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
    this.refreshCurrentUser();
    this.redraw();
  }

  private refreshPlayerIndex() {
    this.currentPlayerIndex = [];

    for (let playerIndex = 0; playerIndex < this.game.players.length; playerIndex++) {
      if (
        this.currentUser != null &&
        this.game.players[playerIndex] != null &&
        this.game.players[playerIndex].id == this.currentUser.id) {

        this.currentPlayerIndex.push(playerIndex);
      }
    }
  }

  private refreshCurrentUser(){
    this.currentUserService.getCurrentUser().subscribe(data=>{
      this.currentUser = data;
      this.refreshPlayerIndex();
    });
  }

  private redraw() {
    this.colors = [];
    for (let playerIndex = 0; playerIndex < this.game.players.length; playerIndex++) {
      this.colors.push(HslToRgb.toRgb((playerIndex * 240.0) / (this.game.players.length - 1), 1, 0.5))
    }

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
            if (dot.playerIndex != null) {
              if (dot.free) {
                this.renderingContext2d.fillStyle = this.colors[dot.playerIndex];
              }
              else {
                this.renderingContext2d.fillStyle = "gray";
              }
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
