// ===== GLOBAL MODE =====
let usePlayMoney = true;

// ===== MUSIC CONTROL =====
const music = document.getElementById('popcornAudio');
const toggleMusic = document.getElementById('toggleMusic');
toggleMusic.addEventListener('click', () => {
  if (music.paused) {
    music.play();
    toggleMusic.textContent = '🔇 Stop Music';
  } else {
    music.pause();
    toggleMusic.textContent = '🔊 Play Music';
  }
});

// ===== TOGGLE MODE =====
document.getElementById('toggleMode').addEventListener('click', () => {
  usePlayMoney = !usePlayMoney;
  alert(`Mode: ${usePlayMoney ? 'House Coins' : 'Amina'}`);
});

// ===== SLOT MACHINE =====
const slotSymbols = ['🌟', '💫', '✨', '🌙', '🚀'];
function spinSlots() {
  const reels = [reel1, reel2, reel3];
  reels.forEach((reel, i) => {
    const symbol = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
    reel.textContent = symbol;
  });

  const bet = parseFloat(document.getElementById('slotBet').value);
  const result = document.getElementById('slotResult');
  if (reel1.textContent === reel2.textContent && reel2.textContent === reel3.textContent) {
    result.textContent = `🎉 Jackpot! You won ${bet * 5} ${usePlayMoney ? 'HC' : 'Amina'}!`;
  } else {
    result.textContent = `😢 Try again. You lost ${bet} ${usePlayMoney ? 'HC' : 'Amina'}.`;
  }
}
document.getElementById('spinButton').addEventListener('click', spinSlots);
document.getElementById('slotBet').addEventListener('input', e => {
  document.getElementById('slotBetDisplay').textContent = `Bet: ${e.target.value}`;
});

// ===== BLACKJACK =====
const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let deck = [];
let dealer = [], player = [];

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let val of values) {
      deck.push({ suit, val });
    }
  }
  deck = deck.sort(() => Math.random() - 0.5);
}

function getCardValue(card) {
  if (['J', 'Q', 'K'].includes(card.val)) return 10;
  if (card.val === 'A') return 11;
  return parseInt(card.val);
}

function calculateHandValue(hand) {
  let total = 0, aces = 0;
  hand.forEach(card => {
    total += getCardValue(card);
    if (card.val === 'A') aces++;
  });
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

function updateBlackjackUI() {
  const d = document.getElementById('dealer-hand');
  const p = document.getElementById('player-hand');
  d.innerHTML = '<strong>Dealer:</strong> ' + dealer.map(c => `${c.val}${c.suit}`).join(' ');
  p.innerHTML = '<strong>You:</strong> ' + player.map(c => `${c.val}${c.suit}`).join(' ');
}

function deal() {
  createDeck();
  dealer = [deck.pop(), deck.pop()];
  player = [deck.pop(), deck.pop()];
  updateBlackjackUI();
  document.getElementById('blackjackResult').textContent = '';
}

function hit() {
  player.push(deck.pop());
  updateBlackjackUI();
  if (calculateHandValue(player) > 21) {
    document.getElementById('blackjackResult').textContent = `💥 Bust! You lost.`;
  }
}

function stand() {
  while (calculateHandValue(dealer) < 17) {
    dealer.push(deck.pop());
  }
  updateBlackjackUI();
  const playerVal = calculateHandValue(player);
  const dealerVal = calculateHandValue(dealer);
  const bet = parseFloat(document.getElementById('blackjackBet').value);
  let resultText = '';
  if (dealerVal > 21 || playerVal > dealerVal) {
    resultText = `🎉 You win ${bet * 2} ${usePlayMoney ? 'HC' : 'Amina'}!`;
  } else if (playerVal === dealerVal) {
    resultText = '🤝 Push!';
  } else {
    resultText = `😢 You lose ${bet} ${usePlayMoney ? 'HC' : 'Amina'}.`;
  }
  document.getElementById('blackjackResult').textContent = resultText;
}

document.getElementById('dealButton').addEventListener('click', deal);
document.getElementById('hitButton').addEventListener('click', hit);
document.getElementById('standButton').addEventListener('click', stand);
document.getElementById('blackjackBet').addEventListener('input', e => {
  document.getElementById('blackjackBetDisplay').textContent = `Bet: ${e.target.value}`;
});

// ===== PLINKO =====
const canvas = document.getElementById('plinkoCanvas');
const ctx = canvas.getContext('2d');
const pegs = [], ball = { x: 150, y: 0, radius: 5, vy: 2 };
let plinkoRunning = false;

function initPlinko() {
  pegs.length = 0;
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col <= row; col++) {
      const x = 60 + col * 40 + (row % 2) * 20;
      const y = 50 + row * 60;
      pegs.push({ x, y });
    }
  }
}
function drawPlinko() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw pegs
  ctx.fillStyle = '#fff';
  pegs.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });
  // Draw ball
  if (plinkoRunning) {
    ctx.fillStyle = '#0ff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.fill();
    ball.y += ball.vy;
    // Bounce off pegs
    pegs.forEach(p => {
      const dx = ball.x - p.x;
      const dy = ball.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < ball.radius + 4) {
        ball.x += Math.random() > 0.5 ? 15 : -15;
      }
    });
    if (ball.y > canvas.height - 10) {
      plinkoRunning = false;
      const bet = parseFloat(document.getElementById('plinkoBet').value);
      const prize = (Math.random() < 0.33) ? bet * 3 : 0;
      document.getElementById('plinkoResult').textContent = prize > 0
        ? `🎉 You won ${prize} ${usePlayMoney ? 'HC' : 'Amina'}!`
        : `😢 No win. Lost ${bet} ${usePlayMoney ? 'HC' : 'Amina'}.`;
    }
  }
  requestAnimationFrame(drawPlinko);
}
document.getElementById('dropPlinkoBall').addEventListener('click', () => {
  if (!plinkoRunning) {
    ball.x = 150;
    ball.y = 0;
    plinkoRunning = true;
  }
});
document.getElementById('plinkoBet').addEventListener('input', e => {
  document.getElementById('plinkoBetDisplay').textContent = `Bet: ${e.target.value}`;
});

initPlinko();
drawPlinko();
