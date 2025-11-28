// mapa3 logic (estrutura igual ao mapa2)
const playerEl = document.getElementById('player');
const playerNameHUD = document.getElementById('playerNameHUD');
const livesHUD = document.getElementById('livesHUD');
const timeHUD = document.getElementById('timeHUD');

const stageEls = {
  1: document.getElementById('stage1'),
  2: document.getElementById('stage2'),
  3: document.getElementById('stage3'),
  4: document.getElementById('stage4')
};

let state = {
  stage: 1,
  playerX: 45,
  playerY: 75,
  moveSpeed: 1.6,
  keys: {},
  lives: parseInt(localStorage.getItem('athena_map2_lives') || '3', 10),
  timeStarted: parseInt(localStorage.getItem('athena_map2_timeStarted') || '0', 10),
  currentTime: 0,
  playerName: localStorage.getItem('athena_playerName') || 'Jogador'
};

if (!state.timeStarted) {
  state.timeStarted = Date.now();
  localStorage.setItem('athena_map2_timeStarted', state.timeStarted);
}

playerNameHUD.textContent = state.playerName;
livesHUD.textContent = 'Vidas: ' + state.lives;

showStage(state.stage);

window.addEventListener('keydown', (e) => state.keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', (e) => state.keys[e.key.toLowerCase()] = false);

// hint buttons
document.querySelectorAll('#stage2 .small').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.id;
    const urls = {1:'img/d1.png',2:'img/d2.png',3:'img/d3.png',4:'map2_dica4.png'};
    const box = document.getElementById('hintImageBox');
    const img = document.getElementById('hintImage');
    img.src = urls[id] || urls[1];
    box.classList.remove('hidden');
  });
});

// question panel
document.getElementById('openQuestion').addEventListener('click', () => {
  document.getElementById('questionPanel').classList.remove('hidden');
});
document.querySelectorAll('#questionPanel .answer-btn').forEach(b => {
  b.addEventListener('click', () => {
    const type = b.dataset.type;
    if (type === 'V') {
      state.stage = 4;
      showStage(4);
      const elapsed = getElapsedSeconds();
      const best = parseInt(localStorage.getItem('athena_map2_best') || '0',10);
      if (!best || elapsed < best) localStorage.setItem('athena_map2_best', String(elapsed));
    } else {
      state.lives -= 1;
      if (state.lives <= 0) {
        alert('Game Over! Voltando ao menu.');
        localStorage.removeItem('athena_map2_timeStarted');
        window.location.href = 'index.html';
        return;
      }
      localStorage.setItem('athena_map2_lives', String(state.lives));
      state.stage = 1;
      state.playerX = 10;
      showStage(1);
      document.getElementById('questionPanel').classList.add('hidden');
    }
  });
});

document.getElementById('finishBack').addEventListener('click', () => {
  window.location.href = 'index.html';
});

let loop = setInterval(() => {
  handleMovement();
  updatePlayerEl();
  checkStageTransitions();
  updateTimeHUD();
}, 30);

function handleMovement(){
  if (state.keys['arrowleft'] || state.keys['a']) state.playerX = Math.max(0, state.playerX - state.moveSpeed*0.6);
  if (state.keys['arrowright'] || state.keys['d']) state.playerX = Math.min(98, state.playerX + state.moveSpeed*0.6);
}
function updatePlayerEl(){ playerEl.style.left = state.playerX + '%'; playerEl.style.top = state.playerY + '%'; }
function checkStageTransitions(){
  if (state.playerX > 85) {
    if (state.stage === 1) { state.stage = 2; state.playerX = 10; showStage(2); }
    else if (state.stage === 2) { state.stage = 3; state.playerX = 10; showStage(3); }
  }
}
function showStage(num){
  Object.keys(stageEls).forEach(k => stageEls[k].classList.remove('active'));
  stageEls[num].classList.add('active');
  state.stage = num;
  const q = document.getElementById('questionPanel');
  if (q) q.classList.add('hidden');
  const hintBox = document.getElementById('hintImageBox'); if (hintBox) hintBox.classList.add('hidden');
  updateHUD();
}
function updateHUD(){ playerNameHUD.textContent = state.playerName; livesHUD.textContent = 'Vidas: ' + state.lives; localStorage.setItem('athena_map2_lives', String(state.lives)); }
function updateTimeHUD(){
  const started = state.timeStarted;
  const elapsed = Math.floor((Date.now() - started)/1000);
  state.currentTime = elapsed;
  timeHUD.textContent = 'Tempo: ' + formatTime(elapsed);
  localStorage.setItem('athena_map2_currentTime', String(elapsed));
}
function getElapsedSeconds(){ return state.currentTime || Math.floor((Date.now() - state.timeStarted)/1000); }
function formatTime(s){ const m=Math.floor(s/60); const sec=s%60; return `${m}:${sec.toString().padStart(2,'0')}`; }
updateHUD(); updateTimeHUD();
