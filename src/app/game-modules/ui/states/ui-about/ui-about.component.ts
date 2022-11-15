import { Component, OnInit } from '@angular/core';
import { UiStateControllerService, UiStatesEnum } from '../../ui-state-controller/ui-state-controller.service';

@Component({
  selector: 'app-ui-about',
  templateUrl: './ui-about.component.html',
  styleUrls: ['./ui-about.component.scss']
})
export class UiAboutComponent implements OnInit {

  constructor(private uiState : UiStateControllerService) { }

  ngOnInit() {
  }

  back(){
    this.uiState.changeState(UiStatesEnum.MENU);
  }
}
