import {Component,ViewChild,ElementRef,OnInit} from '@angular/core';
import { ThemeService} from './game-modules/services/themes/theme-service';
import { EnemiesViewComponent } from './game-modules/hud/enemies-view/enemies-view.component';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Online Tetris';

  isUiEnabled = true;

  @ViewChild("gameDiv", {static: true}) gameDiv !: ElementRef <HTMLDivElement>;


  constructor(private themeService : ThemeService) {}

  /*
    Ajustes iniciais do jogo.
  */

  ngOnInit() : void {
    this.themeService.loadNewTheme().subscribe(()=>{
      this.themeService.selectedThemeChanged.next(true);
      this.setBackgroundByTheme();
    });
  }


  ngAfterViewInit(): void {
  }

      /*
    Desenho de jogo.
  */
  setBackgroundByTheme(){
    this.gameDiv.nativeElement.style.background = this.themeService.getBackgroundUrl();
  }

  authenticateUser(){
  }

  // toggleUi(value : boolean){
  //   this.isUiEnabled = value;
  // }

}


