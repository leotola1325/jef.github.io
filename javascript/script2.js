// mapa2 logic (mapa 1 do jogo)
const playerEl = document.getElementById('player');
const portalEl = document.getElementById('portal');
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
  playerX: 45, // percent
  playerY: 75, // percent (fixed)
  moveSpeed: 1.6,
  keys: {},
  lives: parseInt(localStorage.getItem('athena_map1_lives') || '3', 10),
  timeStarted: parseInt(localStorage.getItem('athena_map1_timeStarted') || '0', 10),
  currentTime: 0,
  playerName: localStorage.getItem('athena_playerName') || 'Jogador'
};

// Se nunca iniciou mapa1, inicializa timeStarted
if (!state.timeStarted) {
  state.timeStarted = Date.now();
  localStorage.setItem('athena_map1_timeStarted', state.timeStarted);
}

// HUD init
playerNameHUD.textContent = state.playerName;
livesHUD.textContent = 'Vidas: ' + state.lives;
updateTimeHUD();

// show initial stage
showStage(state.stage);

// movement keys
window.addEventListener('keydown', (e) => { state.keys[e.key.toLowerCase()] = true; });
window.addEventListener('keyup', (e) => { state.keys[e.key.toLowerCase()] = false; });

// hint buttons (cenário 2)
document.querySelectorAll('#stage2 .small').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.id;
    // troque as URLs conforme quiser; aqui uso placeholders
    const urls = {
      1: 'img/botao1.png',
      2: 'img/botao2.png',
      3: 'img/botao3.png',
      4: 'img/botao4.png'
    };
    const box = document.getElementById('hintImageBox');
    const img = document.getElementById('hintImage');
    img.src = urls[id] || urls[1];
    box.classList.remove('hidden');
  });
});

// abrir painel de pergunta (cenário 3)
document.getElementById('openQuestion').addEventListener('click', () => {
  document.getElementById('questionPanel').classList.remove('hidden');
});

// respostas do painel
document.querySelectorAll('#questionPanel .answer-btn').forEach(b => {
  b.addEventListener('click', () => {
    const type = b.dataset.type; // 'V' ou 'R'
    if (type === 'V') {
      // acerto -> ir para stage4 (parabéns)
      state.stage = 4;
      showStage(4);
      // salvar best time local
      const elapsed = getElapsedSeconds();
      const best = parseInt(localStorage.getItem('athena_map1_best') || '0', 10);
      if (!best || elapsed < best) localStorage.setItem('athena_map1_best', String(elapsed));
    } else {
      // erro -> perde vida e volta para stage1 (tempo continua)
      state.lives -= 1;
      if (state.lives <= 0) {
        alert('Game Over! Voltando ao menu.');
        // limpa tempo e vai ao menu
        localStorage.removeItem('athena_map1_timeStarted');
        window.location.href = 'index.html';
        return;
      }
      localStorage.setItem('athena_map1_lives', String(state.lives));
      // volta pro inicio do mapa (stage 1)
      state.stage = 1;
      state.playerX = 10;
      showStage(1);
      // fecha painel
      document.getElementById('questionPanel').classList.add('hidden');
    }
    updateHUD();
  });
});

// botão do PARABÉNS para ir ao mapa3
document.getElementById('toMapa3').addEventListener('click', () => {
  // redireciona para mapa3.html, mantendo tempos e vidas (mapa3 usa suas chaves)
  window.location.href = 'mapa3.html';
});
document.getElementById('menuBack').addEventListener('click', () => {
  window.location.href = 'index.html';
});

// game loop
let loop = setInterval(() => {
  if (state.stage === 0) return;
  handleMovement();
  updatePlayerEl();
  checkStageTransitions();
  updateTimeHUD();
}, 30);

function handleMovement(){
  if (state.keys['arrowleft'] || state.keys['a']) {
    state.playerX = Math.max(0, state.playerX - state.moveSpeed*0.6);
  }
  if (state.keys['arrowright'] || state.keys['d']) {
    state.playerX = Math.min(98, state.playerX + state.moveSpeed*0.6);
  }
  // Y is fixed
}

function updatePlayerEl(){
  playerEl.style.left = state.playerX + '%';
  playerEl.style.top = state.playerY + '%';
}

function checkStageTransitions(){
  // if player reaches portal area (right side)
  if (state.playerX > 85) {
    if (state.stage === 1) {
      state.stage = 2;
      // teleport player to start of stage2
      state.playerX = 10;
      showStage(2);
    } else if (state.stage === 2) {
      state.stage = 3;
      state.playerX = 10;
      showStage(3);
    } else if (state.stage === 3) {
      // at stage3, moving to portal doesn't auto answer: user must click RESPONDER
      // but if they walk to portal, we can open the question panel automatically (optional)
      // no auto action here
    }
  }
}

function showStage(num){
  Object.keys(stageEls).forEach(k => stageEls[k].classList.remove('active'));
  stageEls[num].classList.add('active');
  state.stage = num;
  // hide question panel when switching
  const q = document.getElementById('questionPanel');
  if (q) q.classList.add('hidden');
  // hide hint image by default unless clicked
  const hintBox = document.getElementById('hintImageBox');
  if (hintBox) hintBox.classList.add('hidden');
  updateHUD();
}

function updateHUD(){
  playerNameHUD.textContent = state.playerName;
  livesHUD.textContent = 'Vidas: ' + state.lives;
  localStorage.setItem('athena_map1_lives', String(state.lives));
}

function updateTimeHUD(){
  const started = state.timeStarted;
  if (!started) { timeHUD.textContent = 'Tempo: 0:00'; return; }
  const elapsed = Math.floor((Date.now() - started)/1000);
  state.currentTime = elapsed;
  timeHUD.textContent = 'Tempo: ' + formatTime(elapsed);
  // grava tempo corrente (não sobrescreve start)
  localStorage.setItem('athena_map1_currentTime', String(elapsed));
}

function getElapsedSeconds(){ return state.currentTime || Math.floor((Date.now() - state.timeStarted)/1000); }
function formatTime(s){ const m=Math.floor(s/60); const sec=s%60; return `${m}:${sec.toString().padStart(2,'0')}`; }

// inicializa HUD
updateHUD();
updateTimeHUD();
