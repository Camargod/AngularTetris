export default class TPiece
{
  x: number;
  y: number;
  color: string;
  shape: number[];
  rotation : number = 0;
  tetrominos =
  [
    [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
    [0,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0],
    [0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,0],
    [0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,0],
    [0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0]
  ]

  constructor(private ctx: CanvasRenderingContext2D) 
  {
    this.spawn();
  }

  spawn() 
  {
    this.color = "blue";
    this.shape = this.tetrominos[2];
  }
}