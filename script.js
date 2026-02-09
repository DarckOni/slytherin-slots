const reels = document.querySelectorAll('.reel');
const spinButton = document.getElementById('spin-button');
const resultElement = document.getElementById('result');
const balanceElement = document.getElementById('balance');
const betElement = document.getElementById('bet');
const paytable = document.getElementById('paytable');
const spinningSound = new Audio('spinning_sound.mp3');

const symbols = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍋', '💎', '💰'];
let balance = 10;
let bet = 0.50;

function createMoneyRain() {
    const coinSymbols = ['💰', '🪙', '💎', '💵', '✨'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const coin = document.createElement('div');
            coin.className = 'coin';
            coin.textContent = coinSymbols[Math.floor(Math.random() * coinSymbols.length)];
            coin.style.left = Math.random() * 100 + 'vw';
            const duration = Math.random() * 2 + 2; 
            coin.style.animationDuration = duration + 's';
            document.body.appendChild(coin);
            setTimeout(() => coin.remove(), duration * 1000);
        }, i * 50);
    }
}

async function spin() {
    if (balance < bet) { resultElement.textContent = "Fără credit!"; return; }
    
    spinButton.disabled = true;
    paytable.classList.remove('winning-glow'); // Reset glow la spin nou
    balance -= bet;
    balanceElement.textContent = `Balance: ${balance.toFixed(2)}`;

    const willWin = Math.random() < 0.10; // 10% Rata de castig
    const results = [[], [], []];

    try { spinningSound.play(); spinningSound.loop = true; } catch(e) {}

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            results[r][c] = symbols[Math.floor(Math.random() * symbols.length)];
        }
    }

    if (willWin) {
        const winSym = symbols[Math.floor(Math.random() * symbols.length)];
        results[1][0] = winSym; results[1][1] = winSym; results[1][2] = winSym;
    }

    const spinReel = (reel, index) => {
        return new Promise(resolve => {
            reel.innerHTML = '<div class="reel-inner"></div>';
            const inner = reel.querySelector('.reel-inner');
            for (let i = 0; i < 20; i++) {
                const s = document.createElement('div');
                s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                s.className = 'result-symbol';
                inner.appendChild(s);
            }
            reel.classList.add('spinning');
            setTimeout(() => {
                reel.classList.remove('spinning');
                reel.innerHTML = '';
                for (let i = 0; i < 3; i++) {
                    const s = document.createElement('div');
                    s.textContent = results[i][index];
                    s.className = 'result-symbol';
                    reel.appendChild(s);
                }
                resolve();
            }, 800 + index * 400);
        });
    };

    await spinReel(reels[0], 0);
    await spinReel(reels[1], 1);
    await spinReel(reels[2], 2);

    spinningSound.pause();
    spinningSound.currentTime = 0;

    let winAmount = 0;
    if (results[1][0] === results[1][1] && results[1][1] === results[1][2]) {
        const sym = results[1][0];
        winAmount = (sym === '💎') ? bet * 20 : (sym === '💰') ? bet * 10 : bet * 5;
    }

    if (winAmount > 0) {
        balance += winAmount;
        resultElement.textContent = `CÂȘTIG: ${winAmount.toFixed(2)}`;
        paytable.classList.add('winning-glow'); // Activează glow
        createMoneyRain();
    } else {
        resultElement.textContent = "Mai încearcă!";
    }

    balanceElement.textContent = `Balance: ${balance.toFixed(2)}`;
    localStorage.setItem('balance', balance.toString());
    spinButton.disabled = false;
}

// Listeners (Bet, Collect, Spin)
document.getElementById('increase-bet').addEventListener('click', () => { bet = Math.min(bet + 0.5, 1000); document.getElementById('bet').textContent = `Bet: ${bet.toFixed(2)}`; });
document.getElementById('decrease-bet').addEventListener('click', () => { bet = Math.max(bet - 0.5, 0.5); document.getElementById('bet').textContent = `Bet: ${bet.toFixed(2)}`; });
document.getElementById('collect-button').addEventListener('click', () => {
    balance += 100;
    balanceElement.textContent = `Balance: ${balance.toFixed(2)}`;
    createMoneyRain();
});
spinButton.addEventListener('click', spin);
window.addEventListener('load', () => {
    const saved = localStorage.getItem('balance');
    balance = saved ? parseFloat(saved) : 10;
    balanceElement.textContent = `Balance: ${balance.toFixed(2)}`;
});
