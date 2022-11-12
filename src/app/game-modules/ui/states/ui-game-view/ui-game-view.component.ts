import { Component, OnInit, ViewChild } from '@angular/core';
import { EnemiesViewComponent } from 'src/app/game-modules/hud/enemies-view/enemies-view.component';

@Component({
  selector: 'app-ui-game-view',
  templateUrl: './ui-game-view.component.html',
  styleUrls: ['./ui-game-view.component.scss']
})
export class UiGameViewComponent implements OnInit {

  @ViewChild("viewsManager",{static:true}) views !: EnemiesViewComponent;


  constructor() { }

  ngOnInit() {
  }

}
