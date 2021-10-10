import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { io, Socket } from "socket.io-client";
@Injectable({
    providedIn:'root'
})

export class SocketService {
    socket ?: Socket;
    public _eventBehavior : BehaviorSubject<{key:number,value:string}> = new BehaviorSubject({key:0,value:"0"})
    public isConnected : boolean = false;

    socketReturn(){
        this.socket = io("http://localhost:3000");
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
    
    socketMsg(key : string, value: string){
        if(this.socket!.connected) this.socket!.emit("event",value);
        else console.warn("Socket não está aberto");
    }

    private eventHandler(message : string){
        let key : number = 0;
        let value : string = "";

        try{    
            let keyValue = message.split("|")
            key = Number.parseInt(keyValue[0])
            value = keyValue[1]
        }
        catch(err){
            console.error(`Evento invalido: ${err}`)
        }
        finally{
            return {key,value}
        }
    }
}