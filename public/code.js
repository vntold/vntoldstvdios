function fitComingSoon() {
  const text = document.getElementById("comingSoon");

  text.style.transform = "scaleX(1)";

  const textWidth = text.getBoundingClientRect().width;
  const screenWidth = window.innerWidth;

  const scale = (screenWidth / textWidth) * 1.02;

  text.style.transform = `scaleX(${scale})`;
}

window.addEventListener("load", fitComingSoon);
window.addEventListener("resize", fitComingSoon);
