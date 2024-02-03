const timer = {
    pomodoro: 45,
    shortBreak: 1,
    longBreak:30, 
    longBreakInterval: 4, 
    sessions: 0,
};

document.addEventListener('DOMContentLoaded', function () {
  const customCursor = document.querySelector('.custom-cursor');

  document.addEventListener('mousemove', function (e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    customCursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });
});

const modeButtons = document.querySelector('#js-mode-buttons');
modeButtons.addEventListener('click', handleMode);

function handleMode(event) {
  const { mode } = event.target.dataset;

  if (!mode) return;

  switchMode(mode);
  stopTimer();
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
    document
    .getElementById('js-progress')
    .setAttribute('max', timer.remainingTime.total);
  
    updateClock();
  }
  function updateClock() {
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');
  
    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');
    min.textContent = minutes;
    sec.textContent = seconds;
    
    const text = timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
    document.title = `${minutes}:${seconds} — ${text}`;

    const progress = document.getElementById('js-progress');
    progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
  }  
let interval;

function startTimer() {
    document.querySelector(`[data-sound="${timer.mode}"]`).play();
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;
    
    if (timer.mode === 'pomodoro') timer.sessions++;
    
    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');
  
    interval = setInterval(function() {
      timer.remainingTime = getRemainingTime(endTime);
      updateClock();
  
      total = timer.remainingTime.total;
      if (total <= 0) {
        clearInterval(interval);
        switch (timer.mode) {
            case 'pomodoro':
              if (timer.sessions % timer.longBreakInterval === 0) {
                switchMode('longBreak');
              } else {
                switchMode('shortBreak');
              }
              break;
            default:
              switchMode('pomodoro');
          }
    
          startTimer();
      }
    }, 1000);
  }

  function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;
  
    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);
  
    return {
      total,
      minutes,
      seconds,
    };
  }

  const buttonSound = new Audio('button-sound.mp3');
  const mainButton = document.getElementById('js-btn');
  mainButton.addEventListener('click', () => {
  buttonSound.play();
  const { action } = mainButton.dataset;
  if (action === 'start') {
    startTimer();
  }
 else {
    stopTimer();
  }
});
document.addEventListener('DOMContentLoaded', () => {
    switchMode('pomodoro');
  });

  function stopTimer() {
    clearInterval(interval);
  
    mainButton.dataset.action = 'start';
    mainButton.textContent = 'start';
    mainButton.classList.remove('active');
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Let's check if the browser supports notifications
    if ('Notification' in window) {
      // If notification permissions have neither been granted or denied
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        // ask the user for permission
        Notification.requestPermission().then(function(permission) {
          // If permission is granted
          if (permission === 'granted') {
            // Create a new notification
            new Notification(
              'Awesome! You will be notified at the start of each session'
            );
          }
        });
      }
    }
  
    switchMode('pomodoro');
  });

  if (Notification.permission === 'granted') {
    const text =
      timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
    new Notification(text);
  } 