import { Injectable } from "@angular/core";
import { AuthService, User } from "@auth0/auth0-angular";
import { pipe } from "rxjs";
import { SocketEventClientEnumerator } from "src/app/game-modules/enums/socket-event.enum";
import { SocketService } from "../socket/socket.service";

@Injectable({
    providedIn: 'root'
})

export class UserService{
  private autenticateEnum = SocketEventClientEnumerator.AUTENTICATE;
  public auth0User ?: User;
  constructor(
      private socketService : SocketService,
      private auth : AuthService
  ){
  }

  authenticate(){
    if(!this.auth0User){
      let subs = this.auth.getUser().subscribe((user)=>{
        if(user){
          this.setUser(user);
          this.socketService.socketMsg(this.autenticateEnum,user.nickname || user.email);
          // subs.unsubscribe();
        }
      });
    }
    this.socketService.socketMsg(this.autenticateEnum,this.auth0User?.nickname || this.auth0User?.email);
  }

  setUser(user : User){
    this.auth0User = user;
  }
}
