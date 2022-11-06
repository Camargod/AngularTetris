export class Card {
  name !: String;
  image !: String;
  description !: String;
  identifier !: String;
  duration ?: number;
  durationType ?: "turns" | "seconds";
  timeout ?: any;
  turnCount ?: number = -1;
}
