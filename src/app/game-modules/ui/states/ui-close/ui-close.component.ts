import { Component, OnInit } from '@angular/core';
import { UiStateControllerService } from '../../ui-state-controller/ui-state-controller.service';

@Component({
  selector: 'app-ui-close',
  styleUrls: ['./ui-close.component.scss'],
  template:""
})
export class UiCloseComponent implements OnInit {

  constructor(private stateController : UiStateControllerService) { }

  ngOnInit() {
    this.stateController.toggleUi();
  }

}
