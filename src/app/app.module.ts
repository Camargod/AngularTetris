import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimerComponent } from './game-modules/timer/timer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EnemiesViewComponent } from './game-modules/view/enemies-view/enemies-view.component';
import { SingleViewComponent } from './game-modules/view/enemies-view/single-view/single-view.component';
import { UiStateControllerComponent } from './game-modules/ui/ui-state-controller/ui-state-controller.component';
import { UiHomeComponent } from './game-modules/ui/states/ui-home/ui-home.component';
import { UiTimerComponent } from './game-modules/ui/states/ui-timer/ui-timer.component';
import { UiMenuComponent } from './game-modules/ui/states/ui-menu/ui-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    EnemiesViewComponent,
    SingleViewComponent,
    UiStateControllerComponent,
    UiTimerComponent,
    UiHomeComponent,
    UiMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
