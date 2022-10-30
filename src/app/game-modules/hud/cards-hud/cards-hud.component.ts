import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Cards } from '../../objects/cards';

@Component({
  selector: 'cards-hud',
  templateUrl: './cards-hud.component.html',
  styleUrls: ['./cards-hud.component.scss']
})
export class CardsHudComponent implements OnInit {

  cardsMock : Array<Cards> = [
    {
      "name": "Double damage",
      "image": "/assets/cards/fortify.png",
      "description": "Aumenta o dano por 3 rodadas"
    },
    {
      "name": "Freeze",
      "image": "/assets/cards/freeze.png",
      "description": "Congela seu tabuleiro (Tome um arzinho)"
    },
    {
      "name": "Speedup",
      "image": "/assets/cards/speedup.png",
      "description": "Aumenta temporariamente a velocidade do adversario."
    }
  ];

  keys : any = {
    "Enter": this.onKeyEnter,
    "-": this.changeOrder
  }

  constructor() { }

  ngOnInit() {
  }

  @HostListener("window:keydown", ['$event'])
  handleKeys(event: KeyboardEvent){
    if(event.key && this.keys[event.key]) (this.keys[event.key] as Function).bind(this)();
  }

  onKeyEnter(){
    let cardToBeUsed = this.cardsMock.shift();
    console.log(cardToBeUsed);
  }

  changeOrder(){
    let changedCard = this.cardsMock.shift();
    if(changedCard != undefined) this.cardsMock.push(changedCard);
  }

}
