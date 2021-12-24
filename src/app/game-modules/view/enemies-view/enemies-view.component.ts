import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChildren } from "@angular/core";
import { Subscription } from "rxjs";
import { MatchVariablesService } from "../../match-variables/match-variables.service";
import { PlayersGrids } from "../../objects/players-grids";
import { SingleViewComponent } from "./single-view/single-view.component";

@Component({
    selector: 'enemies-view',
    templateUrl: './enemies-view.component.html',
    styleUrls: ['./enemies-view.component.scss']
})
export class EnemiesViewComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChildren("singleView") singleViews : QueryList<SingleViewComponent> | undefined;

  players : PlayersGrids = {};
  socketIdEntries : string[] = [];
  playersSubscription ?: Subscription;

  constructor(private matchVariables : MatchVariablesService){}
  ngAfterViewInit(): void {
    this.drawViews()
  }

  ngOnInit(): void {
      this.playersSubscription = this.matchVariables.otherPlayersGrid.subscribe((players)=>{
          this.players = players;
          this.socketIdEntries = Object.keys(players);
      });
  }

  ngOnDestroy(): void {
      this.playersSubscription!.unsubscribe();
  }

  drawViews(){
    try{
      this.singleViews?.forEach((view)=>{
        view.gridDraw();
      })
    }catch(err){
      console.error(err);
    }
  }
}
