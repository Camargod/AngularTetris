export interface OverridedCanvas2DContext extends Omit<CanvasRenderingContext2D,"roundRect"> {
  roundRect: (x : number, y : number, w : number, h : number, r : number) => {  }
}

export function overrideCanvas(canvasCtx:OverridedCanvas2DContext) {
  canvasCtx.roundRect = function (x : number, y : number, w : number, h : number, r : number) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y,   x+w, y+h, r);
    this.arcTo(x+w, y+h, x,   y+h, r);
    this.arcTo(x,   y+h, x,   y,   r);
    this.arcTo(x,   y,   x+w, y,   r);
    this.closePath();
    return this;
  }
}
