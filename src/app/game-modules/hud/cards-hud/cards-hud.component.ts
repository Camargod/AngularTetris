import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { SocketEventClientEnumerator } from '../../enums/socket-event.enum';
import { Card, cards } from '../../objects/cards';
import { CardsService } from '../../services/cards/cards-service';
import { LastMatchService } from '../../services/last-match/last-match.service';
import { MatchVariablesService } from '../../services/match-variables/match-variables.service';
import { SocketService } from '../../services/socket/socket.service';

@Component({
  selector: 'cards-hud',
  templateUrl: './cards-hud.component.html',
  styleUrls: ['./cards-hud.component.scss']
})
export class CardsHudComponent implements OnInit {

  cardsMock : Array<Card> = [
    // cards[0],
    // cards[1],
    // cards[3]
  ];
  localstorage = localStorage

  keys : any = {
    "Enter": this.onKeyEnter.bind(this),
    "-": this.changeOrder
  }

  constructor(private socketService : SocketService, private cardsService : CardsService, private matchVariablesService : MatchVariablesService, public lastMatch : LastMatchService) { }

  ngOnInit() {
    this.matchVariablesService.receivedCardFromEnemy.subscribe((card)=>{
      if(card.identifier && this.cardsMock.length < 3) this.cardsMock.push(card);
    });
  }

  @HostListener("window:keydown", ['$event'])
  handleKeys(event: KeyboardEvent){
    if(event.key && this.keys[event.key]) (this.keys[event.key] as Function).bind(this)();
  }

  onKeyEnter(){
    let cardToBeUsed = this.cardsMock.shift();
    if(cardToBeUsed){
      if(cardToBeUsed?.applySelf){
        this.cardsService.applyCard(cardToBeUsed!);
      }
      else{
        this.matchVariablesService.sendCard(cardToBeUsed);
      }
    }
  }

  changeOrder(){
    let changedCard = this.cardsMock.shift();
    if(changedCard != undefined) this.cardsMock.push(changedCard);
  }

}
