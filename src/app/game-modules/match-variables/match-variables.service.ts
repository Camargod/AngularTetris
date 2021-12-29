import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SocketEventClientEnumerator, SocketEventServerEnumerator } from 'src/enums/socket-event.enum';
import { PlayersGrids } from '../objects/players-grids';
import { User } from '../objects/server/user';
import { TetrisGridPiece } from '../objects/tetris-grid-piece';
import { SocketService } from '../socket/socket.service';
import { Parser } from '../utils/parser';

@Injectable({
  providedIn: 'root'
})
export class MatchVariablesService {

constructor(
  private socketService : SocketService
) { }

  public timer = new BehaviorSubject<number>(9999);
  public game_start = new BehaviorSubject<boolean>(false);
  public damage_received = new BehaviorSubject<number>(0);

  public in_match_players = new BehaviorSubject<number>(0);

  public otherPlayersGrid = new BehaviorSubject<PlayersGrids>({});

  startGameListening(){
    this.socketService.socketReturn();
    this.socketService._eventBehavior.subscribe((message)=>{
      this.socketMessageHandler(message)
    })
  }

  private socketMessageHandler(event: {key:number,value:any}){
    try{
      if(event){
        switch(event.key){
          case SocketEventServerEnumerator.TIME_UPDATE:
            this.timer.next(Number.parseInt(event.value));
            console.log(`Tempo atualizado: ${this.timer.value}`)
            break
          case SocketEventServerEnumerator.GAME_START:
            this.game_start.next(event.value == "true");
            break
          case SocketEventServerEnumerator.CHALLENGER_GRID_UPDATE:
            let user : User = event.value;
            let newArray = this.otherPlayersGrid.value;
            if(this.socketService.socket?.id != user.socketId){
              newArray[user.userId] = user.playerGrid;
              this.otherPlayersGrid.next(newArray);
            } else console.log("Ignorando matriz (Id é o mesmo do seu client)");
            break
          case SocketEventServerEnumerator.ALL_CHALLENGER_GRID:
            let users : User[] = event.value;
            let newUsers = users.filter((user)=>{
              return user.socketId != this.socketService.socket?.id;
            });
            let grids : PlayersGrids = Parser.convertToPlayersGrid(newUsers);
            debugger;
            this.otherPlayersGrid.next(grids);
            break
          case SocketEventServerEnumerator.RECEIVED_DAMAGE:
            this.damage_received.next(Number.parseInt(event.value));
            break
          case SocketEventServerEnumerator.IN_MATCH_PLAYERS:
            this.in_match_players.next(Number.parseInt(event.value));
            break
          default:
            break
        }
      }
    }
    catch(err){
      console.error(`Erro lidando com mensagem do servidor: ${err}`);
    }

    // this.socketVars[this.enums[event.key]] = event.value
  }

  setGridUpdate(grid : Array<TetrisGridPiece>){
    this.socketService.socketMsg(SocketEventClientEnumerator.GRID_UPDATE,grid)
  }
}
