import { Injectable } from "@angular/core";
import { SocketEventClientEnumerator } from "../../enums/socket-event.enum";
import { Card } from "../../objects/cards";
import { SocketService } from "../socket/socket.service";

@Injectable({providedIn:"root"})
export class CardsService {

  speedMultiplier = 1;
  inversedCommands = false;
  damageMultiplier = 1;

  activeEffects : Array<Card> = [];

  constructor(private socketService : SocketService) {}

  sendCard(card : Card){
    this.socketService.socketMsg(SocketEventClientEnumerator.SEND_CARD, card);
  }

  receiveCardFromEnemy(card : Card){
    this.activeEffects.push(card);
    this.applyCard(card);
  }

  drawCard(){
    this.socketService.socketMsg(SocketEventClientEnumerator.GET_CARD,"");
  }

  applyCard(card : Card){


  }
}

export const cards : Array<Card> = [
  {
    "name": "Double damage",
    "image": "/assets/cards/fortify.png",
    "description": "Aumenta o dano por 3 rodadas",
    "identifier": "DOUBLE_DAMAGE",

  },
  {
    "name": "Freeze",
    "image": "/assets/cards/freeze.png",
    "description": "Congela seu tabuleiro (Tome um arzinho)",
    "identifier": "FREEZE"
  },
  {
    "name": "Speedup",
    "image": "/assets/cards/speedup.png",
    "description": "Aumenta temporariamente a velocidade do adversario.",
    "identifier": "SPEEDUP"
  }
]
