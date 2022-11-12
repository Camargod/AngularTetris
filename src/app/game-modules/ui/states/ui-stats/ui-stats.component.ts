import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { Chart, ChartConfiguration } from 'chart.js';
import { UiStateControllerService, UiStatesEnum } from '../../ui-state-controller/ui-state-controller.service';

@Component({
  selector: 'app-ui-stats',
  templateUrl: './ui-stats.component.html',
  styleUrls: ['./ui-stats.component.scss']
})
export class UiStatsComponent implements OnInit {

  //@ViewChild("statscanvas", {static:true}) statsCanvas!: ElementRef<HTMLCanvasElement>
  //statsCanvasContext!: CanvasRenderingContext2D

  @ViewChild("gameStats", {static:true}) gameStats!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;

  @ViewChild("champData", {static:true}) champData!: ElementRef<HTMLCanvasElement>;
  champctx!: CanvasRenderingContext2D;

  @ViewChild("roleStats", {static:true}) roleStats!: ElementRef<HTMLCanvasElement>;
  rolectx!: CanvasRenderingContext2D;

  @ViewChild("timeData", {static:true}) timeData!: ElementRef<HTMLCanvasElement>;
  timectx!: CanvasRenderingContext2D;

  user ?: User | undefined | null;

  myDoughnut?:Chart;
  champDataChart ?: Chart;
  roleStatsChart ?: Chart;
  myLineChart ?: Chart;

  myLineChartConfig: ChartConfiguration = {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        label: 'Esse ano',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Ano Passado',
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  }

  champDataConfig = {
    labels: ["Padrão", "Noir", "Tech", "Retro"],
    datasets: [
        {
            label: "Vitórias",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81]
        },
        {
            label: "Derrotas",
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19]
        }
    ]
  };

  gameStatsConfig:ChartConfiguration = {
    type: 'doughnut',
    data: {
      labels: ["1 contra 1", "1 contra 2", "1 contra 3", "1 contra 4", "1 contra 5"],
      datasets: [
        {
          data: [280, 150, 100, 40, 20],
          backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
          hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]
        }
      ]
    },
    options: {
      responsive: true
    }
  };

  roleStatsConfig : ChartConfiguration = {
    type: 'polarArea',
    data: {
      labels: ["Agressivo" , "Line Maker", "Pacificador"],
      datasets: [
        {
          data: [300, 225, 240],
          backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C"],
          hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870"]
        }
      ]
    },
    options: {
      responsive: true
    }
  }

  constructor(private uiState : UiStateControllerService, private auth : AuthService) { }

  ngOnInit() {
    this.auth.user$.subscribe((user)=>{
      this.user = user
    })

    this.configCanvas();
    this.configChart();
  }

  configCanvas(){
    this.ctx = this.gameStats.nativeElement.getContext("2d")!;
    this.champctx = this.champData.nativeElement.getContext("2d")!;
    this.rolectx = this.roleStats.nativeElement.getContext("2d")!;
    this.timectx = this.timeData.nativeElement.getContext("2d")!;

    this.gameStats.nativeElement.height = window.innerHeight;
    this.gameStats.nativeElement.width = window.innerWidth;

    this.ctx.canvas.width = 180;
    this.ctx.canvas.height = 180;
    this.champctx.canvas.height = 180;
    this.champctx.canvas.width = 200;
    this.rolectx.canvas.width = 200;
    this.rolectx.canvas.height = 180;
  }

  configChart(){
    this.myDoughnut = new Chart(this.ctx,this.gameStatsConfig);
    this.champDataChart = new Chart(this.champctx,{
      type: 'bar',
      data: this.champDataConfig
    });
    // this.roleStatsChart = new Chart(this.rolectx,{
    //   type: 'polarArea',
    //   data: this.roleStatsConfig
    // });
    this.roleStatsChart = new Chart(this.rolectx,this.roleStatsConfig);
    this.myLineChart = new Chart(this.timectx,this.myLineChartConfig);
  }

  back(){
    this.uiState.changeState(UiStatesEnum.MENU);
  }
}
