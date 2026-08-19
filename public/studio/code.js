/* =========================================================
   LOADER
========================================================= */

const loader = document.getElementById("loader");

const loaderNumber = document.getElementById("loaderNumber");

const loaderProgress = document.getElementById("loaderProgress");

const site = document.getElementById("site");

let progress = 0;

const loaderInterval = setInterval(() => {
  const increment = progress < 60 ? Math.random() * 8 : Math.random() * 3.5;

  progress += increment;

  if (progress >= 100) {
    progress = 100;

    clearInterval(loaderInterval);

    loaderNumber.textContent = "100";

    loaderProgress.style.width = "100%";

    setTimeout(() => {
      site.classList.add("is-ready");

      loader.classList.add("is-hidden");
    }, 420);

    return;
  }

  const displayedProgress = Math.floor(progress);

  loaderNumber.textContent = displayedProgress;

  loaderProgress.style.width = `${displayedProgress}%`;
}, 90);

/* =========================================================
   HERO VIDEO
========================================================= */

const video = document.getElementById("heroVideo");

const pauseButton = document.getElementById("pauseButton");

const muteButton = document.getElementById("muteButton");

const currentTimeText = document.getElementById("currentTime");

const totalTimeText = document.getElementById("totalTime");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const mins = Math.floor(seconds / 60);

  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
}

video.addEventListener("loadedmetadata", () => {
  totalTimeText.textContent = formatTime(video.duration);
});

video.addEventListener("timeupdate", () => {
  currentTimeText.textContent = formatTime(video.currentTime);
});

/* PAUSE / PLAY */

pauseButton.addEventListener("click", () => {
  if (video.paused) {
    video.play();

    pauseButton.textContent = "PAUSE";
  } else {
    video.pause();

    pauseButton.textContent = "PLAY";
  }
});

/* MUTE / UNMUTE */

muteButton.addEventListener("click", () => {
  video.muted = !video.muted;

  muteButton.textContent = video.muted ? "UNMUTE" : "MUTE";
});

/* =========================================================
   FULL SCREEN MENU
========================================================= */

const menuButton = document.getElementById("menuButton");

const menuOverlay = document.getElementById("menuOverlay");

const menuLabel = document.getElementById("menuLabel");

const menuSymbol = document.getElementById("menuSymbol");

function setMenuState(isOpen) {
  menuOverlay.classList.toggle("is-open", isOpen);

  document.body.classList.toggle("menu-open", isOpen);

  menuButton.setAttribute("aria-expanded", isOpen);

  menuOverlay.setAttribute("aria-hidden", !isOpen);

  menuLabel.textContent = isOpen ? "CLOSE" : "MENU";

  menuSymbol.textContent = isOpen ? "×" : "+";
}

menuButton.addEventListener("click", () => {
  const isOpen = !menuOverlay.classList.contains("is-open");

  setMenuState(isOpen);
});

/* ESC CLOSE */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuOverlay.classList.contains("is-open")) {
    setMenuState(false);
  }
});

/* CLOSE MENU AFTER CLICKING A MENU LINK */

document.querySelectorAll(".menu-item[href]").forEach((link) => {
  link.addEventListener("click", () => {
    setMenuState(false);
  });
});

/* =========================================================
   WORK CATEGORY INTERACTION
========================================================= */

const workCategoryItems = document.querySelectorAll(".work-categories span");

workCategoryItems.forEach((category) => {
  category.addEventListener("click", () => {
    workCategoryItems.forEach((item) => {
      item.classList.remove("active");
    });

    category.classList.add("active");
  });
});

/* =========================================================
   OPTIONAL:
   PAUSE CAROUSEL WHEN TAB IS HIDDEN
========================================================= */

const carouselTrack = document.getElementById("carouselTrack");

document.addEventListener("visibilitychange", () => {
  if (!carouselTrack) {
    return;
  }

  carouselTrack.style.animationPlayState = document.hidden
    ? "paused"
    : "running";
});
