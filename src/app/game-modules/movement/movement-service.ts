import { Injectable } from "@angular/core";
import { AppComponent } from "src/app/app.component";
import { BLOCK_SIZE } from "src/app/constants";

@Injectable({
    providedIn: 'root'
})
export class MovementService{

    keyLeft(scope : AppComponent){
        if (!scope.colision(scope.posX - BLOCK_SIZE, scope.posY, scope.actualPiece.rotation)) {
          scope.fallingPiecesCanvasContext!.clearRect(scope.posX, scope.posY, scope.posX + (BLOCK_SIZE * 4), scope.posY + (BLOCK_SIZE * 4));
          scope.posX -= BLOCK_SIZE;
          scope.tetrominoDraw();
        }
      }
    
      keyRight(scope : AppComponent){
        if (!scope.colision(scope.posX + BLOCK_SIZE, scope.posY, scope.actualPiece.rotation)) {
          scope.fallingPiecesCanvasContext!.clearRect(scope.posX, scope.posY, scope.posX + (BLOCK_SIZE * 4), scope.posY + (BLOCK_SIZE * 4));
          scope.posX += BLOCK_SIZE;
          scope.tetrominoDraw();
        }
      }
    
      keyUp(scope : AppComponent){
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
    
      keyDown(scope : AppComponent){
        if(!scope.colision(scope.posX, scope.posY + BLOCK_SIZE, scope.actualPiece.rotation)){
          scope.posY += BLOCK_SIZE;
          scope.fallingPiecesCanvasContext!.clearRect(0,0,scope.fallingPiecesCanvas.nativeElement.width,scope.fallingPiecesCanvas.nativeElement.height);
          scope.tetrominoDraw();
          scope.useDelay = true;
        }
      }
    
      keyMap : any = {
        37: this.keyLeft,
        38: this.keyUp,
        39: this.keyRight,
        40: this.keyDown
      }
}