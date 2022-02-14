class AudioPlayer {

  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();
  }

  public playEffect(src: string): void {
    if (this.audio.paused) {
      this.audio.src = src;
      this.audio.currentTime = 0;
      this.audio.play();
    }
  }
}

export { AudioPlayer }
