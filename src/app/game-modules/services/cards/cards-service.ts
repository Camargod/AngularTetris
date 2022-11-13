import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { SocketEventClientEnumerator } from "../../enums/socket-event.enum";
import { Card } from "../../objects/cards";
import { SocketService } from "../socket/socket.service";

@Injectable({providedIn:"root"})
export class CardsService {

  cardsMechanics : any = {
    "DOUBLE_DAMAGE":this.doubleDamage.bind(this),
    "FREEZE": this.freeze.bind(this),
    "SPEEDUP": this.speedUp.bind(this),
    "INVERSE_COMMANDS": this.reverseCommands.bind(this),
  }

  cardsReverseMechanics : any = {
    "DOUBLE_DAMAGE":this.resetDamageMultiplier.bind(this),
    "FREEZE": this.unfrozen.bind(this),
    "SPEEDUP": this.resetSpeedMultiplier.bind(this),
    "INVERSE_COMMANDS": this.resetInversedCommands.bind(this)
  }

  public isFrozen = new BehaviorSubject(false);
  public turns = new BehaviorSubject(0);

  public speedMultiplier = 1;
  public inversedCommands = false;
  public damageMultiplier = 1;

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
      selectedCard!.turnLimit = this.turns.value + card.duration!;
      const subs = this.turns.subscribe((turns)=>{
        if(turns == selectedCard!.turnLimit){
          this.activeEffects.delete(card.identifier);
          this.cardsReverseMechanics[card.identifier]();
          subs.unsubscribe();
        }
      });
    }
  }

  resetEffects(){
    this.activeEffects.forEach((card)=>{
      this.cardsReverseMechanics[card.identifier]();
    })
    this.activeEffects.clear();
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

