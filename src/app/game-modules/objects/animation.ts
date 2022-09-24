export class Animation {
  animationEnum : number = 0;
  enabled:boolean = false;
  animationTime : number = 0;
  intervalFunction : Function = () => {};
  private timeout ?: any = null;
  private interval ?: any = null;

  /**
   *
   */
  constructor(animationEnum : number,enabled : boolean, animationTime : number, intervalFunction : Function) {
    this.animationEnum = animationEnum;
    this.enabled = enabled;
    this.animationTime = animationTime;
    this.intervalFunction = intervalFunction ? intervalFunction : () => {};
  }

  startAnimation(){
   this.enabled = true;
    if(this.timeout == null){
      console.log("Iniciando animação de ")
      this.timeout = setTimeout(()=>{
        this.enabled = false;
        this.timeout = null;
        clearInterval(this.interval);
      },this.animationTime * 1000)
      this.interval = setInterval(this.intervalFunction(),50)
    }
  }
}
export enum AnimationEnum{
  "trashIndicatorShake"
}
