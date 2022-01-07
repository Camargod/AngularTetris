import { Component, OnInit } from '@angular/core';
import { UiStateControllerService, UiStatesEnum } from '../../ui-state-controller/ui-state-controller.service';
import { AuthService, User } from '@auth0/auth0-angular';
import { UserService } from 'src/app/game-modules/user/user.service';

@Component({
  selector: 'app-ui-menu',
  templateUrl: './ui-menu.component.html',
  styleUrls: ['./ui-menu.component.scss']
})
export class UiMenuComponent implements OnInit {

  constructor(private stateController : UiStateControllerService, private auth : AuthService, private userService : UserService) { }

  menuItems : Array<MenuItem> = [
    {label:"Play",state:UiStatesEnum.TIMER,background:"https://scontent.fcgh3-1.fna.fbcdn.net/v/t1.6435-9/70414585_374489033241716_3048322032967090176_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=8bfeb9&_nc_eui2=AeHtEIpy9oEok9GYhdRv8aZJ3yCfF8B5QvvfIJ8XwHlC-8K52FVGW_LAsDh--HpFERKm-g7mmUDQeyK5KAb6xLHm&_nc_ohc=efSfKsK7kakAX-5oGdM&_nc_ht=scontent.fcgh3-1.fna&oh=00_AT8Ij4Y-BflCgtTQ4GtPaeBnoU6YZ5cs08W_0PhaRhG7Ig&oe=61EF84CF"},
    {label:"Themes",background:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fmobile.twitter.com%2Fthekidbengala&psig=AOvVaw3QMRALWPnwvc2vxJMsk_qa&ust=1640647321763000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCNjoqtvNgvUCFQAAAAAdAAAAABAI"},
    {label:"Stats",background:"assets/ui/"},
    {label:"Config",background:"assets/ui/"}
  ]

  user ?: User | undefined | null;

  ngOnInit() {
    this.auth.user$.subscribe((user)=>{
      this.user = user
    })
  }

  selectOption(item : MenuItem){
    if(item.state)this.stateController.changeState(item.state!);
    if(item.doFunction)item.doFunction();
  }
}

export class MenuItem{
  label!: string;
  state?: string;
  background!: string;
  doFunction?: Function;
}
