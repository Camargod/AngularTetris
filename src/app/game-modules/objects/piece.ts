export class TPiece {
  x?: number;
  y?: number;
  color?: string;
  shape?: number[];
  rotation: number = 0;
  pieceNumberId = -1;
  tetrominos = [
    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0], // |
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0], // T
    [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0], // Z
    [0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0], // S
    [0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], // O
    [0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0], // L
    [0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0] // J
  ]

  constructor() {
    this.spawn();
  }

  spawn(nextPiece ?: number) {
    let number = nextPiece != undefined ? nextPiece : Math.round(Math.random() * 6);
    this.shape = this.tetrominos[number];
    this.rotation = 0;
    this.pieceNumberId = number + 1;
  }
}
