import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UiStateControllerService } from './ui-state-controller.service';

@Component({
  selector: 'ui-state-controller',
  templateUrl: './ui-state-controller.component.html',
  styleUrls: ['./ui-state-controller.component.scss']
})
export class UiStateControllerComponent implements OnInit, OnDestroy {

  constructor(private stateController : UiStateControllerService) { }
  selectedPage ?: {name:string,component:any};
  isEnabled = true;
  private pageSubscription ?: Subscription;
  private enabledSubscription ?: Subscription;
  ngOnInit() {
    this.pageSubscription = this.stateController._page.subscribe((page)=>{
      this.selectedPage = page;
    })
    this.enabledSubscription = this.stateController._uiVisible.subscribe((visibility)=>{
      this.isEnabled = visibility;
    })
  }
  ngOnDestroy(): void {
    this.pageSubscription?.unsubscribe();
  }

}
