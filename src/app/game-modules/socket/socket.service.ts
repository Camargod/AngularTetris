import { Injectable } from "@angular/core";
import { env } from "process";
import { BehaviorSubject, Observable, Subscriber } from "rxjs";

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

        this.socket = io(env.server || "http://localhost:3000");
        this.socket.onAny((key,value)=>{
            console.log(`key: ${key} value: ${value}`);
            this._eventBehavior.next(this.eventHandler(key,value))
        })
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
