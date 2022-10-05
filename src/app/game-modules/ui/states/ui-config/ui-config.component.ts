import { Component, OnInit } from '@angular/core';
import { UiStateControllerService, UiStatesEnum } from '../../ui-state-controller/ui-state-controller.service';

@Component({
  selector: 'app-ui-config',
  templateUrl: './ui-config.component.html',
  styleUrls: ['./ui-config.component.scss']
})
export class UiConfigComponent implements OnInit {

  constructor(private uiState : UiStateControllerService) { }

  ngOnInit() {
  }

  back(){
    this.uiState.changeState(UiStatesEnum.MENU);
  }
}
