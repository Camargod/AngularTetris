import { Component, OnInit } from '@angular/core';
import { Themes, ThemeService } from 'src/app/theme-service';
import { UiStateControllerService, UiStatesEnum } from '../../ui-state-controller/ui-state-controller.service';

@Component({
  selector: 'ui-themes',
  templateUrl: './ui-themes.component.html',
  styleUrls: ['./ui-themes.component.scss']
})
export class UiThemesComponent implements OnInit {

  constructor(private themeService : ThemeService, private uiState : UiStateControllerService) { }

  themes = Themes;

  ngOnInit() {
  }

  scroll(event : WheelEvent){
    console.log(event);
    (event.target as HTMLDivElement).scrollLeft += event.deltaY;
  }

  selectTheme(theme : {name:string, fileName:string}){
    this.themeService.changeTheme(theme.fileName);
    this.uiState.changeState(UiStatesEnum.MENU);
  }
}
