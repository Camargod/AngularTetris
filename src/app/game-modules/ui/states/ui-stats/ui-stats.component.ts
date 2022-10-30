import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UiStateControllerService, UiStatesEnum } from '../../ui-state-controller/ui-state-controller.service';

@Component({
  selector: 'app-ui-stats',
  templateUrl: './ui-stats.component.html',
  styleUrls: ['./ui-stats.component.scss']
})
export class UiStatsComponent implements OnInit {

  @ViewChild("statscanvas", {static:true}) statsCanvas!: ElementRef<HTMLCanvasElement>
  statsCanvasContext!: CanvasRenderingContext2D

  constructor(private uiState : UiStateControllerService) { }

  ngOnInit() {
    this.statsCanvasContext = this.statsCanvas.nativeElement.getContext("2d")!;
    this.draw();
  }

  draw(){
    this.statsCanvas.nativeElement.height = window.innerHeight;
    this.statsCanvas.nativeElement.width = window.innerWidth;

    this.statsCanvasContext.beginPath();
    this.statsCanvasContext.moveTo(820,300);
    this.statsCanvasContext.strokeStyle = "red";
    this.statsCanvasContext.fillStyle = "blue";
    this.statsCanvasContext.fillRect(50, 50, 50, 50);
  }


  back(){
    this.uiState.changeState(UiStatesEnum.MENU);
  }
}
