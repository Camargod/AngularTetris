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
  paths : Array<String> = [];
  ngOnInit() {
    this.themes.forEach((t,i)=>{
      this.paths[i] = this.themeService.getBackgroundUrlThemeTile(t);
    })
  }

  scroll(event : WheelEvent){
    (event.target as HTMLDivElement).scrollLeft += event.deltaY;
  }

  selectTheme(theme : {name:string, fileName:string}){
    this.themeService.changeTheme(theme.fileName);
    this.back();
  }

  back(){
    this.uiState.changeState(UiStatesEnum.MENU);
  }
}
