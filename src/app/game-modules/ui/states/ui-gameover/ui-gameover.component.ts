import { Component, OnInit } from '@angular/core';
import { UiStateControllerService, UiStatesEnum } from '../../ui-state-controller/ui-state-controller.service';

@Component({
  selector: 'ui-gameover',
  templateUrl: './ui-gameover.component.html',
  styleUrls: ['./ui-gameover.component.scss']
})
export class UiGameoverComponent implements OnInit {

  constructor(private uiState : UiStateControllerService) { }

  ngOnInit() {
  }

  back(){
    this.uiState.changeState(UiStatesEnum.MENU);
  }

}
