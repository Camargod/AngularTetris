import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { io, Socket } from "socket.io-client";
import { SocketEventClientEnumerator } from "src/enums/socket-event.enum";
@Injectable({
    providedIn:'root'
})

export class SocketService {
    socket ?: Socket;
    public _eventBehavior : BehaviorSubject<{key:number,value:string}> = new BehaviorSubject({key:0,value:"0"})
    public isConnected : boolean = false;

    socketReturn(){
        this.socket = io("http://localhost:3000");
        this.socket!.onAny((key,value)=>{
            console.log(`key: ${key} value: ${value}`);
            this._eventBehavior.next(this.eventHandler(key,value))
        })
        // this.socket. = (event) =>{
        //     console.log("Iniciando Socket.");
        //     this.isConnected = true;
        // }
        // this.socket.onmessage = (event : MessageEvent) =>{
        //    let response = this.eventHandler(event.data);
        //    this._eventBehavior.next(response);
        // }
        // this.socket.onerror = (event) => {
        //     setTimeout(()=>{this.socketReturn()},1000)
        //     console.log("Reconectando");
        // }
    }
    
    socketMsg(key : SocketEventClientEnumerator, value: any){
        if(this.socket!.connected) this.socket!.emit(SocketEventClientEnumerator[key],value);
        else console.warn("Socket não está aberto");
    }

    private eventHandler(key : any, value : any){
        key = Number.parseInt(key);
        return {key,value}
    }
}