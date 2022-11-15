import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LastMatchService {
  public lastMatch: MatchResult = new MatchResult();

  constructor() {}

  resetLastMatch(){
    this.lastMatch = new MatchResult();
  }
}

export class MatchResult {
  score : number = 0;
  lines : number = 0;
  speed : number = 0;
  rounds : number = 0;
  damage : number = 0;
  cards_used : number = 0;
  cards_received_from_enemy : number = 0;
  kos : number = 0;
  badges : number = 0;
  position : number = 0;
}
