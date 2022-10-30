import { GRIDCOLS, GRIDROWS } from "src/app/game-modules/utils/constants";
import { TetrisGridPiece } from "../objects/tetris-grid-piece";

export default class GridUtils{

  static gridTrashLineup(grid : Array<TetrisGridPiece>, height : number){
    this.lineup(grid, height);
    const whiteSpaceColumn = this.getFreeColumn();
    console.log(`Inserindo linha de lixo com tamanho de ${height}, espaço em branco na coluna ${whiteSpaceColumn}`);
    for(let col = 1; col < GRIDCOLS - 1;col++){
      for(let row = GRIDROWS - 1 - height; row <= GRIDROWS - 1;row++){
        const index = (row * GRIDCOLS) + col;
        if(col != whiteSpaceColumn){
          grid[index].themeNumber = 1;
          grid[index].value = 1;
        }
      }
    }
  }
  private static lineup(grid:Array<TetrisGridPiece>,height : number){
    let gameOver = false;
    for(let col = 1; col < GRIDCOLS - 1 && !gameOver; col++){
      for(let row = 0; row < GRIDROWS - 1 && !gameOver;row++){
        const index = (row * GRIDCOLS) + col;
        const indexPlusHeight = index + (GRIDCOLS * height);
        if(row + height < GRIDROWS - 1){
          this.exchangePiecesPos(grid[index],grid[indexPlusHeight]);
        }
        else{
          this.setVoidPiece(grid[index]);
        }
      }
    }
  }

  private static setVoidPiece(gridPieceA : TetrisGridPiece){
    gridPieceA.value = 0;
    gridPieceA.themeNumber = 1;
  }

  private static exchangePiecesPos(gridPieceA : TetrisGridPiece, gridPieceB : TetrisGridPiece){
    if(gridPieceA && gridPieceB){
      gridPieceA.value = gridPieceB.value;
      gridPieceA.themeNumber = gridPieceB.themeNumber;
    }
  }

  private static getFreeColumn() : number{
    const columnPreview = Math.floor(Math.random() * (GRIDCOLS - 1));
    if(columnPreview >= 1) return columnPreview;
    return columnPreview + 1;
  }
}
