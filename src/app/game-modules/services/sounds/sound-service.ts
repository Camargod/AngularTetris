import { Injectable } from "@angular/core";

@Injectable({providedIn:"root"})
export class SoundClassService {
  mainAudio !: HTMLAudioElement;
  secondaryAudio !: HTMLAudioElement;
  constructor() {}

  setNewMainAudio(soundName: string,loop:boolean = false) {
    this.mainAudio!.src = `./assets/themes/${soundName}.mp3`;
    this.mainAudio!.volume = Number.parseFloat(localStorage.getItem("soundVolume")!) || .12;
    this.mainAudio!.loop = loop;
    this.mainAudio!.load();
    this.mainAudio!!.play();
    // this.mainAudio!.onload = () => {
    // }
  }

  setNewSecondaryAudio(soundName: string,loop:boolean = false) {
    this.secondaryAudio!.src = `./assets/themes/${soundName}.mp3`;
    this.secondaryAudio!.volume = Number.parseFloat(localStorage.getItem("effectsVolume")!) || .12;
    this.secondaryAudio!.loop = loop;
    this.secondaryAudio!.load();
    this.secondaryAudio!!.play();

    // this.secondaryAudio!.onload = () => {
    // }
  }

  stopMainAudio(){
    this.mainAudio!.pause();
  }


  setMainAudio(audio : HTMLAudioElement){
    this.mainAudio = audio;
  }
  setSecondaryAudio(audio : HTMLAudioElement){
    this.secondaryAudio = audio;
  }
}

export const AudioMap = [
  "main",
  "damage",
  "fast-throw"
]

export const enum AudioMapNames {
  "main" = 0,
  "damage" = 1,
  "fast_throw" = 2,
}
