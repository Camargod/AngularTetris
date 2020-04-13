import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { COLS,BLOCK_SIZE, ROWS, GRIDCOLS, KEY} from "./constants";
import TPiece from 'src/objects/piece';

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
  actualPiece : TPiece;

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
    this.pieceSet()
    this.setBounds();

    this.grid();
  }

  pieceSet()
  {
    this.actualPiece = new TPiece(this.canvasContext);
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

  colision(currentX : number, currentY : number, actualRotation : number) : boolean
  {
    for(let px = 0; px < 4; px++)
    {
      for(let py = 0; py < 4; py++)
      {
        let rotate = this.pieceRotate(px,py,actualRotation);
        if(this.actualPiece.shape[rotate] == 1)
        {
          let index = (((currentX + (px * BLOCK_SIZE)) / BLOCK_SIZE) + ((((currentY + (py * BLOCK_SIZE)) / BLOCK_SIZE) - 1) * GRIDCOLS));
          let colision = (this.gridVector[index] == 9) ? true : false;
          if(colision) return colision;
        }
      }
    }
    return false;
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
        if(this.colision(this.posX,this.posY + BLOCK_SIZE,this.actualPiece.rotation))
        {
          this.posY = 0;
        }
        
        
        this.canvasContext.clearRect(this.lastPosX, this.lastPosY, this.lastPosX + (BLOCK_SIZE * 4), this.posY + (BLOCK_SIZE * 4));
        this.posY += BLOCK_SIZE;
        this.tetrominoDraw();
      },800);
        

      this.delta =  (performance.now() - this.lastFps)/1000;
      this.lastFps = performance.now();
      this.fps = 0.01/this.delta;
      this.canvasContext.fillStyle = 'black';
      console.log(this.delta);
      console.log(this.fps);
      // this.canvasContext.fillText(this.fps + " fps", 10, 26);
      // this.canvasContext.clearRect(10,26,100,50);
    }
  }

  move(key : number)
  {
    switch(key)
    {
      case KEY.LEFT:
        if(!this.colision(this.posX - BLOCK_SIZE,this.posY, this.actualPiece.rotation))
        {
          this.canvasContext.clearRect(this.posX, this.posY, this.posX + (BLOCK_SIZE * 4), this.posY + (BLOCK_SIZE * 4));
          this.posX -= BLOCK_SIZE;
          this.tetrominoDraw();
        }
        break;
      case KEY.RIGHT:
        if(!this.colision(this.posX + BLOCK_SIZE,this.posY, this.actualPiece.rotation))
        {
          this.canvasContext.clearRect(this.posX, this.posY, this.posX + (BLOCK_SIZE * 4), this.posY + (BLOCK_SIZE * 4));
          this.posX += BLOCK_SIZE;
          this.tetrominoDraw();
        }
        break;
      case KEY.UP:
        if(!this.colision(this.posX,this.posY,this.actualPiece.rotation+1)) 
        {
          if(this.actualPiece.rotation == 3)
          {
            this.actualPiece.rotation = 0;
          }
          else
          {
            this.actualPiece.rotation += 1;
          }
          this.canvasContext.clearRect(this.posX, this.posY, this.posX + (BLOCK_SIZE * 4), this.posY + (BLOCK_SIZE * 4));
          this.tetrominoDraw();
        }
    }
  }
  tetrominoDraw()
  {
    this.canvasContext.fillStyle = 'blue';
    for(let px = 0; px < 4; px++)
    {
      for(let py = 0; py < 4; py++)
      {
        let rotate = this.pieceRotate(px,py,this.actualPiece.rotation);
        if(this.actualPiece.shape[rotate] == 1)
        {
          window.requestAnimationFrame(()=>{});
          this.canvasContext.fillRect(this.posX + (px * BLOCK_SIZE),this.posY + (py * BLOCK_SIZE),BLOCK_SIZE,BLOCK_SIZE);
        }
      }
    }
  }
}
