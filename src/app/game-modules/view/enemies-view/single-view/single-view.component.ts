import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { BLOCK_SIZE, COLS, ROWS } from "src/app/constants";
import { TetrisGridPiece } from "src/app/game-modules/objects/tetris-grid-piece";
import { ThemeService } from "src/app/theme-service";

@Component({
    selector: 'single-view',
    templateUrl: './single-view.component.html',
    styleUrls: ['./single-view.component.html']
})
export class SingleViewComponent implements OnInit, OnChanges{
    @Input() grid !: TetrisGridPiece[];
    @ViewChild('singleViewCanvas', {static:true}) viewCanvas !: ElementRef<HTMLCanvasElement>
    viewCanvasContext !: CanvasRenderingContext2D | null;

    constructor(private themeService : ThemeService){}

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
        if(changes.grid.currentValue){
            this.gridDraw();
        }
    }

    ngOnInit(): void {
        this.setCanvasContext();
    }

    setCanvasContext(){
        this.viewCanvasContext = this.viewCanvas!.nativeElement.getContext("2d");
        this.viewCanvasContext!.scale(0.5, 0.5);
    }

    gridDraw(){
        for (let r = 0; r <= ROWS + 7; r++) {
            for (let c = 0; c < COLS; c++) {
                let index = r * COLS + c;
                console.log(index);
                if (this.grid[index].value && this.grid[index].value == 1) {
                    let imageSubs = this.themeService.setTileObservable(this.grid[index].themeNumber!).subscribe((image : HTMLImageElement)=>{
                        let { x1,x2, y1, y2} = this.themeService.getDrawParams();
                        console.log(image);
                        this.viewCanvasContext!.drawImage(image, x1, y1, x2, y2, (c * BLOCK_SIZE) + BLOCK_SIZE, (r * BLOCK_SIZE) + BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                        imageSubs.unsubscribe();
                    })
                }
            }
        }
    }
}