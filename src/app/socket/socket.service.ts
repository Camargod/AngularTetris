import { Injectable } from "@angular/core";
import { Socket } from "net";

@Injectable({
    providedIn:'root'
})

export class SocketService {
    socket : WebSocket = new WebSocket("ws://localhost:8080/chat");


    socketReturn(){
        this.socket.onopen = (event) =>{
            console.log("Iniciando Socket.")
        }
        this.socket.onmessage = (event : MessageEvent) =>{
            console.log(event.data)
        }
    }
    socketMsg(msg : string){
        this.socket.send(msg)
    }
}