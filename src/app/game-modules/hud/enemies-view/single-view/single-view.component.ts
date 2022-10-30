import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { BLOCK_SIZE, GRIDCOLS, GRIDROWS, LATERAL_PADDING, TOP_PADDING } from "src/app/game-modules/utils/constants";
import { TetrisGridPiece } from "src/app/game-modules/objects/tetris-grid-piece";
import { ThemeService } from "src/app/game-modules/services/themes/theme-service";

@Component({
    selector: 'single-view',
    templateUrl: './single-view.component.html',
    styleUrls: ['./single-view.component.scss']
})
export class SingleViewComponent implements AfterViewInit, OnChanges{
  @Input() grid !: TetrisGridPiece[];
  @ViewChild('singleViewCanvas', {static:true}) viewCanvas !: ElementRef<HTMLCanvasElement>
  viewCanvasContext !: CanvasRenderingContext2D | null;

  constructor(private themeService : ThemeService){}

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
    // if(changes.grid.currentValue){
    //     this.gridDraw();
    // }
  }

  ngAfterViewInit(): void {
      this.setCanvasContext();
  }

  setCanvasContext(){
    this.viewCanvasContext = this.viewCanvas!.nativeElement.getContext("2d");
    this.viewCanvasContext!.scale(0.25, 0.25);
  }

  gridDraw(){
    this.viewCanvasContext?.clearRect(0,0,this.viewCanvas!.nativeElement.width,this.viewCanvas!.nativeElement.height);
    for (let r = 1; r <= GRIDROWS - 2; r++) {
      for (let c = 1; c <= GRIDCOLS - 1; c++) {
        let index = r * GRIDCOLS + c;
        if (this.grid[index]?.value != 0 && this.grid[index]?.value != 9) {
          if (this.grid[index]?.themeNumber) {
            let {
              x1,
              x2,
              y1,
              y2
            } = this.themeService.getDrawParams();
            this.viewCanvasContext!.drawImage(this.themeService.themeImages[this.grid[index].themeNumber!], x1, y1, x2, y2, c * BLOCK_SIZE + (BLOCK_SIZE * (LATERAL_PADDING - 1)), r * BLOCK_SIZE + (BLOCK_SIZE * (TOP_PADDING * 2)), BLOCK_SIZE, BLOCK_SIZE);
          }
        }
      }
    }
  }
}
