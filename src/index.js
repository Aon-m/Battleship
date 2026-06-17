import "./styles/styles.css";

document.querySelectorAll(".button--primary").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.remove("floating-hover");
    btn.classList.add("yeet");
  });
});
