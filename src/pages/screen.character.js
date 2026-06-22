import character1 from "../assets/characters/character-1.png";
import character2 from "../assets/characters/character-2.png";
import character3 from "../assets/characters/character-3.png";
import character4 from "../assets/characters/character-4.png";
import character5 from "../assets/characters/character-5.png";
import character6 from "../assets/characters/character-6.png";
import character7 from "../assets/characters/character-7.png";

export default class ScreenCharacterInfo {
  constructor() {
    this.main = document.querySelector(`[data-page="container"]`);
    this.template = document.querySelector("#screen-character-info");
  }

  init(handler = null) {
    this.main.appendChild(this.create(handler));
  }

  create(handler) {
    const clone = this.template.content.cloneNode(true);
    const mover = this.move(clone);

    clone.querySelectorAll("button").forEach((btn) => {
      if (typeof handler === "function")
        btn.addEventListener("click", handler.bind(this));
    });

    clone.querySelector("#back").addEventListener("click", () => {
      mover.prev();
    });
    clone.querySelector("#forward").addEventListener("click", () => {
      mover.next();
    });

    return clone;
  }

  move(container) {
    let currentIndex = 0;

    const offscreenPreviewLeft = container.querySelector(
      "#offscreen-preview-left",
    );
    const previousPreview = container.querySelector("#previous-preview");
    const currentPreview = container.querySelector("#current-preview");
    const nextPreview = container.querySelector("#next-preview");
    const offscreenPreviewRight = container.querySelector(
      "#offscreen-preview-right",
    );
    const slotoffscreenPreviewLeft = container.querySelector(
      "#slot-offscreen-preview-left",
    );
    const slotpreviousPreview = container.querySelector(
      "#slot-previous-preview",
    );
    const slotcurrentPreview = container.querySelector("#slot-current-preview");
    const slotnextPreview = container.querySelector("#slot-next-preview");
    const slotoffscreenPreviewRight = container.querySelector(
      "#slot-offscreen-preview-right",
    );

    const previews = [
      character1,
      character2,
      character3,
      character4,
      character5,
      character6,
      character7,
    ];

    function render(state) {
      offscreenPreviewLeft.src = state.offscreenLeft;
      previousPreview.src = state.previous;
      currentPreview.src = state.current;
      nextPreview.src = state.next;
      offscreenPreviewRight.src = state.offscreenRight;
    }

    async function update(direction) {
      const animations = animate(direction);

      await Promise.all(animations.map((animation) => animation.finished));

      const state = getPreviewState(currentIndex, direction, previews);
      currentIndex = state.index;

      render(state);
    }

    const directions = {
      next: () => [
        moveAnimation(
          slotoffscreenPreviewLeft,
          slotpreviousPreview,
          "offscreenToPreview",
        ),
        moveAnimation(
          slotpreviousPreview,
          slotcurrentPreview,
          "previewToCurrent",
        ),
        moveAnimation(slotcurrentPreview, slotnextPreview, "currentToPreview"),
        moveAnimation(
          slotnextPreview,
          slotoffscreenPreviewRight,
          "previewToOffscreen",
        ),
      ],

      prev: () => [
        moveAnimation(
          slotpreviousPreview,
          slotoffscreenPreviewLeft,
          "previewToOffscreen",
        ),
        moveAnimation(
          slotcurrentPreview,
          slotpreviousPreview,
          "currentToPreview",
        ),
        moveAnimation(slotnextPreview, slotcurrentPreview, "previewToCurrent"),
        moveAnimation(
          slotoffscreenPreviewRight,
          slotnextPreview,
          "offscreenToPreview",
        ),
      ],
    };

    function animate(direction) {
      return directions[direction]();
    }

    // Initial render
    render({
      offscreenLeft: previews[previews.length - 2],
      previous: previews[previews.length - 1],
      current: previews[0],
      next: previews[1],
      offscreenRight: previews[2],
    });

    return {
      next: () => update("next"),
      prev: () => update("prev"),
    };
  }
}

function getPreviewState(index, direction, previews) {
  const length = previews.length;

  const nextIndex =
    direction === "prev" ? (index + 1) % length : (index - 1 + length) % length;

  return {
    index: nextIndex,
    offscreenLeft: previews[(nextIndex - 2 + length) % length],
    previous: previews[(nextIndex - 1 + length) % length],
    current: previews[nextIndex],
    next: previews[(nextIndex + 1) % length],
    offscreenRight: previews[(nextIndex + 2) % length],
  };
}

function moveAnimation(fromEl, toEl, type) {
  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();

  const dx = toRect.left - fromRect.left;

  return mappedAnimation(fromEl, dx, type);
}

const animationMap = {
  offscreenToPreview,
  previewToCurrent,
  currentToPreview,
  previewToOffscreen,
};

function mappedAnimation(e, dx, type, duration = 500) {
  if (!animationMap[type]) return;

  return animationMap[type](e, dx, duration);
}

function offscreenToPreview(e, dx, duration) {
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
      fill: "forwards",
    },
  );
}

function previewToCurrent(e, dx, duration) {
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
      fill: "forwards",
    },
  );
}

function currentToPreview(e, dx, duration) {
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
      fill: "forwards",
    },
  );
}

function previewToOffscreen(e, dx, duration) {
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
      fill: "forwards",
    },
  );
}
