// index menu logic
document.getElementById('startBtn').addEventListener('click', () => {
  const name = document.getElementById('playerName').value.trim() || 'Jogador';
  // salva nome localmente e redireciona para o mapa (mapa2.html)
  localStorage.setItem('athena_playerName', name);
  // Se não existe tempo de mapa1, não altera (mapa2.js decide iniciar)
  window.location.href = 'mapa2.html';
});

document.getElementById('rankBtn').addEventListener('click', () => {
  document.getElementById('rankSection').classList.remove('hidden');
});
document.getElementById('creditsBtn').addEventListener('click', () => {
  document.getElementById('creditsSection').classList.remove('hidden');
});
document.getElementById('rankBack').addEventListener('click', () => {
  document.getElementById('rankSection').classList.add('hidden');
});
document.getElementById('creditsBack').addEventListener('click', () => {
  document.getElementById('creditsSection').classList.add('hidden');
});

// mostra melhores tempos se houver (localStorage)
function renderRank() {
  const map1Best = localStorage.getItem('athena_map1_best');
  const map2Best = localStorage.getItem('athena_map2_best');
  const el = document.getElementById('rankContent');
  el.innerHTML = `
    <div><strong>Mapa 1:</strong> ${map1Best ? formatTime(+map1Best) : '—'}</div>
    <div><strong>Mapa 2:</strong> ${map2Best ? formatTime(+map2Best) : '—'}</div>
  `;
}
function formatTime(sec) {
  if (!sec && sec !== 0) return '—';
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
renderRank();
