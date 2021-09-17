import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn:'root'
})

export class ThemeService
{
    public selectedThemeFile = "theme01.png"
    public selectedThemeChanged : BehaviorSubject<void> = new BehaviorSubject<void>(null);
    public image : HTMLImageElement; 

    changeTheme(selectedTheme)
    {
        this.selectedThemeFile = selectedTheme;
        localStorage.setItem("selectedTheme",selectedTheme)
        location.reload();
    }

    setTile(tileNumber : number)
    {
        let image = new Image();
        image.src = `assets/themes/${localStorage.getItem("selectedTheme")}/${tileNumber}.png`;
        image.onload = () =>{
            this.image = image;
        }; 
    }

    getTileSize()
    {
        return Math.floor(this.image.width);
    }

    getTileHeight()
    {
        return Math.floor(this.image.height);
    }

    getDrawParams()
    {
        let x1 = 0;
        let x2 = this.getTileSize();
        let y1 = 0;
        let y2 = this.getTileHeight();

        return {x1,x2,y1,y2}
    }
    setTileObservable(tileNumber : number) : Observable<HTMLImageElement>{
        let imgSrc = `assets/themes/${localStorage.getItem("selectedTheme")}/${tileNumber}.png`;
        return new Observable(function(observer){
          const img = new Image();
          img.src = imgSrc;
          img.onload = function(){
            observer.next(img);
            observer.complete();
          }
          img.onerror = function(err){
            observer.error(err);
          }
        });
     }

}

export enum ItemMap
{
    "BASE"    = 0,
    "COLOR_1" = 1,
    "COLOR_2" = 2,
    "COLOR_3" = 3,
    "COLOR_4" = 4,
    "COLOR_5" = 5,
    "COLOR_6" = 6,
    "COLOR_7" = 7
}

export const Themes = [{
        name:"Tema base",
        fileName: "theme01"
    },
    {
        name:"Noir",
        fileName: "theme02"
    },
    {
        name:"Tecnologia",
        fileName: "theme03"
    },
    {
        name:"RetroFuturista",
        fileName: "theme04"
    },
    {
        name:"Frutas",
        fileName: "theme05"
    },
    {
        name:"Tema Base 2",
        fileName: "theme06"
    },
    {
        name:"Geométricos",
        fileName: "theme07"
    },
    {
        name:"😎😎😎😎😎😎😎",
        fileName: "theme08"
    }
]

