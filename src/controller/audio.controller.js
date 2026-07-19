import hit from "../assets/audio/audio-hit.mp3";
import menuDeny from "../assets/audio/audio-menu-deny.mp3";
import menuSuccess from "../assets/audio/audio-menu-success.mp3";
import place from "../assets/audio/audio-place.mp3";
import select1 from "../assets/audio/audio-select-1.mp3";
import select2 from "../assets/audio/audio-select-2.mp3";
import select3 from "../assets/audio/audio-select-3.mp3";
import stretch from "../assets/audio/audio-stretch.mp3";
import waterSplash from "../assets/audio/audio-water-splash.mp3";
import waves from "../assets/audio/audio-waves.mp3";
import won from "../assets/audio/audio-won.mp3";
import whoosh from "../assets/audio/audio-whoosh.mp3";
import click from "../assets/audio/audio-click.mp3";
import explosion from "../assets/audio/audio-explosion.mp3";

export default class AudioController {
  #muted = false;

  #sounds = {
    hit: new Audio(hit),
    wrong: new Audio(menuDeny),
    success: new Audio(menuSuccess),
    place: new Audio(place),
    select1: new Audio(select1),
    select2: new Audio(select2),
    select3: new Audio(select3),
    stretch: new Audio(stretch),
    waterSplash: new Audio(waterSplash),
    waves: new Audio(waves),
    won: new Audio(won),
    whoosh: new Audio(whoosh),
    click: new Audio(click),
    explosion: new Audio(explosion),
  };

  init() {
    this.mute();
  }

  backgroundInit() {
    const waves = this.#sounds.waves;
    waves.loop = true;
    waves.volume = 0.2;

    waves.play();
  }

  /**
   * @param {"hit" | "wrong" | "success" | "place" | "select1" | "select2" | "select3" | "stretch" | "waterSplash" | "waves" | "won" | "whoosh" | "click" | "explosion"} name
   */
  play(name) {
    if (this.#muted) return;

    const audio = this.#sounds[name];
    if (!audio) return;

    audio.currentTime = 0;
    audio.play();
  }

  stop(name) {
    const audio = this.#sounds[name];
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  }

  mute() {
    this.#muted = true;

    Object.values(this.#sounds).forEach((audio) => {
      audio.muted = true;
    });
  }

  unmute() {
    this.#muted = false;

    Object.values(this.#sounds).forEach((audio) => {
      audio.muted = false;
    });
  }

  toggleMute() {
    this.#muted ? this.unmute() : this.mute();
  }

  setVolume(volume) {
    Object.values(this.#sounds).forEach((audio) => {
      audio.volume = volume;
    });
  }
}
