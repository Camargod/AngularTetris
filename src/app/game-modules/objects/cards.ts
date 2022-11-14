export class Card {
  name !: string;
  image !: string;
  description !: string;
  identifier !: string;
  duration ?: number;
  durationType ?: "turns" | "seconds";
  timeout ?: any;
  turnLimit ?: number = -1;
  applySelf = false;
}

export const cards : Array<Card> = [
  {
    "name": "cards.double_damage.name",
    "image": `/fortify.png`,
    "description": "cards.double_damage.description",
    "identifier": "DOUBLE_DAMAGE",
    "durationType": "turns",
    "duration": 3,
    "applySelf": true
  },
  {
    "name": "cards.freeze.name",
    "image": `/freeze.png`,
    "description": "cards.freeze.description",
    "identifier": "FREEZE",
    "durationType": "seconds",
    "duration": 5000,
    "applySelf": true
  },
  {
    "name": "cards.speedup.name",
    "image": `/speedup.png`,
    "description": "cards.speedup.description",
    "identifier": "SPEEDUP",
    "durationType": "turns",
    "duration": 3,
    "applySelf": false

  },
  {
    "name": "cards.inverse_commands.name",
    "image": `/inversion.png`,
    "description": "cards.inverse_commands.description",
    "identifier": "INVERSE_COMMANDS",
    "durationType": "turns",
    "duration": 3,
    "applySelf": false
  }
]
