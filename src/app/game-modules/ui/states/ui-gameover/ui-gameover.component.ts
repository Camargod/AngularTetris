import { Component, OnDestroy, OnInit } from '@angular/core';
import { LastMatchService } from 'src/app/game-modules/services/last-match/last-match.service';
import { MatchVariablesService } from 'src/app/game-modules/services/match-variables/match-variables.service';
import { SoundClassService } from 'src/app/game-modules/services/sounds/sound-service';
import { UiStateControllerService, UiStatesEnum } from '../../ui-state-controller/ui-state-controller.service';

@Component({
  selector: 'ui-gameover',
  templateUrl: './ui-gameover.component.html',
  styleUrls: ['./ui-gameover.component.scss']
})
export class UiGameoverComponent implements OnInit, OnDestroy {
  won = false;
  _wonSubscription = this.matchVariables.won.subscribe((won)=>{
    this.won = won;
  });

  constructor(private uiState : UiStateControllerService, public lastMatch : LastMatchService, private audioService : SoundClassService, private matchVariables : MatchVariablesService) { }
  ngOnDestroy(): void {
    this._wonSubscription.unsubscribe();
    this.lastMatch.resetLastMatch();
    this.matchVariables.won.next(false);
    this.matchVariables.timer.next(9999);
  }

  ngOnInit() {
    this.audioService.stopMainAudio();
  }

  back(){
    this.uiState.changeState(UiStatesEnum.MENU);
  }
}
