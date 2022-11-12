import {
  Injectable
} from "@angular/core";
import {
  AppComponent
} from "src/app/app.component";
import {
  BLOCK_SIZE
} from "src/app/game-modules/utils/constants";
import { TetrisGameComponent } from "../../game-view/tetris-game/tetris-game.component";

@Injectable({
  providedIn: 'root'
})
export class MovementService {

  keyLeft(scope: TetrisGameComponent) {
    let inversion = scope.cardsService.inversedCommands ? -1 : 1;
    if (!scope.colision(scope.posX - BLOCK_SIZE * inversion, scope.posY, scope.actualPiece.rotation)) {
      scope.fallingPiecesCanvasContext!.clearRect(scope.posX, scope.posY, scope.posX + (BLOCK_SIZE * 4), scope.posY + (BLOCK_SIZE * 4));
      scope.posX -= BLOCK_SIZE * inversion;
      scope.tetrominoDraw();
    }
  }

  keyRight(scope: TetrisGameComponent) {
    let inversion = scope.cardsService.inversedCommands ? -1 : 1;

    if (!scope.colision(scope.posX + BLOCK_SIZE * inversion, scope.posY, scope.actualPiece.rotation)) {
      scope.fallingPiecesCanvasContext!.clearRect(scope.posX, scope.posY, scope.posX + (BLOCK_SIZE * 4), scope.posY + (BLOCK_SIZE * 4));
      scope.posX += BLOCK_SIZE * inversion;
      scope.tetrominoDraw();
    }
  }

  rotateLeft(scope: TetrisGameComponent, ignoreInverse = true) {
    if(!ignoreInverse && scope.cardsService.inversedCommands) this.rotateRight.bind(this)(scope, false);

    if (!scope.colision(scope.posX, scope.posY, scope.actualPiece.rotation + 1)) {
      if (scope.actualPiece.rotation == 3) {
        scope.actualPiece.rotation = 0;
      } else {
        scope.actualPiece.rotation += 1;
      }
      scope.fallingPiecesCanvasContext!.clearRect(scope.posX, scope.posY, scope.posX + (BLOCK_SIZE * 4), scope.posY + (BLOCK_SIZE * 4));
      scope.tetrominoDraw();
    }
  }
  rotateRight(scope: TetrisGameComponent, ignoreInverse = true) {
    if(!ignoreInverse && scope.cardsService.inversedCommands) this.rotateLeft.bind(this)(scope, false);
    if (!scope.colision(scope.posX, scope.posY, scope.actualPiece.rotation - 1 < 0 ? 3 : scope.actualPiece.rotation - 1)) {
      if (scope.actualPiece.rotation == 0) {
        scope.actualPiece.rotation = 3;
      } else {
        scope.actualPiece.rotation -= 1;
      }
      scope.fallingPiecesCanvasContext!.clearRect(scope.posX, scope.posY, scope.posX + (BLOCK_SIZE * 4), scope.posY + (BLOCK_SIZE * 4));
      scope.tetrominoDraw();
    }
  }

  keyDown(scope: TetrisGameComponent) {
    if (!scope.colision(scope.posX, scope.posY + BLOCK_SIZE, scope.actualPiece.rotation)) {
      scope.posY += BLOCK_SIZE;
      scope.fallingPiecesCanvasContext!.clearRect(0, 0, scope.fallingPiecesCanvas.nativeElement.width, scope.fallingPiecesCanvas.nativeElement.height);
      scope.tetrominoDraw();
      scope.useDelay = true;
    }
  }

  turbo(scope: TetrisGameComponent) {
    scope.isTurboOn = true;
  }

  swapPiece(scope : TetrisGameComponent){
    scope.swapPiece();
  }

  keyDownMap: any = {
    "ArrowLeft": this.keyLeft,
    "ArrowUp": this.rotateLeft,
    "z": this.rotateRight,
    "ArrowRight": this.keyRight,
    "ArrowDown": this.keyDown,
    "Shift": this.turbo,
    "/": this.swapPiece
  }
}
