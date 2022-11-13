import { Component, Input, OnInit } from '@angular/core';
import { TetrisGameComponent } from '../../game-view/tetris-game/tetris-game.component';
import { MatchVariablesService } from '../../services/match-variables/match-variables.service';

@Component({
  selector: 'info-hud',
  templateUrl: './info-hud.component.html',
  styleUrls: ['./info-hud.component.scss']
})
export class InfoHudComponent implements OnInit {

  @Input() game !: TetrisGameComponent;

  constructor(public matchVariablesService : MatchVariablesService) { }

  ngOnInit() {
  }

}
