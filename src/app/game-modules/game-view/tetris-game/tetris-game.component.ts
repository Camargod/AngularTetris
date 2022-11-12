import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { skip } from 'rxjs/operators';
import { EnemiesViewComponent } from '../../hud/enemies-view/enemies-view.component';
import { Animation, AnimationEnum } from '../../objects/animation';
import { overrideCanvas, OverridedCanvas2DContext } from '../../objects/CanvsRenderingContext2DCustom';
import { TPiece } from '../../objects/piece';
import { TetrisGridPiece } from '../../objects/tetris-grid-piece';
import { CardsService } from '../../services/cards/cards-service';
import { MatchVariablesService } from '../../services/match-variables/match-variables.service';
import { MovementService } from '../../services/movement/movement.service';
import { Themes, ThemeService } from '../../services/themes/theme-service';
import { UiStateControllerService, UiStatesEnum } from '../../ui/ui-state-controller/ui-state-controller.service';
import { BLOCK_SIZE, CANVAS_SCALING, COLS, GRIDCOLS, GRIDROWS, LATERAL_PADDING, ROWS, TOP_PADDING, TRASH_LEVEL } from '../../utils/constants';
import GameUtils from '../../utils/game-utils';
import GridUtils from '../../utils/grid-utils';
import { TetrominoGen } from '../../utils/tetromino-gen';

@Component({
  selector: 'tetris-game',
  templateUrl: './tetris-game.component.html',
  styleUrls: ['./tetris-game.component.scss']
})
export class TetrisGameComponent implements OnInit {

  @ViewChild("gridcanvas", {static: true}) gridCanvas !: ElementRef < HTMLCanvasElement > ;
  @ViewChild("piecescanvas", {static: true}) piecesCanvas !: ElementRef < HTMLCanvasElement > ;
  @ViewChild("fallingpiecescanvas", {static: true}) fallingPiecesCanvas !: ElementRef < HTMLCanvasElement > ;
  @ViewChild("debugcanvas",{static:true}) debugCanvas !: ElementRef<HTMLCanvasElement>;
  @ViewChild("trashcanvas", {static:true}) trashCanvas !: ElementRef <HTMLCanvasElement>;
  @ViewChild("interfaceHUD", {static: true}) interfaceHUD !: ElementRef <HTMLCanvasElement>;
  @ViewChild("queuecanvas", {static: true}) queueHUD !: ElementRef <HTMLCanvasElement>;

  canvasGridContext !: CanvasRenderingContext2D;
  piecesCanvasContext !: CanvasRenderingContext2D;
  fallingPiecesCanvasContext !: CanvasRenderingContext2D;
  interfaceHUDCanvasContext !: CanvasRenderingContext2D;
  debugCanvasContext !: CanvasRenderingContext2D ;
  trashCanvasContext !: CanvasRenderingContext2D;
  queueHUDContext !: OverridedCanvas2DContext;

  @Input() views !: EnemiesViewComponent;

  /*
    Vetor de grid, contendo a informação da casa e a cor da peça que está nela.
  */
    gridVector !: Array <TetrisGridPiece> ;

    initalPos: number = 0;

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


    delayTime = 0;
    useDelay = false;
    isTurboOn = false;

    isGameOver: boolean = false;
    isPaused = true;
    isFrozen = false;
    isPausedSubscription ?: Subscription;
    _isFrozenSubscription ?: Subscription;
    hasImageLoaded: boolean = false;
    themeList = Themes;
    isSingleplayer = false;

    actualPiece : TPiece = new TPiece();
    holdedPiece : TPiece = new TPiece();
    canSwap = true;

    gamePontuation = 0;

    accumulatedTrash = 0;
    eventsLeftForTrash = 5;

    playersOnFocus : Array<String> = [];

    //Variáveis do socket
    timer = 0;
    players = 0;

    //Variaveis híbridas
    piecesQueue : Array<number> = [];
    gameTime = 500;
    //Maybe some effects can affect the original game time, the above is the original game time.
    gameTimer2 = 0;

    _timerSubscription ?: Subscription;
    _playersSubscription ?: Subscription;
    _trashReceive ?: Subscription;
    _playersToBeFocused ?: Subscription;
    _piecesQueueSubscription ?: Subscription;
    _isSingleplayerSubscription ?: Subscription;
    _gameTimeSubscription ?: Subscription;

    constructor(
      private themeService: ThemeService,
      private matchVariables : MatchVariablesService,
      private movementService : MovementService,
      private uiStateControllerService : UiStateControllerService,
      private tetrominoGen : TetrominoGen,
      public cardsService : CardsService
    ) {}


    animations : Map<number,Animation> = new Map([
      [AnimationEnum.trashIndicatorShake,new Animation(AnimationEnum.trashIndicatorShake,false,1.7,()=>{})]
    ])




    /*
      Movimento de peças, por evento de keydown
    */
    @HostListener('window:keydown', ['$event'])
    keyDownEvent(event: KeyboardEvent) {
      if (event.key && this.movementService.keyDownMap[event.key] && !this.isGameOver) {
        this.movementService.keyDownMap[event.key](this);
      }
    }

  ngOnInit() {
    this.socketStart();
    this.themeService.setTile(0);
    this.prepareCanvasContexts();
    this.setCanvasSize();
    this.pieceSet()
    this.setBounds();
    this.waitImageLoad();
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
      if(isSingleplayer){
        this.piecesQueue = this.tetrominoGen.shuffle();
        this.drawNextPieces();
      }
    });
    this._trashReceive = this.matchVariables.damage_received.subscribe((trashHeight)=>{
      if(trashHeight <= TRASH_LEVEL - trashHeight){
        this.setGarbageOnGrid(trashHeight);
        this.animations.get(AnimationEnum.trashIndicatorShake)?.startAnimation();
      }
    });
    this._piecesQueueSubscription = this.matchVariables.nextPieces.subscribe((pieces)=>{
      this.piecesQueue.push(...pieces);
      if(pieces.length > 0)this.drawNextPieces();
    })
    this._isFrozenSubscription = this.cardsService.isFrozen.subscribe((isFrozen)=>{
      this.isFrozen = isFrozen;
    });
  }

    waitImageLoad() {
      this.themeService.loadNewTheme().subscribe(()=>{
        this.hasImageLoaded = true;
        this.draw()
        this.gameDraw();
        this.drawNextPieces()
      })

      this.themeService.selectedThemeChanged.pipe(skip(1)).subscribe(()=>{
        this.grid();
      })
    }

    gameDraw() {
      let hasMultiplier = this.cardsService.speedMultiplier > 1;
      let speedExtra = hasMultiplier ? this.gameTime * (0.125 * this.cardsService.speedMultiplier) : 0;
      let speed = this.gameTime + (this.useDelay ? this.delayTime : 0) - speedExtra;
      this.gameTimer2 = speed;
      try {
          setTimeout(()=>{
            this.delayTime++;
          },1)
          setTimeout(() => {
            this.gameFrame();
            window.requestAnimationFrame(() => this.gameDraw());
          }, speed);
      } catch (err) {
        console.error(`Erro de gameloop: ${err}`)
      }
    }

    gameFrame(){
      if (!this.isGameOver && !this.isPaused && !this.isFrozen) {
        this.lastPosX = this.posX;
        this.lastPosY = this.posY;

        if (this.colision(this.posX, this.posY + BLOCK_SIZE, this.actualPiece.rotation)) {
          this.saveTetromino(this.posX, this.posY);
          this.isTurboOn = false;
          this.canSwap = true;
          this.clearFullLines();
          this.trashEventTrigger();
          // this.gridArrayDebug();
          this.actualPiece.spawn(this.piecesQueue.shift());
          this.drawNextPieces();
          this.cardsService.turns.next(this.cardsService.turns.value + 1);
        }

        this.fallingPiecesCanvasContext!.clearRect(this.lastPosX - (BLOCK_SIZE * 2 * LATERAL_PADDING), this.lastPosY - (BLOCK_SIZE * (-TOP_PADDING * 4)) , this.lastPosX + (BLOCK_SIZE * 7 * LATERAL_PADDING), this.posY + (BLOCK_SIZE * 7 * -TOP_PADDING));
        this.posY += BLOCK_SIZE;

        this.tetrominoDraw();
        this.drawTrashIndicator();
        this.views.drawViews();

        this.useDelay = false;
        this.delayTime = 0;
      }
    }

  draw() {
    this.grid();
    this.realtimeLifecycle();
    this.drawHud();
  }
  /*
    Traz para o tipo de contexto as referencias de elemento HTML
  */
  prepareCanvasContexts() {
    this.canvasGridContext = this.gridCanvas.nativeElement.getContext('2d')!;
    this.piecesCanvasContext = this.piecesCanvas.nativeElement.getContext('2d')!;
    this.fallingPiecesCanvasContext = this.fallingPiecesCanvas.nativeElement.getContext('2d')!;
    this.debugCanvasContext = this.debugCanvas.nativeElement.getContext('2d')!;
    this.trashCanvasContext = this.trashCanvas.nativeElement.getContext('2d')!;
    this.interfaceHUDCanvasContext = this.interfaceHUD.nativeElement.getContext('2d')!;
    this.queueHUDContext = this.queueHUD.nativeElement.getContext("2d") as OverridedCanvas2DContext;
    overrideCanvas(this.queueHUDContext!);
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
    this.queueHUDContext!.scale(CANVAS_SCALING - 1,CANVAS_SCALING - 1);
  }

  /*
    Coloca uma nova peça no jogo.
  */
  pieceSet() {
    this.actualPiece = new TPiece();
    this.holdedPiece.pieceNumberId = -1;
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
              // throw `Validação de index estourou os limites, (((${currentX} + (${px} * ${BLOCK_SIZE})) / ${BLOCK_SIZE}) + ((((${currentY} + (${py} * ${BLOCK_SIZE})) / ${BLOCK_SIZE}) - 1 * ${GRIDCOLS}));`
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
          if (index < GRIDCOLS * 6) {
            this.isGameOver = true;
            this.matchVariables.setGameOver(this.isGameOver);
            this.uiStateControllerService.changeState(UiStatesEnum.GAME_OVER);
            this.uiStateControllerService.toggleUi();
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
    this.resetTetrominoPosition()
    this.matchVariables.setGridUpdate(this.gridVector);
  }

  resetTetrominoPosition() {
    this.posY = BLOCK_SIZE;
    this.posX = BLOCK_SIZE * 6;
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
          for (let c = 1; c < GRIDCOLS - 1; c++) {
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
          this.accumulatedTrash == 0 ? this.eventsLeftForTrash = 5 : "";
        }
      }
    }
    if(cleanOnceOrMore && this.eventsLeftForTrash < 5) this.eventsLeftForTrash++;
    this.matchVariables.setEnemyAttack(rowsCleaned * this.cardsService.damageMultiplier);
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

  drawTrashIndicator(){
    this.trashCanvasContext?.clearRect(0,0,this.trashCanvas.nativeElement.width,this.trashCanvas.nativeElement.height);

    let x  = this.animations.get(AnimationEnum.trashIndicatorShake)?.enabled ?  Math.random() * 10 : 0;
    for(let i = TRASH_LEVEL - this.accumulatedTrash; i < TRASH_LEVEL; i++){
      const heightToDraw = this.trashCanvas.nativeElement.height - (BLOCK_SIZE * (TRASH_LEVEL - i)) - 815;
      this.trashCanvasContext?.drawImage(this.themeService.themeImages[0],0,0,this.themeService.themeImages[0].width,this.themeService.themeImages[0].height,x,heightToDraw,BLOCK_SIZE,BLOCK_SIZE);
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
    this.drawTrashIndicator();
    this.animations.get(AnimationEnum.trashIndicatorShake)?.startAnimation();
  }

  swapPiece(){
    if(this.canSwap){
      this.fallingPiecesCanvasContext.clearRect(0,0,this.fallingPiecesCanvas.nativeElement.width,this.fallingPiecesCanvas.nativeElement.height);
      this.canSwap = false;
      if(this.holdedPiece.pieceNumberId == -1){
        this.holdedPiece.spawn(this.actualPiece.pieceNumberId - 1);
        this.actualPiece.spawn(this.piecesQueue.shift()!);
        this.drawNextPieces();
      } else {
        let pieceA = this.actualPiece;
        this.actualPiece = this.holdedPiece;
        this.holdedPiece = pieceA;
        this.actualPiece.spawn(this.actualPiece.pieceNumberId - 1);
        this.drawNextPieces();
      }
      this.resetTetrominoPosition();
    }
  }

  drawNextPieces(){
    const visibleNextPieces = 4;
    const x1 = this.queueHUDContext!.canvas.width - 220;
    const y1Pieces = 210, y1Hold = y1Pieces + (BLOCK_SIZE * 4 * (visibleNextPieces + 1)) + 40;

    this.queueHUDContext?.clearRect(0,0,this.queueHUDContext.canvas.width,this.queueHUDContext.canvas.height);
    this.queueHUDContext?.roundRect(x1, y1Hold, BLOCK_SIZE * 6, 4*BLOCK_SIZE, 4);
    this.queueHUDContext!.fillStyle = "rgba(0, 0, 0, 0.4)";
    this.queueHUDContext?.fill();
    if(this.holdedPiece.pieceNumberId != -1){
      for(let r = 0; r <= 4; r++){
        for(let c = 0; c <= 4; c++){
          const index = this.pieceRotate(c,r,1);
          const piece = this.holdedPiece.pieceNumberId - 1;
          const tetrominoBodyIndex = this.holdedPiece.tetrominos[piece][index];
          if(tetrominoBodyIndex == 1){
            let image = this.canSwap ? this.themeService.themeImages[piece + 1] : this.themeService.themeImages[0];
            this.queueHUDContext?.drawImage(image,x1 + (BLOCK_SIZE * (c + 1)),y1Hold +(r * BLOCK_SIZE), BLOCK_SIZE, BLOCK_SIZE);
          }
        }
      }
    }


    this.queueHUDContext?.roundRect(x1, y1Pieces, BLOCK_SIZE * 6, 160 + visibleNextPieces*4*BLOCK_SIZE,4);
    this.queueHUDContext!.fillStyle = "rgba(0, 0, 0, 0.4)";
    this.queueHUDContext?.fill();
    for(let nextPieceI = 0; nextPieceI <= visibleNextPieces; nextPieceI++){
      for(let r = 0; r <= 4; r++){
        for(let c = 0; c <= 4; c++){
          const index = this.pieceRotate(c,r,1);
          const piece = this.piecesQueue[nextPieceI];
          const tetrominoBodyIndex = this.actualPiece.tetrominos[piece][index];
          if(tetrominoBodyIndex == 1){
            this.queueHUDContext?.drawImage(this.themeService.themeImages[piece + 1],x1 + (BLOCK_SIZE * (c + 1)),y1Pieces + ((120 * nextPieceI) + (r * BLOCK_SIZE)), BLOCK_SIZE, BLOCK_SIZE);
          }
        }
      }
    }
  }

  validateTrashShake(){
    if(this.animations.get(AnimationEnum.trashIndicatorShake)?.enabled){
      this.drawTrashIndicator();
    }
  }

  validateTurbo(){
    if(this.isTurboOn){
      this.gameFrame();
    }
  }



  realtimeLifecycle(){
    this.validateTrashShake()
    this.validateTurbo();
    setTimeout(()=>{
      requestAnimationFrame(()=>this.realtimeLifecycle());
    },1000/60)
  }
}
