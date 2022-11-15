import { Component, OnInit } from '@angular/core';
import { UiStateControllerService, UiStatesEnum } from '../../ui-state-controller/ui-state-controller.service';

@Component({
  selector: 'app-ui-credits',
  templateUrl: './ui-credits.component.html',
  styleUrls: ['./ui-credits.component.scss']
})
export class UiCreditsComponent implements OnInit {

  constructor(private uiState : UiStateControllerService) { }

  ngOnInit() {
  }

  back(){
    this.uiState.changeState(UiStatesEnum.MENU);
  }
}
