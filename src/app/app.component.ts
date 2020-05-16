import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { COLS,BLOCK_SIZE, ROWS, GRIDCOLS, KEY, GRIDROWS} from "./constants";
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
  @ViewChild("piecescanvas", { static: true }) piecescanvas: ElementRef<HTMLCanvasElement>;

  
  
  canvasContext : CanvasRenderingContext2D;
  canvasGridContext : CanvasRenderingContext2D;
  piecesCanvasContext : CanvasRenderingContext2D;

  gridVector : Array<{value : number, color : string}>;
  
  initalPos : number = 0;
  actualPiece : TPiece;

  posX : number = BLOCK_SIZE * 6;
  posY : number = 0;

  lastPosX : number = 0;
  lastPosY : number = 0;

  lastFps : number = 0;
  delta : number = 0;
  fps : number = 0;

  gameTime = 500;

  isGameOver : boolean = false;

  ngOnInit(): void 
  {
    this.canvasContext = this.canvas.nativeElement.getContext('2d');
    this.canvasGridContext = this.gridcanvas.nativeElement.getContext('2d');
    this.piecesCanvasContext = this.piecescanvas.nativeElement.getContext('2d');

    this.canvasContext.canvas.width = window.innerWidth * 0.33;
    this.canvasContext.canvas.height = window.innerHeight * 0.92;
    this.canvasGridContext.canvas.width = window.innerWidth * 0.33;
    this.canvasGridContext.canvas.height = window.innerHeight * 0.92;
    this.piecesCanvasContext.canvas.width = window.innerWidth * 0.33;
    this.piecesCanvasContext.canvas.height = window.innerHeight * 0.92;
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
    this.gridVector = new Array<{value : number, color : string}>();
    for(let y = 0; y <= ROWS; y++)
    {
      for(let x = 0; x < GRIDCOLS; x++)
      {
        this.gridVector[y * GRIDCOLS + x] = {color:'none', value:((x == 0 || y == ROWS || x == GRIDCOLS - 1) ? 9 : 0)} ;
      } 
    }
  }

  ngAfterViewInit(): void 
  {
    this.game();
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
    try
    {
      for(let px = 0; px < 4; px++)
      {
        for(let py = 0; py < 4; py++)
        {
          let rotate = this.pieceRotate(px,py,actualRotation);
          if(this.actualPiece.shape[rotate] == 1)
          {
            let index = (((currentX + (px * BLOCK_SIZE)) / BLOCK_SIZE) + ((((currentY + (py * BLOCK_SIZE)) / BLOCK_SIZE) - 1) * GRIDCOLS));
            let colision = (this.gridVector[index].value == 9 || this.gridVector[index].value == 1) ? true : false;
            if(colision) return colision;
          }
        }
      }
      return false;
    }
    catch(err)
    {
    }
  }

  grid()
  {
    this.canvasGridContext.clearRect(0,0,this.canvasGridContext.canvas.width,this.canvasGridContext.canvas.height);
    this.canvasGridContext.fillStyle = 'black';

    for(let c = 0; c < COLS; c++)
    {
      for(let r = 0; r <= ROWS; r++)
      {
        if(r != ROWS) this.canvasGridContext.rect((c*BLOCK_SIZE) + 30, (r*BLOCK_SIZE) + 30,BLOCK_SIZE,BLOCK_SIZE);
        this.canvasGridContext.stroke();
      }
    }
    for(let c = 0; c < GRIDCOLS; c++)
    {
      for(let r = 0; r <= ROWS; r++)
      {
        this.canvasGridContext.fillText(this.gridVector[r * GRIDCOLS + c].value.toString(),c * BLOCK_SIZE + 12,r * BLOCK_SIZE + 50);
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
    try
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
            this.saveTetromino();
            this.posY = 0;
            this.posX = BLOCK_SIZE * 6;
            
            this.clearFullLines();
            this.grid();
            this.actualPiece.spawn();
          }
          
          
          this.canvasContext.clearRect(this.lastPosX - BLOCK_SIZE, this.lastPosY - BLOCK_SIZE, this.lastPosX + (BLOCK_SIZE * 5), this.posY + (BLOCK_SIZE * 5));
          this.posY += BLOCK_SIZE;
          this.tetrominoDraw();
        },this.gameTime);
          

        this.delta =  (performance.now() - this.lastFps)/1000;
        this.lastFps = performance.now();
        this.fps = 0.01/this.delta;
        console.log(this.delta);
        console.log(this.fps);
        // this.canvasContext.fillText(this.fps + " fps", 10, 26);
        // this.canvasContext.clearRect(10,26,100,50);
      }
    }
    catch(err)
    {

    }
  }

  move(key : number)
  {
    try
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
          if(this.colision(this.posX,this.posY,this.actualPiece.rotation+1))
          {
            break;
          }
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
            break;
          }
        else
          {
            if(!this.colision(this.posX + BLOCK_SIZE,this.posY,this.actualPiece.rotation+1)) 
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
              this.posX += BLOCK_SIZE;
              this.tetrominoDraw();
              break;
            }
            else(!this.colision(this.posX - BLOCK_SIZE,this.posY,this.actualPiece.rotation+1)) 
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
              this.posX -= BLOCK_SIZE;
              this.tetrominoDraw();
              break;
            }
        }
      }
    }
    catch(err)
    {
    }
    
  }

  tetrominoDraw()
  {
    this.canvasContext.fillStyle = this.actualPiece.color;
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

  saveTetromino()
  {
    this.piecesCanvasContext.fillStyle = this.actualPiece.color;
    for(let px = 0; px < 4; px++)
    {
      for(let py = 0; py < 4; py++)
      {
        let rotate = this.pieceRotate(px,py,this.actualPiece.rotation);

        if(this.actualPiece.shape[rotate] == 1)
        {
          window.requestAnimationFrame(()=>{});
          this.piecesCanvasContext.fillRect(this.posX + (px * BLOCK_SIZE),this.posY + (py * BLOCK_SIZE),BLOCK_SIZE,BLOCK_SIZE);
          let index = (((this.posX + (px * BLOCK_SIZE)) / BLOCK_SIZE) + ((((this.posY + (py * BLOCK_SIZE)) / BLOCK_SIZE) - 1) * GRIDCOLS));
          this.gridVector[index] = {color:this.actualPiece.color,value:1};
        }
      }
    }
  }

  clearFullLines()
  {
    for(let r = ROWS - 1; r > 0; r--)
    {
      let isFilled = true;
      for(let c = 1; c <= GRIDCOLS - 1; c++)
      {
        let index = r * GRIDCOLS + c;
        if(this.gridVector[index].value == 0)
        {
          isFilled = false;
          break;
        }
      }
      if(isFilled)
      {
        this.piecesCanvasContext.clearRect(30, (r*BLOCK_SIZE)+ BLOCK_SIZE, BLOCK_SIZE*COLS, BLOCK_SIZE);

        for(let indexReset = r * GRIDCOLS + 1; indexReset <= r * GRIDCOLS + COLS; indexReset++)
        {
          this.gridVector[indexReset] = {value:0,color:"transparent"};
        }
        for(let rDown = r; rDown >= 0; rDown--)
        {
          for(let c = 1; c <= GRIDCOLS - 1; c++)
          {
            if(rDown != 0)
            {
              this.gridVector[rDown * GRIDCOLS + c] = this.gridVector[(rDown * GRIDCOLS + c) - 12]
            }
            else
            {
              this.gridVector[rDown * GRIDCOLS + c] = {color:"transparent",value:0};
            }
          }
        }
        r++;
        this.redrawAllTetrominos();
      }
    }
  }

  redrawAllTetrominos()
  {
    this.piecesCanvasContext.clearRect(0,0,this.piecesCanvasContext.canvas.width, this.piecesCanvasContext.canvas.height);
    this.canvasContext.clearRect(0,0,this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    for(let r = 1; r <= GRIDROWS - 2; r++)
    {
      for(let c = 1; c <= GRIDCOLS - 1; c++)
      {
        let index = r * GRIDCOLS + c;
        if(this.gridVector[index].value != 0 && this.gridVector[index].value != 9)
        {
          this.piecesCanvasContext.fillStyle = this.gridVector[index].color;
          this.piecesCanvasContext.fillRect(c*BLOCK_SIZE,r*BLOCK_SIZE + BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
        }
      }
    }
  }
}
