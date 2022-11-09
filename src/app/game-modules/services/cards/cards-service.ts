import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { SocketEventClientEnumerator } from "../../enums/socket-event.enum";
import { Card } from "../../objects/cards";
import { MatchVariablesService } from "../match-variables/match-variables.service";
import { SocketService } from "../socket/socket.service";

@Injectable({providedIn:"root"})
export class CardsService {

  cardsMechanics : any = {
    "DOUBLE_DAMAGE":this.doubleDamage.bind(this),
    "FREEZE": this.freeze.bind(this),
    "SPEED_UP": this.speedUp.bind(this),
    "REVERSE_COMMANDS": this.reverseCommands.bind(this)
  }

  cardsReverseMechanics : any = {
    "DOUBLE_DAMAGE":this.resetDamageMultiplier.bind(this),
    "FREEZE": this.unfrozen.bind(this),
    "SPEED_UP": this.resetSpeedMultiplier.bind(this),
    "REVERSE_COMMANDS": this.resetInversedCommands.bind(this)
  }

  public isFrozen = new BehaviorSubject(false);
  public turns = new BehaviorSubject(0);

  speedMultiplier = 1;
  inversedCommands = false;
  damageMultiplier = 1;

  activeEffects : Map<String,Card> = new Map();

  constructor(private socketService : SocketService) {}

  sendCard(card : Card){
    this.socketService.socketMsg(SocketEventClientEnumerator.SEND_CARD, card);
  }

  receiveCardFromEnemy(card : Card){
    this.activeEffects.set(card.identifier,card);
    this.applyCard(card);
  }

  drawCard(){
    // this.socketService.socketMsg(SocketEventClientEnumerator.GET_CARD,"");
  }

  applyCard(card : Card){
    if(this.cardsMechanics[card.identifier]){
      this.cardsMechanics[card.identifier]();

      if(this.activeEffects.get(card.identifier)){

      } else {
        this.activeEffects.set(card.identifier,card);
        this.createTiming(card);
      }
    }
  }

  createTiming(card : Card){
    if(card.durationType == "seconds"){
      const timeout = setTimeout(()=>{
        this.activeEffects.delete(card.identifier);
        this.cardsReverseMechanics[card.identifier]();
      },card.duration)
      this.activeEffects.get(card.identifier)!.timeout = timeout;
    } else if(card.durationType == "turns"){
      let selectedCard = this.activeEffects.get(card.identifier)!;
      selectedCard!.duration = this.turns.value + card.duration!;
      const subs = this.turns.subscribe((turns)=>{
        if(turns == selectedCard!.duration){
          this.activeEffects.delete(card.identifier);
          this.cardsReverseMechanics[card.identifier]();
          subs.unsubscribe();
        }
      });
    }
  }

  private doubleDamage(){
    this.damageMultiplier = 2;
  }

  private freeze(){
    this.isFrozen.next(true);
  }

  private speedUp(){
    this.speedMultiplier = 2;
  }

  private reverseCommands(){
    this.inversedCommands = true;
  }

  private resetDamageMultiplier(){
    this.damageMultiplier = 1;
  }

  private resetSpeedMultiplier(){
    this.speedMultiplier = 1;
  }

  private unfrozen(){
    this.isFrozen.next(false);
  }

  private resetInversedCommands(){
    this.inversedCommands = false;
  }
}

