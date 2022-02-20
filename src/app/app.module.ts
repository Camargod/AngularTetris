import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AuthModule } from '@auth0/auth0-angular';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { EnemiesViewComponent } from './game-modules/view/enemies-view/enemies-view.component';
import { SingleViewComponent } from './game-modules/view/enemies-view/single-view/single-view.component';
import { UiStateControllerComponent } from './game-modules/ui/ui-state-controller/ui-state-controller.component';
import { UiHomeComponent } from './game-modules/ui/states/ui-home/ui-home.component';
import { UiTimerComponent } from './game-modules/ui/states/ui-timer/ui-timer.component';
import { UiMenuComponent } from './game-modules/ui/states/ui-menu/ui-menu.component';
import { UiThemesComponent } from './game-modules/ui/states/ui-themes/ui-themes.component';

@NgModule({
  declarations: [
    AppComponent,
    EnemiesViewComponent,
    SingleViewComponent,
    UiStateControllerComponent,
    UiTimerComponent,
    UiHomeComponent,
    UiMenuComponent,
    UiThemesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AuthModule.forRoot({
      domain: 'tetrisverse.us.auth0.com',
      clientId: 'BCeKlUlczhTXiT7gVoD4iLzoikwOolnJ'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
