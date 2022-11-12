import { Component, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UiCloseComponent } from '../states/ui-close/ui-close.component';
import { UiConfigComponent } from '../states/ui-config/ui-config.component';
import { UiGameViewComponent } from '../states/ui-game-view/ui-game-view.component';
import { UiGameoverComponent } from '../states/ui-gameover/ui-gameover.component';
import { UiHomeComponent } from '../states/ui-home/ui-home.component';
import { UiMenuComponent } from '../states/ui-menu/ui-menu.component';
import { UiStatsComponent } from '../states/ui-stats/ui-stats.component';
import { UiThemesComponent } from '../states/ui-themes/ui-themes.component';
import { UiTimerComponent } from '../states/ui-timer/ui-timer.component';

@Injectable({
  providedIn: 'root'
})
export class UiStateControllerService {
  _page : BehaviorSubject<{name:string, component:any}> = new BehaviorSubject(UiStates[0]);
  _uiVisible = new BehaviorSubject(true);
  _gameStart = new BehaviorSubject(true);

  constructor() { }

  changeState(stateName : string){
    let state = UiStates.find((state)=>{
      return state.name == stateName;
    })
    if(state){
      this._page.next(state);
    }else{
      console.log(`State ${stateName} does not exists`);
    }
  }

  toggleUi(){
    this._uiVisible.next(true);
  }

  hideUi(){
    this._uiVisible.next(false);
  }

  startGame(){
    this.changeState(UiStatesEnum.GAME);
    this._gameStart.next(false);
  }
}

const UiStates = [
  {name:"home", component:UiHomeComponent},
  {name:"timer", component:UiTimerComponent},
  {name:"menu", component:UiMenuComponent},
  {name:"closeState", component: UiCloseComponent},
  {name:"themes", component:UiThemesComponent},
  {name:"config", component:UiConfigComponent},
  {name:"stats", component:UiStatsComponent},
  {name:"game_over", component:UiGameoverComponent},
  {name:"game", component:UiGameViewComponent},
]
export const UiStatesEnum = {
  "HOME":"home",
  "TIMER": "timer",
  "MENU": "menu",
  "CLOSE": "closeState",
  "THEMES": "themes",
  "CONFIG": "config",
  "STATS": "stats",
  "GAME_OVER": "game_over",
  "GAME": "game",
}
