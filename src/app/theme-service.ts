import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn:'root'
})

export class ThemeService
{
    public static selectedThemeFile = "theme01.png"
    public static selectedThemeChanged : BehaviorSubject<void> = new BehaviorSubject<void>(null);
    public static image : HTMLImageElement; 

    static changeTheme(selectedTheme)
    {
        this.selectedThemeFile = selectedTheme;
        localStorage.setItem("selectedTheme",selectedTheme)
    }

    static setTile()
    {
        let image = new Image();
        image.src = `assets/themes/${localStorage.getItem("selectedTheme")}`;
        image.onload = () =>{
            this.image = image;
        }; 
    }

    static getTileSize()
    {
        return Math.floor(this.image.width / 8);
    }

    static getTileHeight()
    {
        return Math.floor(this.image.height);
    }

    static getDrawParams(block:ItemMap)
    {
        debugger;
        let x1 = block * this.getTileSize();
        let x2 = block * this.getTileSize() + this.getTileSize();
        let y1 = 0;
        let y2 = this.getTileHeight();

        return {x1,x2,y1,y2}
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