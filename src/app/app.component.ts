import {Component,ViewChild,ElementRef,OnInit,HostListener} from '@angular/core';
import {COLS,BLOCK_SIZE,ROWS,GRIDCOLS,KEY,GRIDROWS} from "./constants";
import TPiece from 'src/objects/piece';
import Utils from './utils';
import {ItemMap,Themes,ThemeService} from './theme-service';
import {AudioMap,AudioMapNames,SoundClass} from './sound';
import { SocketService } from './game-modules/socket/socket.service';
import { MatchVariablesService } from './game-modules/match-variables/match-variables.service';
import { MovementService } from './game-modules/movement/movement-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Online Tetris';

  //Diretivas de leitura de ElementosHtml do Canvas para controle direto da API do mesmo.
  
  @ViewChild("gridcanvas", {static: true}) gridCanvas: ElementRef < HTMLCanvasElement > ;
  @ViewChild("piecescanvas", {static: true}) piecesCanvas: ElementRef < HTMLCanvasElement > ;
  @ViewChild("fallingpiecescanvas", {static: true}) fallingPiecesCanvas: ElementRef < HTMLCanvasElement > ;

  @ViewChild("themeSelect",{static:true}) themeSelect : ElementRef<HTMLSelectElement>

  @ViewChild("gameDiv", {static: true}) gameDiv: ElementRef <HTMLDivElement>;

  canvasGridContext: CanvasRenderingContext2D;
  piecesCanvasContext: CanvasRenderingContext2D;
  fallingPiecesCanvasContext: CanvasRenderingContext2D;

  /*
    Vetor de grid, contendo a informação da casa e a cor da peça que está nela.
  */
  gridVector: Array < {
    value: number,
    color?: string,
    themeNumber ? : number
  } > ;

  initalPos: number = 0;
  actualPiece: TPiece;

  posX: number = BLOCK_SIZE * 6;
  posY: number = 0;

  lastPosX: number = 0;
  lastPosY: number = 0;

  /*
    Variaveis de contagem de FPS (Broken)
  */
  lastFps: number = 0;
  delta: number = 0;
  fps: number = 0;

  gameTime = 500;
  delayTime = 0;
  useDelay = false;

  isGameOver: boolean = false;

  hasImageLoaded: boolean = false;
  themeList = Themes;

  themeSoundManager: SoundClass;

  gamePontuation = 0;

  //Variáveis do socket
  timer = 0;
  players = 0;

  constructor(
    private themeService: ThemeService,
    private matchVariables : MatchVariablesService,
    private socketService : SocketService,
    private movementService : MovementService
  ) {
    this.themeSoundManager = new SoundClass();
  }

  /*
    Movimento de peças, por evento de keydown 
    
    Necessita trocar a variavel KeyCode, deprecated.
  */
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode && this.movementService.keyMap[event.keyCode]) {
      this.movementService.keyMap[event.keyCode](this);
    }
  }

  /*
    Ajustes iniciais do jogo.
  */

  ngOnInit() : void {
    this.matchVariables.startGameListening()
    this.socketStart();
    this.themeService.setTile(0);
    this.prepareCanvasContexts();
    this.setCanvasSize();
    this.pieceSet()
    this.setBounds();
    this.themeSoundManager.setNewAudio(AudioMap[AudioMapNames.main])
    this.themeSoundManager.audio.loop = true;
    this.waitImageLoad(); 
  }

  socketStart(){
    this.matchVariables.timer.subscribe((timer)=>{
      this.timer = timer;
    })
    this.matchVariables.in_match_players.subscribe((players)=>{
      this.players = players;
    })
  }

  waitImageLoad() {
    debugger;
    let subscription = this.themeService.setTileObservable(0).subscribe(()=>{
      this.hasImageLoaded = true;
      this.draw()
      this.gameDraw();
    });
    subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.setSelectActualTheme();
  }

  setSelectActualTheme(){
    let actualTheme = localStorage.getItem("selectedTheme");

    this.themeSelect.nativeElement.selectedIndex = this.themeList.findIndex((themeItem)=>{
      return themeItem.fileName == actualTheme;
    })
  }

  draw() {
    this.grid();
    // this.gridArrayDebug();
  }
  /*
    Traz para o tipo de contexto as referencias de elemento HTML
  */
  prepareCanvasContexts() {
    this.canvasGridContext = this.gridCanvas.nativeElement.getContext('2d');
    this.piecesCanvasContext = this.piecesCanvas.nativeElement.getContext('2d');
    this.fallingPiecesCanvasContext = this.fallingPiecesCanvas.nativeElement.getContext('2d')
  }

  /*
    Define tamanho para o canvas.

    Precisa ser ajustado depois para responsividade
  */
  setCanvasSize() {
    this.fallingPiecesCanvasContext.scale(1.35,1.35);
    this.fallingPiecesCanvasContext.scale(1.35,1.35);
    this.canvasGridContext.scale(1.35,1.35);
    this.canvasGridContext.scale(1.35,1.35); 
    this.piecesCanvasContext.scale(1.35,1.35);  
    this.piecesCanvasContext.scale(1.35,1.35); 
  }

  /*
    Coloca uma nova peça no jogo.
  */
  pieceSet() {
    this.actualPiece = new TPiece(this.fallingPiecesCanvasContext);
  }

  setBackgroundByTheme(){
    this.gameDiv.nativeElement.style.background = this.themeService.getBackgroundUrl();
  }
  /*
    Define boundaries do campo de jogo.
  */
  setBounds() {
    this.gridVector = new Array <{value: number,color: string}> ();
    for (let y = 0; y <= GRIDROWS; y++) {
      for (let x = 0; x < GRIDCOLS; x++) {
        this.gridVector[y * GRIDCOLS + x] = {
          value: ((x == 0 || y == GRIDROWS - 1 || x == GRIDCOLS - 1) ? 9 : 0)
        };
      }
    }
  }
  /*
    Rotação de matriz para validação da peça por x e y da mesma.
  */
  pieceRotate(px: number, py: number, r: number) {
    switch (r % 4) {
      case 0:
        return py * 4 + px;
      case 1:
        return 12 + py - (px * 4);
      case 2:
        return 15 - (py * 4) - px;
      case 3:
        return 3 - py + (px * 4);
    }
  }

  /*
    Valida colisão da peça com base em rotação da mesma.
  */
  colision(currentX: number, currentY: number, actualRotation: number): boolean {
    try {
      for (let px = 0; px < 4; px++) {
        for (let py = 0; py < 4; py++) {
          let rotate = this.pieceRotate(px, py, actualRotation);
          if (this.actualPiece.shape[rotate] == 1) {
            let index = (((currentX + (px * BLOCK_SIZE)) / BLOCK_SIZE) + ((((currentY + (py * BLOCK_SIZE)) / BLOCK_SIZE) - 1) * GRIDCOLS));
            let colision = (this.gridVector[index].value == 9 || this.gridVector[index].value == 1) ? true : false;
            if (colision) return colision;
          }
        }
      }
      return false;
    } catch (err) {
      console.error(`Erro de colisão: ${err}`);
    }
  }
  /*
    Faz o desenho da grid.
  */
  grid() {
    this.canvasGridContext.clearRect(0, 0, this.canvasGridContext.canvas.width, this.canvasGridContext.canvas.height);
    this.canvasGridContext.fillStyle = 'black';

    this.themeService.getTileSize();

    let {
      x1,
      x2,
      y1,
      y2
    } = this.themeService.getDrawParams();

    for (let c = 0; c < COLS; c++) {
      for (let r = 6; r <= ROWS + 1; r++) {
        if (r != ROWS + 1) {
          this.canvasGridContext.drawImage(this.themeService.image, x1, y1, x2, y2, (c * BLOCK_SIZE) + BLOCK_SIZE, (r * BLOCK_SIZE) + BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      }
    }
  }
  /*
    Faz o desenho de grid com numeração de cada casa e o seu valor.
  */
  gridArrayDebug() {
    for (let c = 0; c < GRIDCOLS; c++) {
      for (let r = 5; r < GRIDROWS; r++) {
        this.canvasGridContext.fillText(this.gridVector[r * GRIDCOLS + c].value.toString(), c * BLOCK_SIZE + 12, r * BLOCK_SIZE + 50);
        this.canvasGridContext.stroke();
      }
    }
  }


  /*
    Desenho de jogo.
  */
  gameDraw() {
    try {
      if (!this.isGameOver) {
        setTimeout(()=>{
          this.delayTime++;
        },1)
        setTimeout(() => {
          this.lastPosX = this.posX;
          this.lastPosY = this.posY;

          if (this.colision(this.posX, this.posY + BLOCK_SIZE, this.actualPiece.rotation)) {
            this.saveTetromino(this.posX, this.posY);

            this.clearFullLines(this.posY);
            // this.gridArrayDebug();
            this.actualPiece.spawn();
          }


          this.fallingPiecesCanvasContext.clearRect(this.lastPosX - BLOCK_SIZE, this.lastPosY - BLOCK_SIZE, this.lastPosX + (BLOCK_SIZE * 5), this.posY + (BLOCK_SIZE * 5));
          this.posY += BLOCK_SIZE;
          this.tetrominoDraw();
          this.useDelay = false;
          this.delayTime = 0;
          window.requestAnimationFrame(() => this.gameDraw());

        }, this.gameTime + (this.useDelay ? this.delayTime : 0));

      } else {
        alert("Você perdeu");
        location.reload();
      }
    } catch (err) {
      console.error(`Erro de gameloop: ${err}`)
    }
  }
  /*
    Desenha a peça atual
  */
  tetrominoDraw() {
    let {
      x1,
      x2,
      y1,
      y2
    } = this.themeService.getDrawParams();
    this.themeService.setTile(this.actualPiece.pieceNumberId);
    this.fallingPiecesCanvasContext.clearRect(this.lastPosX - BLOCK_SIZE, this.lastPosY - BLOCK_SIZE, this.lastPosX + (BLOCK_SIZE * 5), this.posY + (BLOCK_SIZE * 5));

    for (let px = 0; px < 4; px++) {
      for (let py = 0; py < 4; py++) {
        let rotate = this.pieceRotate(px, py, this.actualPiece.rotation);
        if (this.actualPiece.shape[rotate] == 1) {
          let tetrominoPieceIndex = Utils.getIndexHeightByPos(this.posY, py);
          if (tetrominoPieceIndex + (GRIDCOLS * py) + px >= GRIDCOLS * 6) {
            this.fallingPiecesCanvasContext.drawImage(this.themeService.image, x1, y1, x2, y2, this.posX + (px * BLOCK_SIZE), this.posY + (py * BLOCK_SIZE), BLOCK_SIZE, BLOCK_SIZE);
          }
        }
      }
    }

  }

  /*
    Após colisão, desenha a peça em outro canvas que fica fixo.
  */
  saveTetromino(posX, posY) {
    let {
      x1,
      x2,
      y1,
      y2
    } = this.themeService.getDrawParams();

    for (let px = 0; px < 4; px++) {
      for (let py = 0; py < 4; py++) {
        let rotate = this.pieceRotate(px, py, this.actualPiece.rotation);

        if (this.actualPiece.shape[rotate] == 1) {
          let index = (((posX + (px * BLOCK_SIZE)) / BLOCK_SIZE) + ((((posY + (py * BLOCK_SIZE)) / BLOCK_SIZE) - 1) * GRIDCOLS));
          if (index < GRIDCOLS * 6) {
            this.isGameOver = true;
          } else {
            this.gridVector[index] = {
              color: this.actualPiece.color,
              value: 1,
              themeNumber: this.actualPiece.pieceNumberId
            };
            this.piecesCanvasContext.drawImage(this.themeService.image, x1, y1, x2, y2, posX + (px * BLOCK_SIZE), posY + (py * BLOCK_SIZE), BLOCK_SIZE, BLOCK_SIZE);
          }
        }
      }
    }
    this.posY = 30;
    this.posX = BLOCK_SIZE * 6;
  }
  /*
    Limpa as linhas cheias.

    NECESSARIO MUDAR O ALGORITMO
    Pode se realizar essa validação com base na posição Y e Y + 4 convertidos no indices de vetor como intervalo, assim evita ser iterado toda vez a grita toda. 
  */
  clearFullLines(lastPosxY) {
    for (let r = ROWS; r >= 0; r--) {
      let isFilled = true;
      for (let c = 1; c < GRIDCOLS - 1; c++) {
        let index = r * GRIDCOLS + c;
        if (this.gridVector[index].value == 0) {
          isFilled = false;
          break;
        }
      }
      if (isFilled) {
        this.piecesCanvasContext.clearRect(30, (r * BLOCK_SIZE) + BLOCK_SIZE, BLOCK_SIZE * COLS, BLOCK_SIZE);

        for (let indexReset = r * GRIDCOLS + 1; indexReset <= r * GRIDCOLS + COLS; indexReset++) {
          this.gridVector[indexReset] = {
            value: 0,
            color: "transparent"
          };
        }
        for (let rDown = r; rDown >= 0; rDown--) {
          for (let c = 1; c <= GRIDCOLS - 1; c++) {
            if (rDown != 0) {
              this.gridVector[rDown * GRIDCOLS + c] = this.gridVector[(rDown * GRIDCOLS + c) - 12]
            } else {
              this.gridVector[rDown * GRIDCOLS + c] = {
                color: "transparent",
                value: 0
              };
            }
          }
        }
        r++;
        this.redrawAllTetrominos();
        this.gameTime -= 6;
        this.gamePontuation += 50;
      }
    }
  }

  redrawAllTetrominos() {
    this.piecesCanvasContext.clearRect(0, 0, this.piecesCanvasContext.canvas.width, this.piecesCanvasContext.canvas.height);
    for (let r = 1; r <= GRIDROWS - 2; r++) {
      for (let c = 1; c <= GRIDCOLS - 1; c++) {
        let index = r * GRIDCOLS + c;
        if (this.gridVector[index].value != 0 && this.gridVector[index].value != 9) {
          if (this.gridVector[index].themeNumber) {
            let {
              x1,
              x2,
              y1,
              y2
            } = this.themeService.getDrawParams();
            console.log(`Desenhando tile de numero ${this.gridVector[index].themeNumber}`)
            let subcription = this.themeService.setTileObservable(this.gridVector[index].themeNumber).subscribe((image)=>{
              window.requestAnimationFrame(()=>{
                this.piecesCanvasContext.drawImage(image, x1, y1, x2, y2, c * BLOCK_SIZE, r * BLOCK_SIZE + BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                subcription.unsubscribe();
              })
            });
          }
        }
      }
    }
  }
  
  onChangeTheme(themeFileString){
    this.themeService.changeTheme(themeFileString.target.value);
  }

}
