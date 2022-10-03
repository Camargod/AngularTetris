import {
  Injectable
} from "@angular/core";
import {
  BehaviorSubject,
  Observable
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ThemeService {
  public selectedThemeFile = "theme01.png"
  public selectedThemeChanged: BehaviorSubject < null > = new BehaviorSubject < null > (null);
  public image ?: HTMLImageElement;
  public themeImages : Array<HTMLImageElement> = [];

  changeTheme(selectedTheme: string) {
    this.selectedThemeFile = selectedTheme;
    localStorage.setItem("selectedTheme", selectedTheme)
    this.loadNewTheme();
  }

  loadNewTheme(){
    return new Observable((observable)=>{
      let loadedImages = 0;
      for(let index = 0; index <= 7; index++){
        let image = new Image();
        image.src = `assets/themes/${localStorage.getItem("selectedTheme")}/${index}.png`;
        image.onload = () => {
          loadedImages++;
          this.themeImages[index] = image;

          if(loadedImages == 8){
            observable.next();
            observable.complete();
            this.selectedThemeChanged.next(null);
          }
        };
      }
    })
  }

  setTile(tileNumber: number) {
    let image = new Image();
    image.src = `assets/themes/${localStorage.getItem("selectedTheme")}/${tileNumber}.png`;
    image.onload = () => {
      this.image = image;
    };
  }

  private getTileSize() {
    return Math.floor(this.image!.width);
  }

  private getTileHeight() {
    return Math.floor(this.image!.height);
  }

  getDrawParams() {
    let x1 = 0;
    let x2 = this.getTileSize();
    let y1 = 0;
    let y2 = this.getTileHeight();

    return {
      x1,
      x2,
      y1,
      y2
    }
  }

  // setTileObservable(tileNumber: number): Observable < HTMLImageElement > {
  //   let imgSrc = "";
  //   if (tileNumber == undefined) {
  //     imgSrc = `assets/themes/${localStorage.getItem("selectedTheme")}/${tileNumber}.png`;
  //   } else {
  //     imgSrc = `assets/themes/${localStorage.getItem("selectedTheme")}/0.png`;
  //   }
  //   return new Observable(function (observer) {
  //     const img = new Image();
  //     img.src = imgSrc;
  //     img.onload = function () {
  //       //while(img.width == undefined || img.width == 0){}
  //       observer.next(img);
  //       observer.complete();
  //     }
  //     img.onerror = function (err) {
  //       observer.error(err);
  //     }
  //   });
  // }

  getBackgroundUrl() {
    let selectedTheme = localStorage.getItem("selectedTheme");
    // if(selectedTheme != "theme01"){
    //     return `url(assets/themes/theme01/fundo.png)`;
    // }
    return `url(assets/themes/${selectedTheme}/fundo.png)`;
  }

  getBackgroundUrlThemeTile(theme : {name:String,fileName:String}) {
    return `url(assets/themes/${theme.fileName}/preview.png)`;
  }


  setDefaultTheme(){
    if(!localStorage.getItem("selectedTheme")){
      this.changeTheme(Themes[0].fileName);
    }
  }
}

export enum ItemMap {
  "BASE" = 0,
  "COLOR_1" = 1,
  "COLOR_2" = 2,
  "COLOR_3" = 3,
  "COLOR_4" = 4,
  "COLOR_5" = 5,
  "COLOR_6" = 6,
  "COLOR_7" = 7
}

export const Themes = [{
    name: "Tema base",
    fileName: "theme01"
  },
  {
    name: "Noir",
    fileName: "theme02"
  },
  {
    name: "Tecnologia",
    fileName: "theme03"
  },
  {
    name: "RetroFuturista",
    fileName: "theme04"
  },
  {
    name: "Frutas",
    fileName: "theme05"
  },
  {
    name: "Tema Base 2",
    fileName: "theme06"
  },
  {
    name: "Geométricos",
    fileName: "theme07"
  },
  {
    name: "😎😎😎😎😎😎😎",
    fileName: "theme08"
  },
  {
    name: "Roxo",
    fileName: "theme09"
  },
  {
    name: "Azul",
    fileName: "theme10"
  },
  {
    name: "Verde",
    fileName: "theme11"
  },
  {
    name: "Vermelho",
    fileName: "theme12"
  },
  {
    name: "Comidas",
    fileName: "theme13"
  },
  {
    name: "Animais",
    fileName: "theme14"
  }
]
