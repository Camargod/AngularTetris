import { Component, OnInit } from '@angular/core';
import { UiStateControllerService, UiStatesEnum } from '../../ui-state-controller/ui-state-controller.service';
import { AuthService, User } from '@auth0/auth0-angular';
import { UserService } from 'src/app/game-modules/services/user/user.service';
import { ThemeService } from 'src/app/game-modules/services/themes/theme-service';
import { faCircleInfo, faListSquares } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ui-menu',
  templateUrl: './ui-menu.component.html',
  styleUrls: ['./ui-menu.component.scss']
})
export class UiMenuComponent implements OnInit {

  playEnabled = false;

  faCircleInfo = faCircleInfo;
  faSquareList = faListSquares;

  constructor(private stateController : UiStateControllerService, private auth : AuthService, private themeService : ThemeService) { }

  menuItems : Array<MenuItem> = [
    {label:"menu.play",state:UiStatesEnum.TIMER,backgroundColor:"#ff7403",background:"/assets/ui/menu/PlayIcon.png"/*background:"https://scontent.fcgh3-1.fna.fbcdn.net/v/t1.6435-9/70414585_374489033241716_3048322032967090176_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=8bfeb9&_nc_eui2=AeHtEIpy9oEok9GYhdRv8aZJ3yCfF8B5QvvfIJ8XwHlC-8K52FVGW_LAsDh--HpFERKm-g7mmUDQeyK5KAb6xLHm&_nc_ohc=efSfKsK7kakAX-5oGdM&_nc_ht=scontent.fcgh3-1.fna&oh=00_AT8Ij4Y-BflCgtTQ4GtPaeBnoU6YZ5cs08W_0PhaRhG7Ig&oe=61EF84CF"*/},
    {label:"menu.themes",state: UiStatesEnum.THEMES,background:"/assets/ui/menu/Themes.png"},
    {label:"menu.stats",state:UiStatesEnum.STATS,background:"assets/ui/menu/Stats.png"},
    {label:"menu.config",state:UiStatesEnum.CONFIG,background:"assets/ui/menu/Config.png"}
  ]

  user ?: User | undefined | null;

  ngOnInit() {
    this.themeService.selectedThemeChanged.subscribe((enabled)=>{
      console.log(`Tema carregado: ${enabled}`);
      this.playEnabled = enabled;
    })
    this.auth.user$.subscribe((user)=>{
      this.user = user
    })
    this.validateSelectedTheme();
  }

  selectOption(item : MenuItem){
//    if(!item.enabled) return;
    if(item.state)this.stateController.changeState(item.state!);
    if(item.doFunction)item.doFunction();
  }

  validateSelectedTheme(){
    this.themeService.setDefaultTheme();
  }

  openCredits(){
    this.stateController.changeState(UiStatesEnum.CREDITS);
  }
  openAbout(){
    this.stateController.changeState(UiStatesEnum.ABOUT);
  }

}

export class MenuItem{
  label!: string;
  state?: string;
  background!: string;
  doFunction?: Function;
  backgroundColor ?: string;
  enabled ?: boolean = true;
}
