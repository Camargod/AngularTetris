import { Component, HostListener, OnInit } from '@angular/core';
import { UiStateControllerService, UiStatesEnum } from '../../ui-state-controller/ui-state-controller.service';

@Component({
  selector: 'app-ui-home',
  templateUrl: './ui-home.component.html',
  styleUrls: ['./ui-home.component.scss']
})
export class UiHomeComponent implements OnInit{

  constructor(private stateService : UiStateControllerService) { }

  ngOnInit() {
  }

  @HostListener("window:keyup",["$event"])
  start(event : Event){
    this.stateService.changeState(UiStatesEnum.MENU);
  }
}
