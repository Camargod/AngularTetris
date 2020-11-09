export default class TPiece
{
  x: number;
  y: number;
  color: string;
  colorArray =
  [
    'blue',
    'yellow',
    'green',
    'purple',
    'pink',
    'red'  
  ];
  shape: number[];
  rotation : number = 0;
  pieceNumberId = 0;
  tetrominos =
  [
    [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], // I
    [0,0,0,0,0,1,1,1,0,0,1,0,0,0,0,0], // T
    [0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,0], // Z
    [0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,0], // S
    [0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0], // O
    [0,1,1,0,0,0,1,0,0,0,1,0,0,0,0,0], // L
    [0,0,1,1,0,0,1,0,0,0,1,0,0,0,0,0]  // J
  ]

  constructor(private ctx: CanvasRenderingContext2D) 
  {
    this.spawn();
  }

  spawn() 
  {
    let number = Math.round(Math.random()*6);
    this.color = this.colorArray[number];
    this.shape = this.tetrominos[number];
    this.rotation = 0;
    this.pieceNumberId = number + 1;
  }
}