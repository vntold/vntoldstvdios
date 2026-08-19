/* =========================
   LOADER
========================= */

const loader = document.getElementById("loader");

const loaderNumber = document.getElementById("loaderNumber");

const loaderProgress = document.getElementById("loaderProgress");

const site = document.getElementById("site");

let progress = 0;

const loaderInterval = setInterval(() => {
  /*
      Progress moves unevenly so it feels
      more like a real asset loader.
    */

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

/* =========================
   VIDEO
========================= */

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

/* PAUSE */

pauseButton.addEventListener("click", () => {
  if (video.paused) {
    video.play();

    pauseButton.textContent = "PAUSE";
  } else {
    video.pause();

    pauseButton.textContent = "PLAY";
  }
});

/* MUTE */

muteButton.addEventListener("click", () => {
  video.muted = !video.muted;

  muteButton.textContent = video.muted ? "UNMUTE" : "MUTE";
});

/* =========================
   OPTIONAL VIDEO-BASED LOADER
========================= */

/*
  If you eventually want the loader to wait
  until your actual hero video is ready
  instead of using the fake progress animation,
  we can replace the loader logic above with
  real media loading progress.
*/
