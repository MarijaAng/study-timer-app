const studyDurationInput = document.querySelector("#studyDuration");
const breakDurationInput = document.querySelector("#breakDuration");
const startButton = document.querySelector("#startButton");
const progressBar = document.querySelector("#progressBar");
const sessionHistory = document.querySelector("#sessionHistory");

let studyArr = JSON.parse(localStorage.getItem("studySessions")) || [];
if (studyArr) {
  renderSessionHistory();
}

let totalTime = 0;
let elapsedTime = 0;
let timerInterval;

startButton.addEventListener("click", sessionStart);

function sessionStart() {
  const studyDurationTime = parseFloat(studyDurationInput.value);
  const breakDurationTime = parseFloat(breakDurationInput.value);

  if (
    isNaN(studyDurationTime) ||
    studyDurationTime <= 0 ||
    isNaN(breakDurationTime) ||
    breakDurationTime < 0
  ) {
    console.log("Yor study and break time can't be negative number.");
    return;
  } else {
    saveToLocalStorage(studyDurationTime, breakDurationTime);
  }

  totalTime = (studyDurationTime + breakDurationTime) * 60;
  elapsedTime = 0;
  progressBar.style.width = "0%";
  clearInterval(timerInterval);
  timerInterval = setInterval(updateProgress, 1000);
}

function updateProgress() {
  elapsedTime++;
  if (elapsedTime === localStorage.getItem("lastStudy") * 60) {
    alert("Take a break!");
  }

  if (elapsedTime >= totalTime) {
    clearInterval(timerInterval);
    progressBar.style.width = "100%";
    alert("Session complete!");

    saveToSessionHistory();
    renderSessionHistory();
    studyDurationInput.value = "";
    breakDurationInput.value = "";
    return;
  }

  const progressPercentage = (elapsedTime / totalTime) * 100;
  progressBar.style.width = `${progressPercentage}%`;
  progressBar.setAttribute("aria-valuenow", progressPercentage);
}

function saveToSessionHistory() {
  const date = new Date();
  const studyTime = parseFloat(studyDurationInput.value);
  const breakTime = parseFloat(breakDurationInput.value);

  const sessionData = {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString(),
    study: studyTime,
    break: breakTime,
  };
  studyArr.push(sessionData);
  localStorage.setItem("studySessions", JSON.stringify(studyArr));
}

function renderSessionHistory() {
  sessionHistory.innerHTML = "";
  if (studyArr.length !== 0) {
    const title = document.createElement("h4");
    title.classList.add("mb-3");
    title.innerText = "Session History";
    sessionHistory.append(title);
    studyArr.forEach((session) => {
      const newSessionDiv = document.createElement("div");
      newSessionDiv.classList.add(
        "border-bottom",
        "border-primary-subtle",
        "pb-2",
        "mb-3"
      );
      const newSession = document.createElement("p");
      newSession.classList.add("mb-0");
      newSession.innerHTML = `Date: ${session.date}, Time: ${session.time}, Study: ${session.study} minutes, Break: ${session.break} minutes`;
      newSessionDiv.append(newSession);
      sessionHistory.append(newSessionDiv);
    });
  }
}

function saveToLocalStorage(studyValue, breakValue) {
  localStorage.setItem("lastStudy", studyValue);
  localStorage.setItem("lastBreak", breakValue);
}
