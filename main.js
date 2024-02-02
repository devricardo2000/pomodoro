const timer = {
    pomodoro: 45,
    shortBreak: 10,
    longBreak:30, 
    longBreakInterval: 4, 
};

const modeButtons = document.querySelector('#js-mode-buttons');
modeButtons.addEventListener('click', handleMode);

function handleMode(event) {
  const { mode } = event.target.dataset;

  if (!mode) return;

  switchMode(mode);
}

function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
      total: timer[mode] * 60,
      minutes: timer[mode],
      seconds: 0,
    };
  
    document
      .querySelectorAll('button[data-mode]')
      .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    
    // Set background image based on mode
    const backgroundImage = getComputedStyle(document.body).getPropertyValue(`--${mode}-image`);
    document.body.style.backgroundImage = backgroundImage;
  
    updateClock();
  }
  
