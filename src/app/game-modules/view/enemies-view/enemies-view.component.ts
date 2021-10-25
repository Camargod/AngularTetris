import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { MatchVariablesService } from "../../match-variables/match-variables.service";
import { PlayersGrids } from "../../objects/players-grids";

@Component({
    selector: 'enemies-view',
    templateUrl: './enemies-view.component.html',
    styleUrls: ['./enemies-view.component.scss']
})
export class EnemiesViewComponent implements OnInit, OnDestroy {

    players : PlayersGrids = {};

    socketIdEntries : string[] = [];

    playersSubscription ?: Subscription;

    constructor(private matchVariables : MatchVariablesService){}

    ngOnInit(): void {
        this.playersSubscription = this.matchVariables.otherPlayersGrid.subscribe((players)=>{
            this.players = players;
            this.socketIdEntries = Object.keys(players);
        });
    }

    ngOnDestroy(): void {
        this.playersSubscription!.unsubscribe();
    }
}