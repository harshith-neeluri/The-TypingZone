const themeSwitcher = document.getElementById('themeSwitcher');
const generatedText = document.getElementById('generatedText');
const radios = document.getElementsByName('level');
const keyboard = document.getElementById('keyboard');
const userInput = document.getElementById('userInput');
const timerDisplay = document.getElementById('timer');
const accuracyDisplay = document.getElementById('accuracy');
const cpsDisplay = document.getElementById('cps');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');

const texts = {
  easy: [
    "the sun is shining and the sky is blue.",
    "she loves reading books on weekends.",
    "i saw a cat jumping over the wall."
  ],
  medium: [
    "Although it was raining, they decided to go hiking.",
    "The museum exhibited ancient artifacts from Egypt.",
    "She developed a keen interest in astronomy over time."
  ],
  difficult: [
    "The algorithm’s complexity was O(n^2)! Optimize it, please.",
    "Can you believe he typed 90 wpm? #Impressive @coder",
    "Philosophers wonder: 'What is real?' *deep* thoughts..."
  ]
};

let currentText = "";
let startTime = null;
let elapsedTime = 0;
let timerInterval = null;
let paused = false;
let lastIndex = -1;

function generateText() {
  const level = document.querySelector('input[name="level"]:checked').value;
  const options = texts[level];

  let index;
  do {
    index = Math.floor(Math.random() * options.length);
  } while (index === lastIndex && options.length > 1);

  lastIndex = index;
  let text = options[index];

  if (level === "easy") {
    text = text.toLowerCase();
  } else if (level === "difficult") {
    text = randomizeCase(text);
  }else if(level === "medium"){
    let news="";
    for(let i=0;i<text.length;i++){
      if(Math.random()>0.5){
        news+=text[i].toUpperCase();
      }else{
        news+=text[i].toLowerCase();
      }
    }
  }

  currentText = text;
  renderTextWithHighlight(0);
  resetTest();
}

function renderTextWithHighlight(nextIndex) {
  let html = "";
  for (let i = 0; i < currentText.length; i++) {
    if (i === nextIndex) {
      html += `<span class="highlight">${currentText[i]}</span>`;
    } else {
      html += `<span>${currentText[i]}</span>`;
    }
  }
  generatedText.innerHTML = html;
}

function randomizeCase(str) {
  return str.split('').map(ch => {
    if (/[a-zA-Z]/.test(ch)) {
      return Math.random() > 0.5 ? ch.toUpperCase() : ch.toLowerCase();
    } else {
      return ch;
    }
  }).join('');
}

function resetTest() {
  clearInterval(timerInterval);
  startTime = null;
  elapsedTime = 0;
  paused = false;
  timerDisplay.textContent = "0.00";
  accuracyDisplay.textContent = "0%";
  cpsDisplay.textContent = "0";
  userInput.value = "";
  pauseBtn.disabled = true;
  stopBtn.disabled = true;
}

function startTimer() {
  if (paused) {
    paused = false;
    startTime = Date.now() - elapsedTime;
  } else {
    startTime = Date.now();
    elapsedTime = 0;
  }

  pauseBtn.disabled = false;
  stopBtn.disabled = false;

  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    timerDisplay.textContent = (elapsedTime / 1000).toFixed(2);
    updateCPS();
  }, 100);
}

function pauseTimer() {
  paused = true;
  clearInterval(timerInterval);
  pauseBtn.disabled = true;
}

function stopTimer() {
  clearInterval(timerInterval);
  elapsedTime = 0;
  timerDisplay.textContent = "0.00";
  cpsDisplay.textContent = "0";
  pauseBtn.disabled = true;
  stopBtn.disabled = true;
}

function calculateAccuracy() {
  const typed = userInput.value;
  let correct = 0;
  for (let i = 0; i < typed.length && i < currentText.length; i++) {
    if (typed[i] === currentText[i]) {
      correct++;
    }
  }
  const accuracy = typed.length > 0 ? (correct / typed.length) * 100 : 0;
  accuracyDisplay.textContent = accuracy.toFixed(2) + "%";
  return accuracy;
}

function updateCPS() {
  if (!startTime || elapsedTime === 0) {
    cpsDisplay.textContent = "0";
    return;
  }
  const typedLength = userInput.value.length;
  const cps = typedLength / (elapsedTime / 1000);
  cpsDisplay.textContent = cps.toFixed(2);
}

userInput.addEventListener('input', () => {
  if (!startTime && !paused && userInput.value.length > 0) {
    startTimer();
  }

  calculateAccuracy();

  const nextIndex = userInput.value.length < currentText.length ? userInput.value.length : -1;
  renderTextWithHighlight(nextIndex);

  if (userInput.value.length >= currentText.length) {
    clearInterval(timerInterval);
    pauseBtn.disabled = true;
    stopBtn.disabled = false;
    calculateAccuracy();
  }
});

pauseBtn.addEventListener('click', () => {
  pauseTimer();
});

stopBtn.addEventListener('click', () => {
  stopTimer();
  resetTest();
});

document.addEventListener('keydown', (e) => {
  const key = e.key.toUpperCase();
  keyboard.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.toUpperCase() === key) {
      btn.classList.add('active');
      setTimeout(() => btn.classList.remove('active'), 150);
    }
  });
});

themeSwitcher.addEventListener('change', () => {
  document.body.classList.toggle('dark', themeSwitcher.checked);
  document.body.classList.toggle('light', !themeSwitcher.checked);
  generateText();
});

radios.forEach(radio => {
  radio.addEventListener('change', () => {
    generateText();
  });
});

window.addEventListener('DOMContentLoaded', () => {
  generateText();
  resetTest();
});
