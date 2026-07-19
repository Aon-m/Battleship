const images = import.meta.webpackContext("../assets", {
  recursive: true,
  regExp: /\.(png|jpe?g|gif|svg|webp)$/i,
});

const audio = import.meta.webpackContext("../assets", {
  recursive: true,
  regExp: /\.(mp3|wav|ogg)$/i,
});

const videos = import.meta.webpackContext("../assets", {
  recursive: true,
  regExp: /\.(mp4|webm|mov)$/i,
});

export default class AssetLoader {
  static async load() {
    const promises = [];

    // Images
    images.keys().forEach((key) => {
      const src = images(key);

      promises.push(
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = () => reject(new Error(`Failed to load ${src}`));
          img.src = src;
        }),
      );
    });

    // Audio
    audio.keys().forEach((key) => {
      const src = audio(key);

      promises.push(
        new Promise((resolve, reject) => {
          const sound = new Audio();
          sound.preload = "auto";
          sound.onloadeddata = resolve;
          sound.onerror = () => reject(new Error(`Failed to load ${src}`));
          sound.src = src;
          sound.load();
        }),
      );
    });

    // Videos
    videos.keys().forEach((key) => {
      const src = videos(key);

      promises.push(
        new Promise((resolve, reject) => {
          const video = document.createElement("video");
          video.preload = "auto";
          video.onloadeddata = resolve;
          video.onerror = () => reject(new Error(`Failed to load ${src}`));
          video.src = src;
          video.load();
        }),
      );
    });

    await Promise.all(promises);
  }
}
