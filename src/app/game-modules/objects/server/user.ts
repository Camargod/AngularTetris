import { TetrisGridPiece } from "../tetris-grid-piece";

export class User {
    userId !: string;
    socketId !: string;
    playerGrid: Array<TetrisGridPiece> = new Array(28 * 12);
}