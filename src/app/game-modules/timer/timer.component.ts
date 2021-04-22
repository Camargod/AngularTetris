import { Component, OnInit } from '@angular/core';
import { MatchVariablesService } from '../match-variables/match-variables.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  constructor(private variablesService : MatchVariablesService) { }

  timer;

  ngOnInit() {
    this.variablesService.timer.subscribe((time)=>{
      this.timer = time;
    })
  }

  botaoDoFranca(){
    MatchVariablesService.helloWorld()
  }

}
