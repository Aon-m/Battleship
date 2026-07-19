const images = require.context(
  "../assets",
  true,
  /\.(png|jpe?g|gif|svg|webp)$/i,
);

const audio = require.context("../assets", true, /\.(mp3|wav|ogg)$/i);

const videos = require.context("../assets", true, /\.(mp4|webm|mov)$/i);

export default class AssetLoader {
  static async load() {
    const promises = [];

    images.keys().forEach((key) => {
      promises.push(
        new Promise((resolve, reject) => {
          const img = new Image();

          img.onload = resolve;
          img.onerror = reject;
          img.src = images(key);
        }),
      );
    });

    audio.keys().forEach((key) => {
      promises.push(
        new Promise((resolve) => {
          const sound = new Audio();

          sound.preload = "auto";
          sound.oncanplaythrough = resolve;
          sound.src = audio(key);
        }),
      );
    });

    await Promise.all(promises);

    videos.keys().forEach((key) => {
      promises.push(
        new Promise((resolve, reject) => {
          const video = document.createElement("video");

          video.preload = "auto";
          video.onloadeddata = resolve;
          video.onerror = reject;
          video.src = video(key);
        }),
      );
    });

    await Promise.all(promises);
  }
}
