import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { UiStateControllerService, UiStatesEnum } from '../../ui-state-controller/ui-state-controller.service';

@Component({
  selector: 'app-ui-stats',
  templateUrl: './ui-stats.component.html',
  styleUrls: ['./ui-stats.component.scss']
})
export class UiStatsComponent implements OnInit {

  //@ViewChild("statscanvas", {static:true}) statsCanvas!: ElementRef<HTMLCanvasElement>
  //statsCanvasContext!: CanvasRenderingContext2D

  @ViewChild("gamestats", {static:true}) gameStats!: ElementRef<HTMLCanvasElement>
  ctx!: CanvasRenderingContext2D

  @ViewChild("champdata", {static:true}) champData!: ElementRef<HTMLCanvasElement>
  champctx!: CanvasRenderingContext2D

  @ViewChild("rolestats", {static:true}) roleStats!: ElementRef<HTMLCanvasElement>
  rolectx!: CanvasRenderingContext2D

  @ViewChild("timedata", {static:true}) timeData!: ElementRef<HTMLCanvasElement>
  timectx!: CanvasRenderingContext2D

  myDoughnut?:Chart

  constructor(private uiState : UiStateControllerService) { }

  ngOnInit() {
    //this.statsCanvasContext = this.statsCanvas.nativeElement.getContext("2d")!;
    this.ctx = this.gameStats.nativeElement.getContext("2d")!;
    this.champctx = this.champData.nativeElement.getContext("2d")!;
    this.rolectx = this.roleStats.nativeElement.getContext("2d")!;
    this.timectx = this.timeData.nativeElement.getContext("2d")!;

    this.draw();
  }


  draw(){
    this.gameStats.nativeElement.height = window.innerHeight;
    this.gameStats.nativeElement.width = window.innerWidth;


    //this.statsCanvasContext.beginPath();
    //this.statsCanvasContext.moveTo(820,300);
    //this.statsCanvasContext.strokeStyle = "red";
    //this.statsCanvasContext.fillStyle = "blue";
    //this.statsCanvasContext.fillRect(50, 50, 50, 50);
    let gameStats:any = [
      {
        value: 280,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "1 contra 1"
      },
      {
        value: 150,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "1 contra 2"
      },
      {
        value: 100,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "1 contra 3"
      },
      {
        value: 40,
        color: "#949FB1",
        highlight: "#A8B3C5",
        label: "1 contra 4"
      },
      {
        value: 20,
        color: "#4D5360",
        highlight: "#616774",
        label: "1 contra 5"
      }
    ];
    
    this.ctx.canvas.width = 180;
    this.ctx.canvas.height = 180;
    this.myDoughnut = new Chart(this.ctx,gameStats)
    
    let champData = {
        labels: ["Padrão", "Noir", "Tech", "Retro"],
        datasets: [
            {
                label: "Data",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81]
            },
            {
                label: "Data 2",
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19]
            }
        ]
    };
    let champctx = this.champData.nativeElement.getContext("2d")!;
    window.myBarChart = new Chart(ctx).Bar(champData, {responsive: true});
    
    let roleStats = [
        {
            value: 300,
            color:"#F7464A",
            highlight: "#FF5A5E",
            label: "Agressivo"
        },
        {
            value: 225,
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: "Line Maker"
        },
        {
            value: 240,
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "Pacificador"
        }
    ];
    let rolectx = this.roleStats.nativeElement.getContext("2d")!;
    ctx.canvas.width = 200;
    ctx.canvas.height = 180;
    window.myPolarArea = new Chart(ctx).PolarArea(roleStats, {responsive: false});
    
    let timeData = {
        labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio"],
        datasets: [
            {
                label: "Esse Ano",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56]
            },
            {
                label: "Último Ano",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 86]
            }
        ]
    };
    let timectx = this.timeData.nativeElement.getContext("2d")!;
    window.myLineChart = new Chart(ctx).Line(timeData, {responsive: true});
  }

  back(){
    this.uiState.changeState(UiStatesEnum.MENU);
  }
}