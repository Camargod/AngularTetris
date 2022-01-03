import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { UiStateControllerService, UiStatesEnum } from '../../ui-state-controller/ui-state-controller.service';
import { AuthService } from '@auth0/auth0-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ui-home',
  templateUrl: './ui-home.component.html',
  styleUrls: ['./ui-home.component.scss']
})
export class UiHomeComponent implements OnInit, AfterViewInit, OnDestroy{
  isAuth : boolean = false;
  isAuthSubscription ?: Subscription;
  isLoadedSubscription ?: Subscription;
  constructor(private stateService : UiStateControllerService, public auth: AuthService) { }

  ngOnInit() {
    this.isLoadedSubscription = this.auth.isLoading$.subscribe((isLoaded)=>{
      if(isLoaded){
        this.isAuthSubscription = this.auth.isAuthenticated$.subscribe((auth)=>{
          this.isAuth = auth;
          if(this.isAuth){
            this.stateService.changeState(UiStatesEnum.MENU);
          }
        });
      }
    });

  }

  ngAfterViewInit(): void {

  }

  @HostListener("window:keyup",["$event"])
  start(event : Event){
    if(!this.isAuth){
      this.auth.loginWithRedirect();
    }
    this.stateService.changeState(UiStatesEnum.MENU);
  }

  ngOnDestroy(): void {
    this.isAuthSubscription?.unsubscribe();
    this.isAuthSubscription?.unsubscribe();
  }
}
