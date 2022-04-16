export class SoundClass {
  audio ? : HTMLAudioElement;
  constructor() {}

  setNewAudio(soundName: string) {
    this.audio = new Audio(`assets/themes/${soundName}.mp3`);
    this.audio.volume = .12;
    this.audio.load();
    this.audio.onload = () => {
      this.audio!.play();
    }
  }
}

export const AudioMap = [
  "main",
  "effect"
]

export const enum AudioMapNames {
  "main" = 0,
  "effect" = 1
}
