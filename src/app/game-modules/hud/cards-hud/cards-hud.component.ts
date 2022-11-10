import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { SocketEventClientEnumerator } from '../../enums/socket-event.enum';
import { Card, cards } from '../../objects/cards';
import { CardsService } from '../../services/cards/cards-service';
import { SocketService } from '../../services/socket/socket.service';

@Component({
  selector: 'cards-hud',
  templateUrl: './cards-hud.component.html',
  styleUrls: ['./cards-hud.component.scss']
})
export class CardsHudComponent implements OnInit {

  cardsMock : Array<Card> = [
    cards[0],
    cards[1],
    cards[3]
  ];

  keys : any = {
    "Enter": this.onKeyEnter.bind(this),
    "-": this.changeOrder
  }

  constructor(private socketService : SocketService, private cardsService : CardsService) { }

  ngOnInit() {
  }

  @HostListener("window:keydown", ['$event'])
  handleKeys(event: KeyboardEvent){
    if(event.key && this.keys[event.key]) (this.keys[event.key] as Function).bind(this)();
  }

  onKeyEnter(){
    let cardToBeUsed = this.cardsMock.shift();
    this.socketService.socketMsg(SocketEventClientEnumerator.SEND_CARD,cardToBeUsed);
    //POR FAVOR RETIRAR DEPOIS:
    this.cardsService.applyCard(cardToBeUsed!);
  }

  changeOrder(){
    let changedCard = this.cardsMock.shift();
    if(changedCard != undefined) this.cardsMock.push(changedCard);
  }

}
