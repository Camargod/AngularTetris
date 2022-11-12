import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AuthModule } from '@auth0/auth0-angular';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { EnemiesViewComponent } from './game-modules/hud/enemies-view/enemies-view.component';
import { SingleViewComponent } from './game-modules/hud/enemies-view/single-view/single-view.component';
import { UiStateControllerComponent } from './game-modules/ui/ui-state-controller/ui-state-controller.component';
import { UiHomeComponent } from './game-modules/ui/states/ui-home/ui-home.component';
import { UiTimerComponent } from './game-modules/ui/states/ui-timer/ui-timer.component';
import { UiMenuComponent } from './game-modules/ui/states/ui-menu/ui-menu.component';
import { UiThemesComponent } from './game-modules/ui/states/ui-themes/ui-themes.component';
import { CardsHudComponent } from './game-modules/hud/cards-hud/cards-hud.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AttackModesComponent } from './game-modules/hud/attack-modes/attack-modes.component';
import { TetrisGameComponent } from './game-modules/game-view/tetris-game/tetris-game.component';
import { UiGameViewComponent } from './game-modules/ui/states/ui-game-view/ui-game-view.component';
import { InfoHudComponent } from './game-modules/hud/info-hud/info-hud.component';
import { NgChartsModule } from 'ng2-charts';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/translation/', '.json');
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/translation/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    EnemiesViewComponent,
    SingleViewComponent,
    UiStateControllerComponent,
    UiTimerComponent,
    UiHomeComponent,
    UiMenuComponent,
    UiThemesComponent,
    CardsHudComponent,
    AttackModesComponent,
    TetrisGameComponent,
    UiGameViewComponent,
    InfoHudComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AuthModule.forRoot({
      domain: 'tetrisverse.us.auth0.com',
      clientId: 'BCeKlUlczhTXiT7gVoD4iLzoikwOolnJ'
    }),
    TranslateModule.forRoot(
      {
        defaultLanguage: 'pt-br',
        loader:{
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }
    ),
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
