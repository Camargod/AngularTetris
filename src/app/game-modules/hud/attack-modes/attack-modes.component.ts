import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatchVariablesService } from '../../services/match-variables/match-variables.service';

@Component({
  selector: 'attack-modes',
  templateUrl: './attack-modes.component.html',
  styleUrls: ['./attack-modes.component.scss']
})
export class AttackModesComponent implements OnInit, OnDestroy {

  isSingleplayer = true;

  _isSingleplayerSubscription : Subscription = this.matchVariables.isSingleplayer.subscribe((isSingleplayer)=>{
    this.isSingleplayer = isSingleplayer;
  });

  attackModes : Array<FocusButtonItem> = [
    {name:"KO",size:60, key:1,translateLabel: "play.modes.ko"},
    {name:"RANDOM",size:49, key:2, translateLabel: "play.modes.random"},
    {name:"",size:1,key:0,translateLabel: ""},
    {name:"BADGES",size:49, key:3, translateLabel: "play.modes.badges"},
    {name:"ATTACKERS",size:60, key:4, translateLabel: "play.modes.atk"},
  ];

  constructor(private matchVariables : MatchVariablesService) { }

  ngOnInit() {
  }

  @HostListener("window:keyup", ['$event'])
  handleFocusChange(event : KeyboardEvent){
    this.attackModes.find((mode)=> {
      if(mode.key.toString() == event.key.toString()){
        this.matchVariables.setAttackMode(mode.name);
        console.log(mode);
        this.attackModes.forEach(previousModes => previousModes.isEnabled = false);
        mode.isEnabled = true;
        return true;
      }
      return false;
    })
  }

  ngOnDestroy(): void {
    this._isSingleplayerSubscription.unsubscribe();
  }
}

class FocusButtonItem {
  name!: string;
  size!: number;
  key!: number;
  isEnabled ?: boolean = false;
  translateLabel : string = "";
}
