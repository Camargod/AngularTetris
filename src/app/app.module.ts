import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimerComponent } from './game-modules/timer/timer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EnemiesViewComponent } from './game-modules/view/enemies-view/enemies-view.component';
import { SingleViewComponent } from './game-modules/view/enemies-view/single-view/single-view.component';

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    EnemiesViewComponent,
    SingleViewComponent
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
