import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { io, Socket } from "socket.io-client";
@Injectable({
    providedIn:'root'
})

export class SocketService {
    socket : Socket;
    public _eventBehavior : BehaviorSubject<{key:number,value:string}> = new BehaviorSubject(null)
    public isConnected : boolean = false;

    socketReturn(){
        this.socket = io("http://localhost:3000");
        debugger;
        this.socket;
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
        //if(this.socket.readyState == this.socket.OPEN) this.socket.send(`${key}|${value}`);
        //else console.warn("Socket não está aberto");
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