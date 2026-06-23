export default class MoveAnimation {
  constructor() {}

  moveAnimation(fromEl, type, direction, step) {
    const dx = direction === "prev" ? -step : step;

    return this.mappedAnimation(fromEl, dx, type);
  }

  mappedAnimation(e, dx, type, duration = 500) {
    const map = {
      offscreenToPreview: this.#offscreenToPreview,
      previewToCurrent: this.#previewToCurrent,
      currentToPreview: this.#currentToPreview,
      previewToOffscreen: this.#previewToOffscreen,
    };

    const fn = map[type];
    if (!fn) return;

    return fn.call(this, e, dx, duration);
  }

  #offscreenToPreview(e, dx, duration) {
    return e.animate(
      [
        {
          transform: "translateX(0px) scale(0)",
          opacity: 0,
        },
        {
          transform: `translateX(${dx}px) scale(0.5)`,
          opacity: 0.8,
        },
      ],
      {
        duration,
      },
    );
  }

  #previewToCurrent(e, dx, duration) {
    return e.animate(
      [
        {
          transform: "translateX(0px) scale(0.5)",
          opacity: 0.8,
        },
        {
          transform: `translateX(${dx}px) scale(1)`,
          opacity: 1,
        },
      ],
      {
        duration,
      },
    );
  }

  #currentToPreview(e, dx, duration) {
    return e.animate(
      [
        {
          transform: "translateX(0px) scale(1)",
          opacity: 1,
        },
        {
          transform: `translateX(${dx}px) scale(0.5)`,
          opacity: 0.8,
        },
      ],
      {
        duration,
      },
    );
  }

  #previewToOffscreen(e, dx, duration) {
    return e.animate(
      [
        {
          transform: "translateX(0px) scale(0.5)",
          opacity: 0.8,
        },
        {
          transform: `translateX(${dx}px) scale(0)`,
          opacity: 0,
        },
      ],
      {
        duration,
      },
    );
  }
}
