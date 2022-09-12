import {Component,ViewChild,ElementRef,OnInit,HostListener} from '@angular/core';
import {COLS,BLOCK_SIZE,ROWS,GRIDCOLS,KEY,GRIDROWS, LATERAL_PADDING, CANVAS_SCALING, TOP_PADDING, TRASH_LEVEL} from "./constants";
import TPiece from 'src/objects/piece';
import GameUtils from './game-modules/utils/game-utils';
import { Themes,ThemeService} from './theme-service';
import { AudioMap,AudioMapNames,SoundClass} from './sound';
import { MatchVariablesService } from './game-modules/match-variables/match-variables.service';
import { MovementService } from './game-modules/movement/movement.service';
import { FormBuilder } from '@angular/forms';
import { TetrisGridPiece } from './game-modules/objects/tetris-grid-piece';
import { EnemiesViewComponent } from './game-modules/view/enemies-view/enemies-view.component';
import { Subscription } from 'rxjs';
import { UiStateControllerService } from './game-modules/ui/ui-state-controller/ui-state-controller.service';
import { skip } from 'rxjs/operators';
import GridUtils from './game-modules/utils/grid-utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Online Tetris';

  //Diretivas de leitura de ElementosHtml do Canvas para controle direto da API do mesmo.

  @ViewChild("gridcanvas", {static: true}) gridCanvas !: ElementRef < HTMLCanvasElement > ;
  @ViewChild("piecescanvas", {static: true}) piecesCanvas !: ElementRef < HTMLCanvasElement > ;
  @ViewChild("fallingpiecescanvas", {static: true}) fallingPiecesCanvas !: ElementRef < HTMLCanvasElement > ;
  @ViewChild("debugcanvas",{static:true}) debugCanvas !: ElementRef<HTMLCanvasElement>;
  @ViewChild("trashcanvas", {static:true}) trashCanvas !: ElementRef <HTMLCanvasElement>;
  @ViewChild("interfaceHUD", {static: true}) interfaceHUD !: ElementRef <HTMLCanvasElement>;

  @ViewChild("gameDiv", {static: true}) gameDiv !: ElementRef <HTMLDivElement>;

  @ViewChild("viewsManager",{static:true}) views !: EnemiesViewComponent;

  canvasGridContext !: CanvasRenderingContext2D | null;
  piecesCanvasContext !: CanvasRenderingContext2D | null;
  fallingPiecesCanvasContext !: CanvasRenderingContext2D | null;
  interfaceHUDCanvasContext !: CanvasRenderingContext2D | null;
  debugCanvasContext !: CanvasRenderingContext2D | null;
  trashCanvasContext !: CanvasRenderingContext2D | null;

  /*
    Vetor de grid, contendo a informação da casa e a cor da peça que está nela.
  */
  gridVector !: Array <TetrisGridPiece> ;

  initalPos: number = 0;
  actualPiece !: TPiece;

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
  _gameTimeSubscription ?: Subscription;
  delayTime = 0;
  useDelay = false;

  isGameOver: boolean = false;
  isPaused = true;
  isPausedSubscription ?: Subscription;
  hasImageLoaded: boolean = false;
  themeList = Themes;
  isSingleplayer = false;
  _isSingleplayerSubscription ?: Subscription;
  themeSoundManager: SoundClass;


  gamePontuation = 0;

  isUiEnabled = true;

  accumulatedTrash = 0;
  eventsLeftForTrash = 5;

  playersOnFocus : Array<String> = [];

  //Variáveis do socket
  timer = 0;
  _timerSubscription ?: Subscription;
  players = 0;
  _playersSubscription ?: Subscription;
  _trashReceive ?: Subscription;
  _playersToBeFocused ?: Subscription;

  attackModes : Array<FocusButtonItem> = [
    {name:"KO",size:60, key:1},
    {name:"RANDOM",size:49, key:2},
    {name:"",size:1,key:0},
    {name:"BADGES",size:49, key:3},
    {name:"ATTACKERS",size:60, key:4}
  ];


  autenticateForm = this.formBuilder.group({
    nickname: localStorage.getItem("user") ? localStorage.getItem("user") : '',
  });


  constructor(
    private themeService: ThemeService,
    private matchVariables : MatchVariablesService,
    private movementService : MovementService,
    private formBuilder: FormBuilder,
    private uiStateControllerService : UiStateControllerService
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
    this.waitImageLoad();
    this.socketStart();
    this.themeService.setTile(0);
    this.prepareCanvasContexts();
    this.setCanvasSize();
    this.pieceSet()
    this.setBounds();
    this.themeSoundManager.setNewAudio(AudioMap[AudioMapNames.main])
    // this.themeSoundManager.audio!.loop = true;
  }

  socketStart(){
    this._timerSubscription = this.matchVariables.timer.subscribe((timer)=>{
      this.timer = timer;
      if(timer == 0) {
        this.isPaused = false;
      }
    });
    this._playersSubscription = this.matchVariables.in_match_players.subscribe((players)=>{
      this.players = players;
    });
    this._gameTimeSubscription = this.matchVariables.match_speed.subscribe((match_speed)=>{
      this.gameTime = match_speed;
    });
    this.isPausedSubscription = this.uiStateControllerService._gameStart.subscribe((isPaused)=>{
      this.isPaused = isPaused
    });
    this._isSingleplayerSubscription = this.matchVariables.isSingleplayer.subscribe((isSingleplayer)=>{
      this.isSingleplayer = isSingleplayer;
    });
    this._trashReceive = this.matchVariables.damage_received.subscribe((trashHeight)=>{
      console.log(`Recebeu lixo: ${trashHeight}`);
      if(trashHeight <= TRASH_LEVEL - trashHeight) this.accumulatedTrash += trashHeight;
    });
  }

  waitImageLoad() {
    this.themeService.loadNewTheme().subscribe(()=>{
      this.hasImageLoaded = true;
      this.draw()
      this.gameDraw();
    })

    this.themeService.selectedThemeChanged.pipe(skip(1)).subscribe(()=>{
      this.grid();
    })
  }

  ngAfterViewInit(): void {
    this.setBackgroundByTheme();
  }

  draw() {
    this.grid();
    this.drawHud();
  }
  /*
    Traz para o tipo de contexto as referencias de elemento HTML
  */
  prepareCanvasContexts() {
    this.canvasGridContext = this.gridCanvas.nativeElement.getContext('2d');
    this.piecesCanvasContext = this.piecesCanvas.nativeElement.getContext('2d');
    this.fallingPiecesCanvasContext = this.fallingPiecesCanvas.nativeElement.getContext('2d');
    this.debugCanvasContext = this.debugCanvas.nativeElement.getContext('2d');
    this.trashCanvasContext = this.trashCanvas.nativeElement.getContext('2d');
    this.interfaceHUDCanvasContext = this.interfaceHUD.nativeElement.getContext('2d');
  }

  drawHud(){
    this.interfaceHUDCanvasContext!.fillStyle = '#404040';
    this.interfaceHUDCanvasContext!.fillRect(this.interfaceHUD!.nativeElement.width * 0.70,380,300,250);
    this.interfaceHUDCanvasContext!.fillRect(this.interfaceHUD!.nativeElement.width * 0.70,800,300,250);
    this.interfaceHUDCanvasContext!.fillRect(this.interfaceHUD!.nativeElement.width * 0.70,1220,300,250);

    // window.requestAnimationFrame(()=>{this.drawHud()})
  }


  setCanvasSize() {
    this.fallingPiecesCanvasContext!.scale(CANVAS_SCALING,CANVAS_SCALING);
    this.canvasGridContext!.scale(CANVAS_SCALING,CANVAS_SCALING);
    this.piecesCanvasContext!.scale(CANVAS_SCALING,CANVAS_SCALING);
    this.debugCanvasContext!.scale(CANVAS_SCALING,CANVAS_SCALING);
    this.trashCanvasContext!.scale(CANVAS_SCALING,CANVAS_SCALING);
    this.interfaceHUDCanvasContext!.scale(CANVAS_SCALING,CANVAS_SCALING);
  }

  /*
    Coloca uma nova peça no jogo.
  */
  pieceSet() {
    this.actualPiece = new TPiece();
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
    console.log("Tamanho da grid original: " + this.gridVector.length);
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
      default:
        return 0;
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
          if (this.actualPiece.shape![rotate!] == 1) {
            let index = (((currentX + (px * BLOCK_SIZE)) / BLOCK_SIZE) + ((((currentY + (py * BLOCK_SIZE)) / BLOCK_SIZE) - 1) * GRIDCOLS));
            if(index > this.gridVector.length){
              throw `Validação de index estourou os limites, (((${currentX} + (${px} * ${BLOCK_SIZE})) / ${BLOCK_SIZE}) + ((((${currentY} + (${py} * ${BLOCK_SIZE})) / ${BLOCK_SIZE}) - 1 * ${GRIDCOLS}));`
            }
            let colision = (this.gridVector[index].value == 9 || this.gridVector[index].value == 1) ? true : false;
            if (colision) {
              return colision;
            }
          }
        }
      }
    } catch (err) {
      console.error(`Erro de colisão: ${err}`);
    }
    return false;
  }
  /*
    Faz o desenho da grid.
  */
  grid() {
    this.canvasGridContext!.clearRect(0,0,this.gridCanvas.nativeElement.width,this.gridCanvas.nativeElement.height);

    let {
      x1,
      x2,
      y1,
      y2
    } = this.themeService.getDrawParams();

    for (let r = 6; r <= ROWS + 1; r++) {
      for (let c = 0; c < COLS; c++) {
        if (r != ROWS + 1) {
          this.canvasGridContext!.drawImage(this.themeService.themeImages[0], x1, y1, x2, y2, (c * BLOCK_SIZE) + (BLOCK_SIZE * LATERAL_PADDING), (r * BLOCK_SIZE) + (BLOCK_SIZE * TOP_PADDING), BLOCK_SIZE, BLOCK_SIZE);
        }
      }
    }
  }
  /*
    Faz o desenho de grid com numeração de cada casa e o seu valor.
  */
  gridArrayDebug() {
    this.debugCanvasContext?.clearRect(0,0,this.debugCanvas.nativeElement.width,this.debugCanvas.nativeElement.height);
    for (let c = 0; c < GRIDCOLS; c++) {
      for (let r = 6; r < GRIDROWS; r++) {
        this.debugCanvasContext!.fillText(this.gridVector[r * GRIDCOLS + c].value.toString(), c * BLOCK_SIZE + 12 + (BLOCK_SIZE * LATERAL_PADDING) - BLOCK_SIZE, r * BLOCK_SIZE + 50 + (BLOCK_SIZE * TOP_PADDING) - BLOCK_SIZE);
        this.debugCanvasContext!.stroke();
      }
    }
  }

  /*
    Desenho de jogo.
  */
  gameDraw() {
    try {
        setTimeout(()=>{
          this.delayTime++;
        },1)
        setTimeout(() => {
          if (!this.isGameOver && !this.isPaused) {
            this.lastPosX = this.posX;
            this.lastPosY = this.posY;

            if (this.colision(this.posX, this.posY + BLOCK_SIZE, this.actualPiece.rotation)) {
              this.saveTetromino(this.posX, this.posY);

              this.clearFullLines();
              this.trashEventTrigger();
              this.gridArrayDebug();
              this.actualPiece.spawn();
            }

            this.fallingPiecesCanvasContext!.clearRect(this.lastPosX - (BLOCK_SIZE * 2 * LATERAL_PADDING), this.lastPosY - (BLOCK_SIZE * (-TOP_PADDING * 4)) , this.lastPosX + (BLOCK_SIZE * 7 * LATERAL_PADDING), this.posY + (BLOCK_SIZE * 7 * -TOP_PADDING));
            this.posY += BLOCK_SIZE;

            this.tetrominoDraw();
            this.drawTrashIndicator();
            this.views.drawViews();

            this.useDelay = false;
            this.delayTime = 0;

          }
          window.requestAnimationFrame(() => this.gameDraw());
        }, this.gameTime + (this.useDelay ? this.delayTime : 0));


      if(this.isGameOver) {
        // location.reload();
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
    this.fallingPiecesCanvasContext!.clearRect(this.lastPosX - (BLOCK_SIZE * 2 * LATERAL_PADDING), this.lastPosY - (BLOCK_SIZE * (-TOP_PADDING * 4)) , this.lastPosX + (BLOCK_SIZE * 7 * LATERAL_PADDING), this.posY + (BLOCK_SIZE * 7 * -TOP_PADDING));

    for (let px = 0; px < 4; px++) {
      for (let py = 0; py < 4; py++) {
        let rotate = this.pieceRotate(px, py, this.actualPiece.rotation);
        if (this.actualPiece.shape![rotate!] == 1) {
          let tetrominoPieceIndex = GameUtils.getIndexHeightByPos(this.posY, py);
          if (tetrominoPieceIndex + (GRIDCOLS * py) + px >= GRIDCOLS * 6) {
            this.fallingPiecesCanvasContext!.drawImage(this.themeService.themeImages[this.actualPiece.pieceNumberId]!, x1, y1, x2, y2, this.posX + (px * BLOCK_SIZE) + (BLOCK_SIZE * (LATERAL_PADDING - 1)) , this.posY + (py * BLOCK_SIZE) + (BLOCK_SIZE * TOP_PADDING) - BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          }
        }
      }
    }

  }

  /*
    Após colisão, desenha a peça em outro canvas que fica fixo.
  */
  saveTetromino(posX : number, posY : number) {
    let {
      x1,
      x2,
      y1,
      y2
    } = this.themeService.getDrawParams();
    for (let px = 0; px < 4; px++) {
      for (let py = 0; py < 4; py++) {
        let rotate = this.pieceRotate(px, py, this.actualPiece.rotation);

        if (this.actualPiece.shape![rotate] == 1) {
          const colIndex = ((posX + (px * BLOCK_SIZE)) / BLOCK_SIZE);
          let index = (colIndex + ((((posY + (py * BLOCK_SIZE)) / BLOCK_SIZE) - 1) * GRIDCOLS));
          if(colIndex > 10) console.error("Coluna invalida para inserção");
          console.log("Tetromino na coluna: " + colIndex);
          if (index < GRIDCOLS * 6) {
            this.isGameOver = true;
          } else {
            this.gridVector[index] = {
              value: 1,
              themeNumber: this.actualPiece.pieceNumberId
            };
            this.piecesCanvasContext!.drawImage(this.themeService.themeImages[this.gridVector[index].themeNumber!], x1, y1, x2, y2, posX + (px * BLOCK_SIZE) + (BLOCK_SIZE * (LATERAL_PADDING - 1)), posY + (py * BLOCK_SIZE) + (BLOCK_SIZE * TOP_PADDING) - BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          }
        }
      }
    }
    if(this.isGameOver){
      this.matchVariables.setGameOver(this.isGameOver);
    }
    this.posY = 30;
    this.posX = BLOCK_SIZE * 6;
    this.gambiColuna();
    this.matchVariables.setGridUpdate(this.gridVector);
  }
  /*
    Limpa as linhas cheias.

    NECESSARIO MUDAR O ALGORITMO
    Pode se realizar essa validação com base na posição Y e Y + 4 convertidos no indices de vetor como intervalo, assim evita ser iterado toda vez a grita toda.
  */
  clearFullLines() {
    let cleanOnceOrMore = false;
    let rowsCleaned = 0;
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
        cleanOnceOrMore = true;
        rowsCleaned++;
        for (let indexReset = r * GRIDCOLS + 1; indexReset <= r * GRIDCOLS + COLS; indexReset++) {
          this.gridVector[indexReset] = {
            value: 0
          };
        }
        for (let rDown = r; rDown >= 0; rDown--) {
          for (let c = 1; c <= GRIDCOLS - 1; c++) {
            if (rDown != 0) {
              this.gridVector[rDown * GRIDCOLS + c] = this.gridVector[(rDown * GRIDCOLS + c) - 12]
            } else {
              this.gridVector[rDown * GRIDCOLS + c] = {
                value: 0
              };
            }
          }
        }
        r++;
        this.redrawAllTetrominos();
        this.gameTime -= 6;
        this.gamePontuation += 50;
        if(this.accumulatedTrash > 0){
          this.accumulatedTrash--;
        }
      }
    }
    if(cleanOnceOrMore && this.eventsLeftForTrash < 5) this.eventsLeftForTrash++;
    this.matchVariables.setEnemyAttack(rowsCleaned);
  }

  redrawAllTetrominos() {
    this.piecesCanvasContext!.clearRect(0, 0, this.piecesCanvasContext!.canvas.width, this.piecesCanvasContext!.canvas.height);
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
            this.piecesCanvasContext!.drawImage(this.themeService.themeImages[this.gridVector[index].themeNumber!], x1, y1, x2, y2, c * BLOCK_SIZE + (BLOCK_SIZE * (LATERAL_PADDING - 1)), r * BLOCK_SIZE + (BLOCK_SIZE * TOP_PADDING), BLOCK_SIZE, BLOCK_SIZE);
          }
        }
      }
    }
  }

  //Call this a gambiarra, I call as no time to debug which matrix loop is setting the last column to 0 and breaking colision
  //Todo: não está funcionando :|
  gambiColuna(){
    for(let r = 0; r <= GRIDROWS; r++){
      let rightWallIndex = r * GRIDCOLS + GRIDCOLS;
      if(this.gridVector[rightWallIndex]) this.gridVector[rightWallIndex].value = 9;
    }
  }

  drawTrashIndicator(){
    this.trashCanvasContext?.clearRect(0,0,this.trashCanvas.nativeElement.width,this.trashCanvas.nativeElement.height);
    let {
      x1,
      x2,
      y1,
      y2
    } = this.themeService.getDrawParams();
    for(let i = TRASH_LEVEL - this.accumulatedTrash; i < TRASH_LEVEL; i++){
      const heightToDraw = this.trashCanvas.nativeElement.height - (BLOCK_SIZE * (TRASH_LEVEL - i)) - 815;
      console.log({
        cnvY1: heightToDraw,
        tshIndx:i
      })

      this.trashCanvasContext?.drawImage(this.themeService.themeImages[0],0,0,this.themeService.themeImages[0].width,this.themeService.themeImages[0].height,0,heightToDraw,BLOCK_SIZE,BLOCK_SIZE);
    }
  }

  trashEventTrigger(){
    if(this.accumulatedTrash > 0) this.eventsLeftForTrash--;
    if(this.eventsLeftForTrash == 0){
      GridUtils.gridTrashLineup(this.gridVector,this.accumulatedTrash);
      this.redrawAllTetrominos();
      this.accumulatedTrash = 0;
      this.eventsLeftForTrash = 5;
    }
  }

  setGarbageOnGrid(trashHeight:number){
    this.accumulatedTrash+= trashHeight;
  }

  onChangeTheme(themeFileString : any){
    this.themeService.changeTheme(themeFileString.target.value);
  }

  authenticateUser(){
  }

  toggleUi(value : boolean){
    this.isUiEnabled = value;
  }
  @HostListener("window:keyup", ['$event'])
  handleFocusChange(event : KeyboardEvent){
    this.attackModes.find((mode)=> {
      if(mode.key.toString() == event.key.toString()){
        this.matchVariables.setAttackMode(mode.name);
        console.log(mode);
        this.attackModes.forEach(previousModes => previousModes.isEnabled = false);
        mode.isEnabled = true;
        return true;
      }
      return false;
    })
  }

  handleFocusChangeClick(mode:FocusButtonItem){
    this.matchVariables.setAttackMode(mode.name);
  }
}

class FocusButtonItem {
    name!: string;
    size!: number;
    key!: number;
    isEnabled ?: boolean = false;
}
