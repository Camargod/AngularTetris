import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SocketEventClientEnumerator, SocketEventServerEnumerator } from 'src/app/game-modules/enums/socket-event.enum';
import { PlayersGrids } from '../../objects/players-grids';
import { User } from '../../objects/server/user';
import { TetrisGridPiece } from '../../objects/tetris-grid-piece';
import { SocketService } from '../socket/socket.service';
import { Parser } from '../../utils/parser';
import { Card } from '../../objects/cards';
import { CardsService } from '../cards/cards-service';

@Injectable({
  providedIn: 'root'
})
export class MatchVariablesService {

constructor(
  private socketService : SocketService,
  private cardsService : CardsService
) { }
  public timer = new BehaviorSubject<number>(9999);
  public game_start = new BehaviorSubject<boolean>(false);
  public damage_received = new BehaviorSubject<number>(0);
  public in_match_players = new BehaviorSubject<number>(0);
  public otherPlayersGrid = new BehaviorSubject<PlayersGrids>({});
  public match_speed = new BehaviorSubject<number>(500);
  public isSingleplayer = new BehaviorSubject(false);
  public nextPieces = new BehaviorSubject([]);
  public receivedCardFromEnemy = new BehaviorSubject<Card>({} as Card);
  private socketSubscription ?: Subscription;

  startGameListening(){
    this.socketService.isSingleplayer = false;
    this.socketService.socketConnect();
    this.socketSubscription = this.socketService._eventBehavior.subscribe((message)=>{
      this.socketMessageHandler(message);
    })
  }

  stopGameListening(){
    this.isSingleplayer.next(true);
    this.socketService.socketDisconnect();
    this.socketSubscription?.unsubscribe();
    this.socketService.isSingleplayer = true;
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
            this.otherPlayersGrid.next(grids);
            break
          case SocketEventServerEnumerator.RECEIVED_DAMAGE:
            this.damage_received.next(Number.parseInt(event.value));
            break
          case SocketEventServerEnumerator.IN_MATCH_PLAYERS:
            this.in_match_players.next(Number.parseInt(event.value));
            break
          case SocketEventServerEnumerator.CONNECTION_READY:
            this.socketService.isConnected.next(true);
            break;
          case SocketEventServerEnumerator.MATCH_SPEEDUP:
            this.match_speed.next(Number.parseInt(event.value));
            break;
          case SocketEventServerEnumerator.RECEIVE_PIECES_QUEUE:
            this.nextPieces.next(event.value);
            break;
          case SocketEventServerEnumerator.RECEIVE_CARD_FROM_ENEMY:
            this.cardsService.applyCard(event.value as Card);
            break;
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
  setGameOver(value : boolean){
    this.socketService.socketMsg(SocketEventClientEnumerator.GAME_OVER,value);
  }
  setEnemyAttack(damage : Number){
    if(damage > 0) this.socketService.socketMsg(SocketEventClientEnumerator.SEND_DAMAGE,Number.parseInt(damage.toString()));
  }
  setAttackMode(mode : String){
    this.socketService.socketMsg(SocketEventClientEnumerator.GET_ENEMIES_FOCUS,mode);
  }
}