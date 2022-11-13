import { Component, OnInit } from '@angular/core';
import { LastMatchService } from 'src/app/game-modules/services/last-match/last-match.service';
import { UiStateControllerService, UiStatesEnum } from '../../ui-state-controller/ui-state-controller.service';

@Component({
  selector: 'ui-gameover',
  templateUrl: './ui-gameover.component.html',
  styleUrls: ['./ui-gameover.component.scss']
})
export class UiGameoverComponent implements OnInit {

  constructor(private uiState : UiStateControllerService, public lastMatch : LastMatchService) { }

  ngOnInit() {
  }

  back(){
    this.uiState.changeState(UiStatesEnum.MENU);
  }

}
