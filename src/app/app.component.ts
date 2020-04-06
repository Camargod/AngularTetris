import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { COLS,BLOCK_SIZE, ROWS, GRIDCOLS, KEY} from "./constants";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit
{
  title = 'Online Tetris';
  @HostListener('window:keydown', ['$event'])
    keyEvent(event: KeyboardEvent) 
    {
      if (event.keyCode) 
      {
        this.move(event.keyCode);
      }
    }
  @ViewChild("gridcanvas",{static:true}) gridcanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild("canvas", { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  
  
  canvasContext : CanvasRenderingContext2D;

  canvasGridContext : CanvasRenderingContext2D;


  gridVector : Array<Number>;
  
  initalPos : Number = 0;
  actualPiece : Number;

  posX : number = BLOCK_SIZE * 6;
  posY : number = 0;

  lastPosX : number = 0;
  lastPosY : number = 0;

  lastFps : number = 0;
  delta : number = 0;
  fps : number = 0;

  isGameOver : boolean = false;

  ngOnInit(): void 
  {
    this.canvasContext = this.canvas.nativeElement.getContext('2d');
    this.canvasGridContext = this.gridcanvas.nativeElement.getContext('2d');

    this.canvasContext.canvas.width = window.innerWidth * 0.33;
    this.canvasContext.canvas.height = window.innerHeight * 0.92;
    this.canvasGridContext.canvas.width = window.innerWidth * 0.33;
    this.canvasGridContext.canvas.height = window.innerHeight * 0.92;
    this.setBounds();

    this.grid();
  }

  setBounds()
  {
    this.gridVector = new Array<Number>();
    for(let y = 0; y <= ROWS; y++)
    {
      for(let x = 0; x < GRIDCOLS; x++)
      {
        this.gridVector[y * GRIDCOLS + x] = (x == 0 || y == ROWS || x == GRIDCOLS - 1) ? 9 : 0;
      } 
    }
  }

  ngAfterViewInit(): void 
  {
    this.game();
  }

  animate() : void
  {

  }

  pieceRotate(px : number, py: number, r : number)
  {
    switch (r%4)
    {
      case 0: return py * 4 + px;
      case 1: return 12 + py - (px * 4);
      case 2: return 15 - (py * 4) - px;
      case 3: return 3 - py + (px * 4);
    }
  }

  colision(currentX : number, currentY : number,actualTetromino?, actualRotation? : number) : boolean
  {
    let index = ((currentX / BLOCK_SIZE) + (((currentY / BLOCK_SIZE) - 1) * GRIDCOLS));
    let colision = (this.gridVector[index] == 9) ? true : false;
    return colision;
  }

  grid()
  {
    this.canvasGridContext.fillStyle = 'black';

    for(let c = 0; c < COLS; c++)
    {
      for(let r = 0; r <= ROWS; r++)
      {
        if(r != ROWS) this.canvasGridContext.rect((c*BLOCK_SIZE) + 30, (r*BLOCK_SIZE) + 30,BLOCK_SIZE,BLOCK_SIZE);
        this.canvasGridContext.stroke();
      }
    }
    for(let c = 0; c < COLS + 2; c++)
    {
      for(let r = 0; r <= ROWS; r++)
      {
        this.canvasGridContext.fillText(this.gridVector[r * GRIDCOLS + c].toString(),c * BLOCK_SIZE + 12,r * BLOCK_SIZE + 50);
        this.canvasGridContext.stroke();

      }
    }  
  }

  game()
  {
    window.requestAnimationFrame(()=>this.gameDraw());
  }

  gameDraw()
  {
    if(!this.isGameOver)
    {
      this.lastFps = performance.now();
      
      //Aqui fica a queda natural de peças ao logo do jogo

      //Limpa a tela para atualizar elementos
      //Solicita o gameloop
      setTimeout(()=>
      {
        this.lastPosX = this.posX;
        this.lastPosY = this.posY;

        window.requestAnimationFrame(()=>this.gameDraw());
        if(this.posY >= (BLOCK_SIZE * (ROWS)))
        {
          this.posY = 0;
        }
        
        
        this.canvasContext.clearRect(this.lastPosX, this.lastPosY, this.lastPosX + BLOCK_SIZE, this.lastPosY + BLOCK_SIZE);
        this.posY += BLOCK_SIZE;
        this.tetrominoDraw();
      },800);
        

      this.delta =  (performance.now() - this.lastFps)/1000;
      this.lastFps = performance.now();
      this.fps = 1/this.delta;
      this.canvasContext.fillStyle = 'black';
      // this.canvasContext.clearRect(10,26,30,26);
      // this.canvasContext.fillText(this.fps + " fps", 10, 26);
    }
  }

  move(key : number)
  {
    switch(key)
    {
      case KEY.LEFT:
        if(!this.colision(this.posX - BLOCK_SIZE,this.posY))
        {
          this.canvasContext.clearRect(this.posX, this.posY, this.posX + BLOCK_SIZE, this.posY + BLOCK_SIZE);
          this.posX -= BLOCK_SIZE;
          this.tetrominoDraw();
        }
        break;
      case KEY.RIGHT:
        if(!this.colision(this.posX + BLOCK_SIZE,this.posY))
        {
          this.canvasContext.clearRect(this.posX, this.posY, this.posX + BLOCK_SIZE, this.posY + BLOCK_SIZE);
          this.posX += BLOCK_SIZE;
          this.tetrominoDraw();
        }
        break;
    }
  }
  tetrominoDraw()
  {
    window.requestAnimationFrame(()=>{});
    this.canvasContext.fillStyle = 'blue';
    this.canvasContext.fillRect(this.posX,this.posY,BLOCK_SIZE,BLOCK_SIZE);
  }
}
