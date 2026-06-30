export default function bindClick(element, handler, once = false) {
  element.addEventListener("click", handler, { once });
}
