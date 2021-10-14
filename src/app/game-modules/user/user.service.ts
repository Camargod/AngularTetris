import { Injectable } from "@angular/core";
import { SocketEventClientEnumerator } from "src/enums/socket-event.enum";
import { SocketService } from "../socket/socket.service";

@Injectable({
    providedIn: 'root'
})

export class UserService{
    private autenticateEnum = SocketEventClientEnumerator.AUTENTICATE;
    constructor(
        private socketService : SocketService
    ){}

    authenticate(user : string){
        this.socketService.socketMsg(this.autenticateEnum,user);
    }
}