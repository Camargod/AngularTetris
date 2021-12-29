import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatchVariablesService } from 'src/app/game-modules/match-variables/match-variables.service';
import { UiStateControllerService } from '../../ui-state-controller/ui-state-controller.service';

@Component({
  selector: 'app-ui-timer',
  templateUrl: './ui-timer.component.html',
  styleUrls: ['./ui-timer.component.scss']
})
export class UiTimerComponent implements OnInit, OnDestroy {
  timer = 9999;
  timerSubscription ?: Subscription;
  players = 0;
  playerSubscription ?: Subscription;
  constructor(private matchVariables : MatchVariablesService, private uiState : UiStateControllerService) { }

  ngOnInit() {
    this.timerSubscription = this.matchVariables.timer.subscribe((time)=>{
      this.timer = time;
      if(time = 0){
        this.uiState.hideUi();
      }
    })
    this.playerSubscription = this.matchVariables.in_match_players.subscribe((playersNumber)=> {
      this.players = playersNumber;
    })
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }
}
