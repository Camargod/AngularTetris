import { Injectable } from "@angular/core";
import { AuthService, User } from "@auth0/auth0-angular";
import { SocketEventClientEnumerator } from "src/enums/socket-event.enum";
import { SocketService } from "../socket/socket.service";

@Injectable({
    providedIn: 'root'
})

export class UserService{
  private autenticateEnum = SocketEventClientEnumerator.AUTENTICATE;
  public auth0User ?: User;
  constructor(
      private socketService : SocketService,
  ){
  }

  authenticate(){
      this.socketService.socketMsg(this.autenticateEnum,this.auth0User?.nickname || this.auth0User?.email);
  }

  setUser(user : User){
    this.auth0User = user;
  }
}
