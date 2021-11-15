import { TetrisGridPiece } from "./tetris-grid-piece";

export type PlayersGrids = {
    [index: string]: Array<TetrisGridPiece> | never[];  
}