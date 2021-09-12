import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import { BehaviorSubject } from 'rxjs';
import { SocketEventServerEnumerator } from 'src/enums/socket-event.enum';
import { SocketService } from '../socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class MatchVariablesService {

constructor(
  private socketService : SocketService 
) { }

  public timer = new BehaviorSubject<number>(0);
  public game_start = new BehaviorSubject<boolean>(false);
  public damage_received = new BehaviorSubject<number>(0);

  public in_match_players = new BehaviorSubject<number>(0);


  startGameListening(){
    this.socketService.socketReturn();
    this.socketService._eventBehavior.subscribe((message)=>{
      this.socketMessageHandler(message)
    })
  }

  private socketMessageHandler(event: {key:number,value:string}){
    if(event) switch(event.key){
      case SocketEventServerEnumerator.TIME_UPDATE:
        this.timer.next(Number.parseInt(event.value));
        break;
      case SocketEventServerEnumerator.GAME_START:
        this.game_start.next(event.value == "true");
        break;
      case SocketEventServerEnumerator.RECEIVED_DAMAGE:
        this.damage_received.next(Number.parseInt(event.value));
        break;
      case SocketEventServerEnumerator.IN_MATCH_PLAYERS:
        this.in_match_players.next(Number.parseInt(event.value));
        break;
    } 
    // this.socketVars[this.enums[event.key]] = event.value
  }

  public static helloWorld(){
    window.alert("Hello world");
  } 
}
