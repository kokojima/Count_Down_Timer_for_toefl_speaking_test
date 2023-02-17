// collect DOMs
const display = document.querySelector(".display");
const controllerWrapper = document.querySelector(".controllers");

const State = ["Initial", "Record", "Download"];
let stateIndex = 0;
let mediaRecorder,
  chunks = [],
  audioURL = "";
let timeLeft15 = 15;
let timeLeft45 = 45;
let timerId15;
let timerId45;

// mediaRecorder setup for audio
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log("mediaDevices supported..");

  navigator.mediaDevices
    .getUserMedia({
      audio: true,
    })
    .then((stream) => {
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        chunks = [];
        audioURL = window.URL.createObjectURL(blob);
        document.querySelector("audio").src = audioURL;
      };
    })
    .catch((error) => {
      console.log("Following error has occured : ", error);
    });
} else {
  stateIndex = "";
  application(stateIndex);
}

const clearDisplay = () => {
  display.textContent = "";
};

const clearControls = () => {
  controllerWrapper.textContent = "";
};

const record = () => {
  stateIndex = 1;
  mediaRecorder.start();
  application(stateIndex);
};

const stopRecording = () => {
  stateIndex = 2;
  mediaRecorder.stop();
  application(stateIndex);
};

const downloadAudio = () => {
  const downloadLink = document.createElement("a");
  downloadLink.href = audioURL;
  downloadLink.setAttribute("download", "audio");
  downloadLink.click();
};

const addButton = (id, funString, text) => {
  const btn = document.createElement("button");
  btn.id = id;
  btn.setAttribute("onclick", funString);
  btn.textContent = text;
  controllerWrapper.append(btn);
};

const addMessage = (text) => {
  const msg = document.createElement("p");
  msg.textContent = text;
  display.append(msg);
};

const addAudio = () => {
  const audio = document.createElement("audio");
  audio.controls = true;
  audio.src = audioURL;
  display.append(audio);
};

const application = (index) => {
  switch (State[index]) {
    case "Initial":
      clearDisplay();
      clearControls();

      addButton("record", "record()", "Start Recording");
      break;

    case "Record":
      clearDisplay();
      clearControls();

      addMessage("Recording...");
      addButton("stop", "stopRecording()", "Stop Recording");
      break;

    case "Download":
      clearControls();
      clearDisplay();

      addAudio();
      addButton("record", "record()", "Record Again");
      break;

    default:
      clearControls();
      clearDisplay();

      addMessage("Your browser does not support mediaDevices");
      break;
  }
};
function startTimer15() {
  timerId15 = setInterval(() => {
    timeLeft15--;
    document.getElementById("timer-15").textContent = timeLeft15;

    if (timeLeft15 === 0) {
      clearInterval(timerId15);
      document.getElementById("timer-15").textContent = "Time-up";
      startTimer45();
      stateIndex = 1;
      mediaRecorder.start();
      application(stateIndex);
    }
  }, 1000);
}

function startTimer45() {
  timerId45 = setInterval(() => {
    timeLeft45--;
    document.getElementById("timer-45").textContent = timeLeft45;

    if (timeLeft45 === 0) {
      clearInterval(timerId45);
      document.getElementById("timer-45").textContent = "Time-up";
      //   stopRecording();
      stateIndex = 2;
      mediaRecorder.stop();
      application(stateIndex);
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerId15);
  clearInterval(timerId45);
  timeLeft15 = 15;
  timeLeft45 = 45;
  document.getElementById("timer-15").textContent = timeLeft15;
  document.getElementById("timer-45").textContent = timeLeft45;
  clearDisplay();
  clearControls();
  //   addButton("record", "record()", "Start Recording");
}

function stopTimer() {
  clearInterval(timerId15);
  clearInterval(timerId45);
}

application(stateIndex);
