export class Card {
  name !: String;
  image !: String;
  description !: String;
  identifier !: string;
  duration ?: number;
  durationType ?: "turns" | "seconds";
  timeout ?: any;
  turnLimit ?: number = -1;
}

export const cards : Array<Card> = [
  {
    "name": "Double damage",
    "image": "/assets/cards/fortify.png",
    "description": "Aumenta o dano por 3 rodadas",
    "identifier": "DOUBLE_DAMAGE",
    "durationType": "turns",
    "duration": 3
  },
  {
    "name": "Freeze",
    "image": "/assets/cards/freeze.png",
    "description": "Congela seu tabuleiro (Tome um arzinho)",
    "identifier": "FREEZE",
    "durationType": "seconds",
    "duration": 5000,
  },
  {
    "name": "Speedup",
    "image": "/assets/cards/speedup.png",
    "description": "Aumenta temporariamente a velocidade do adversario.",
    "identifier": "SPEEDUP",
    "durationType": "turns",
    "duration": 3
  },
  {
    "name": "Inverse Commands",
    "image": "/assets/cards/inversion.png",
    "description": "Inverte os comandos do adversario por 3 rodadas",
    "identifier": "INVERSE_COMMANDS",
    "durationType": "turns",
    "duration": 3
  }
]
