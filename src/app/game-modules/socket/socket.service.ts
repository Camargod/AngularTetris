import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subscriber } from "rxjs";

import { io, Socket } from "socket.io-client";
import { SocketEventClientEnumerator } from "src/enums/socket-event.enum";
import { environment } from "src/environments/environment";
import * as parser from "src/app/game-modules/socket/parser/socket-parser"

@Injectable({
    providedIn:'root'
})

export class SocketService {
  socket ?: Socket;
  public isSingleplayer = true;
  public _eventBehavior : BehaviorSubject<{key:number,value:string}> = new BehaviorSubject({key:0,value:"0"})
  public isConnected = new BehaviorSubject(false);

  socketConnect(){
    this.socket = io(environment.server || "http://localhost:3000",
    {
      parser: parser
    });
    this.socket.on("connect", ()=>{
      this.isConnected.next(true);
    })
    this.socket.onAny((key,value)=>{
        // console.log(`key: ${key} value: ${value}`);
        this._eventBehavior.next(this.eventHandler(key,value));
    })
  }

  socketDisconnect(){
    this.socket?.disconnect();
  }

  socketMsg(key : SocketEventClientEnumerator, value: any){
    if(this.socket?.connected && !this.isSingleplayer){
      this.socket!.emit(SocketEventClientEnumerator[key],value);
      console.log(SocketEventClientEnumerator[key]);
    }
    else if(!this.isSingleplayer){
      let obs = this.isConnected.subscribe((isConnected)=>{
        if(isConnected) {
          this.socket!.emit(SocketEventClientEnumerator[key],value);
          if(!obs.closed) obs.unsubscribe();
        }
      })
    }
  }

  private eventHandler(key : any, value : any){
    key = Number.parseInt(key);
    return {key,value}
  }
}
