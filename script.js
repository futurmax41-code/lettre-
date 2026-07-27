/* ===================== ENVELOPPE ===================== */
const envelope = document.getElementById('envelope');
envelope.addEventListener('click', () => {
  if (envelope.classList.contains('open')) return;
  envelope.classList.add('open');
  setTimeout(() => {
    document.getElementById('scene-letter').scrollIntoView({ behavior: 'smooth' });
  }, 900);
});

document.getElementById('toGames').addEventListener('click', () => {
  document.getElementById('scene-game1').scrollIntoView({ behavior: 'smooth' });
});

/* ===================== JEU 1 : ATTRAPE-COEURS ===================== */
const hgField   = document.getElementById('hg-field');
const hgStart   = document.getElementById('hg-start');
const hgScoreEl = document.getElementById('hg-score');
const hgTimeEl  = document.getElementById('hg-time');
const hgResult  = document.getElementById('hg-result');

let hgScore = 0;
let hgTime = 30;
let hgTimer = null;
let hgSpawner = null;
let hgRunning = false;

function hgSpawnHeart() {
  const heart = document.createElement('span');
  heart.className = 'falling-heart';
  heart.textContent = '❤';
  const fieldWidth = hgField.clientWidth;
  const size = 24 + Math.random() * 20;
  heart.style.fontSize = size + 'px';
  heart.style.left = Math.random() * (fieldWidth - 40) + 'px';
  const duration = 2.6 + Math.random() * 1.8;
  heart.style.animationDuration = duration + 's';

  heart.addEventListener('click', () => {
    if (heart.classList.contains('caught')) return;
    heart.classList.add('caught');
    hgScore++;
    hgScoreEl.textContent = hgScore;
    setTimeout(() => heart.remove(), 350);
  });

  heart.addEventListener('animationend', () => {
    if (heart.classList.contains('falling-heart') && !heart.classList.contains('caught')) {
      heart.remove();
    }
  });

  hgField.appendChild(heart);
}

function hgStartGame() {
  if (hgRunning) return;
  hgRunning = true;
  hgScore = 0;
  hgTime = 30;
  hgScoreEl.textContent = hgScore;
  hgTimeEl.textContent = hgTime;
  hgResult.textContent = '';
  hgStart.remove();
  hgField.querySelectorAll('.falling-heart').forEach(h => h.remove());

  hgSpawner = setInterval(hgSpawnHeart, 550);
  hgTimer = setInterval(() => {
    hgTime--;
    hgTimeEl.textContent = hgTime;
    if (hgTime <= 0) hgEndGame();
  }, 1000);
}

function hgEndGame() {
  hgRunning = false;
  clearInterval(hgSpawner);
  clearInterval(hgTimer);
  hgField.querySelectorAll('.falling-heart').forEach(h => h.remove());

  let msg;
  if (hgScore >= 25) msg = `${hgScore} cœurs attrapés — comme mon cœur, tu l'attrapes toujours.`;
  else if (hgScore >= 12) msg = `${hgScore} cœurs attrapés — pas mal du tout !`;
  else msg = `${hgScore} cœurs attrapés — rejoue, mon cœur ne demande qu'à être rattrapé.`;
  hgResult.textContent = msg;

  const btn = document.createElement('button');
  btn.className = 'start-btn small';
  btn.textContent = 'Rejouer';
  btn.addEventListener('click', () => { btn.remove(); hgStartGame(); });
  hgField.appendChild(btn);
}

hgStart.addEventListener('click', hgStartGame);

/* ===================== JEU 2 : MEMORY ===================== */
const memoryGrid  = document.getElementById('memoryGrid');
const mmMovesEl   = document.getElementById('mm-moves');
const mmPairsEl   = document.getElementById('mm-pairs');
const mmRestart   = document.getElementById('mm-restart');

const ICONS = ['❤','💌','🌹','✨','💍','🌙','🕊️','🍫'];

let mmFirst = null;
let mmSecond = null;
let mmLock = false;
let mmMoves = 0;
let mmPairs = 0;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildMemory() {
  memoryGrid.innerHTML = '';
  mmFirst = null;
  mmSecond = null;
  mmLock = false;
  mmMoves = 0;
  mmPairs = 0;
  mmMovesEl.textContent = 0;
  mmPairsEl.textContent = 0;

  const deck = shuffle([...ICONS, ...ICONS]);

  deck.forEach((icon) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.innerHTML = `
      <div class="face back">?</div>
      <div class="face front">${icon}</div>
    `;
    card.dataset.icon = icon;
    card.addEventListener('click', () => onCardClick(card));
    memoryGrid.appendChild(card);
  });
}

function onCardClick(card) {
  if (mmLock) return;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.classList.add('flipped');

  if (!mmFirst) {
    mmFirst = card;
    return;
  }

  mmSecond = card;
  mmLock = true;
  mmMoves++;
  mmMovesEl.textContent = mmMoves;

  if (mmFirst.dataset.icon === mmSecond.dataset.icon) {
    mmFirst.classList.add('matched');
    mmSecond.classList.add('matched');
    mmPairs++;
    mmPairsEl.textContent = mmPairs;
    resetPick();
    if (mmPairs === ICONS.length) {
      setTimeout(() => {
        document.getElementById('scene-final').scrollIntoView({ behavior: 'smooth' });
      }, 700);
    }
  } else {
    setTimeout(() => {
      mmFirst.classList.remove('flipped');
      mmSecond.classList.remove('flipped');
      resetPick();
    }, 800);
  }
}

function resetPick() {
  mmFirst = null;
  mmSecond = null;
  mmLock = false;
}

mmRestart.addEventListener('click', buildMemory);

buildMemory();
