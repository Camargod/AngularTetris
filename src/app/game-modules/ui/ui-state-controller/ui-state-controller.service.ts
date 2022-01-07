import { Component, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UiCloseComponent } from '../states/ui-close/ui-close.component';
import { UiHomeComponent } from '../states/ui-home/ui-home.component';
import { UiMenuComponent } from '../states/ui-menu/ui-menu.component';
import { UiTimerComponent } from '../states/ui-timer/ui-timer.component';

@Injectable({
  providedIn: 'root'
})
export class UiStateControllerService {
  _page : BehaviorSubject<{name:string, component:any}> = new BehaviorSubject(UiStates[0]);
  _uiVisible = new BehaviorSubject(true);


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
    this._uiVisible.next(!this._uiVisible.value);
  }

  hideUi(){
    this._uiVisible.next(false);
  }
}

export const UiStates = [
  {name:"home", component:UiHomeComponent},
  {name:"timer", component:UiTimerComponent},
  {name:"menu", component:UiMenuComponent},
  {name:"closeState", component: UiCloseComponent}
]
export const UiStatesEnum = {
  "HOME":"home",
  "TIMER": "timer",
  "MENU": "menu",
  "CLOSE": "closeState"
}