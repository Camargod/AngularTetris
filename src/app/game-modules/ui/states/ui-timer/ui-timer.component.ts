import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatchVariablesService } from 'src/app/game-modules/match-variables/match-variables.service';
import { SocketService } from 'src/app/game-modules/socket/socket.service';
import { UserService } from 'src/app/game-modules/user/user.service';
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
  isConnectedSubscription ?: Subscription;
  constructor(private matchVariables : MatchVariablesService, private uiState : UiStateControllerService, private userService : UserService, private socketService : SocketService) { }

  ngOnInit() {
    this.matchVariables.startGameListening();
    this.timerSubscription = this.matchVariables.timer.subscribe((time)=>{
      this.timer = time;
      if(time == 0){
        this.uiState.hideUi();
      }
    })
    this.playerSubscription = this.matchVariables.in_match_players.subscribe((playersNumber)=> {
      this.players = playersNumber;
    })
    this.isConnectedSubscription = this.socketService.isConnected.subscribe((isConnected)=>{
      if(isConnected){
        this.userService.authenticate();
      }
    })
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
    this.playerSubscription?.unsubscribe();
    this.isConnectedSubscription?.unsubscribe();
  }
}
