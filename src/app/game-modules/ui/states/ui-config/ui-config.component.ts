import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UiStateControllerService, UiStatesEnum } from '../../ui-state-controller/ui-state-controller.service';


@Component({
  selector: 'app-ui-config',
  templateUrl: './ui-config.component.html',
  styleUrls: ['./ui-config.component.scss']

})
export class UiConfigComponent implements OnInit {

  languages = [
    { code: 'en', label: 'English' },
    { code: 'pt-br', label: 'Português' }
  ];

  constructor(private uiState : UiStateControllerService, private translate : TranslateService) { }

  ngOnInit() {
  }

  changeLanguage(language : any){
    localStorage.setItem('language',language.target.value);
    this.translate.setDefaultLang(language.target.value);
  }

  back(){
    this.uiState.changeState(UiStatesEnum.MENU);
  }
}
