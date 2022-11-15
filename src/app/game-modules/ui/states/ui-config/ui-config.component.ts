import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UiStateControllerService, UiStatesEnum } from '../../ui-state-controller/ui-state-controller.service';


@Component({
  selector: 'app-ui-config',
  templateUrl: './ui-config.component.html',
  styleUrls: ['./ui-config.component.scss']

})
export class UiConfigComponent implements OnInit, AfterViewInit {

  @ViewChild('select',{static:false}) select !: ElementRef<HTMLSelectElement>;

  languages = [
    { code: 'en', label: 'English' },
    { code: 'pt-br', label: 'Português' }
  ];

  selectedLanguageIndex : number = 0;

  constructor(private uiState : UiStateControllerService, private translate : TranslateService) { }
  ngAfterViewInit(): void {
    this.select.nativeElement.selectedIndex = this.languages.findIndex((language) => language.code === localStorage.getItem('language'));

  }

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
