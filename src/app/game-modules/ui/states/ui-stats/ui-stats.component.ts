import { Component, OnInit } from '@angular/core';
import { UiStateControllerService, UiStatesEnum } from '../../ui-state-controller/ui-state-controller.service';

@Component({
  selector: 'app-ui-stats',
  templateUrl: './ui-stats.component.html',
  styleUrls: ['./ui-stats.component.scss']
})
export class UiStatsComponent implements OnInit {

  constructor(private uiState : UiStateControllerService) { }

  ngOnInit() {
  }

  back(){
    this.uiState.changeState(UiStatesEnum.MENU);
  }
}
