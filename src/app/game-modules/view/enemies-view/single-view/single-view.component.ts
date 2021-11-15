import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { BLOCK_SIZE, COLS, GRIDCOLS, GRIDROWS } from "src/app/constants";
import { TetrisGridPiece } from "src/app/game-modules/objects/tetris-grid-piece";
import { ThemeService } from "src/app/theme-service";

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
        console.log(changes);
        if(changes.grid.currentValue){
            this.gridDraw();
        }
    }

    ngAfterViewInit(): void {
        this.setCanvasContext();
    }

    setCanvasContext(){
        this.viewCanvasContext = this.viewCanvas!.nativeElement.getContext("2d");
        this.viewCanvasContext!.scale(0.5, 0.5);
    }

    gridDraw(){
        this.viewCanvasContext?.clearRect(0,0,this.viewCanvas!.nativeElement.width,this.viewCanvas!.nativeElement.height)
        for (let r = 5; r <= GRIDROWS - 1; r++) {
            for (let c = 1; c <= GRIDCOLS - 1; c++) {
                let index = r * COLS + c;
                if (this.grid[index] && this.grid[index].value && this.grid[index].value != 9) {
                    let imageSubs = this.themeService.setTileObservable(this.grid[index].themeNumber!).subscribe((image : HTMLImageElement)=>{
                        let { x1,x2, y1, y2} = this.themeService.getDrawParams();
                        window.requestAnimationFrame(()=>{
                            console.log("Desenhando imagem na posição: " + index)
                            this.viewCanvasContext!.drawImage(image, x1, y1, x2, y2, (c * BLOCK_SIZE) + BLOCK_SIZE, (r * BLOCK_SIZE) + BLOCK_SIZE, 2, 2);
                        })
                        imageSubs.unsubscribe();
                    })
                }
            }
        }
    }
}