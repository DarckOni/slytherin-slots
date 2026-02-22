const reels = document.querySelectorAll('.reel');
const spinButton = document.getElementById('spin-button');
const resultElement = document.getElementById('result');
const balanceElement = document.getElementById('balance');
const betElement = document.getElementById('bet');
const collectBtn = document.getElementById('collect-button');
const paytable = document.getElementById('paytable');
const spinningSound = new Audio('spinning_sound.mp3');

const symbols = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍋', '💎', '💰'];
let balance = 10;
let bet = 0.50;
let timerInterval;

// PLOAIA DE BANI
function createMoneyRain() {
    const coinSymbols = ['💰', '🪙', '💎', '💵', '✨'];
    for (let i = 0; i < 45; i++) {
        setTimeout(() => {
            const coin = document.createElement('div');
            coin.className = 'coin';
            coin.textContent = coinSymbols[Math.floor(Math.random() * coinSymbols.length)];
            coin.style.left = Math.random() * 100 + 'vw';
            const duration = Math.random() * 1.5 + 2; 
            coin.style.animationDuration = duration + 's';
            document.body.appendChild(coin);
            setTimeout(() => coin.remove(), duration * 1000);
        }, i * 60);
    }
}

// LOGICA COLECTARE (30 MIN)
function updateTimer() {
    const nextTime = localStorage.getItem('nextCollectTime');
    if (!nextTime) return;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const diff = nextTime - now;

        if (diff <= 0) {
            clearInterval(timerInterval);
            collectBtn.disabled = false;
            collectBtn.textContent = "Collect";
            localStorage.removeItem('nextCollectTime');
        } else {
            const min = Math.floor(diff / 60000);
            const sec = Math.floor((diff % 60000) / 1000);
            collectBtn.disabled = true;
            collectBtn.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
        }
    }, 1000);
}

collectBtn.addEventListener('click', () => {
    balance += 100;
    saveGame();
    createMoneyRain();
    const nextCollect = new Date().getTime() + (30 * 60 * 1000);
    localStorage.setItem('nextCollectTime', nextCollect);
    updateTimer();
});

// LOGICA SPIN
// ... (păstrează variabilele de sus neschimbate până la funcția spin)

async function spin() {
    if (balance < bet) { 
        resultElement.textContent = "No funds!"; 
        return; 
    }
    
    spinButton.disabled = true;
    paytable.classList.remove('winning-glow');
    balance -= bet;
    saveGame();

    const willWin = Math.random() < 0.15; // Am crescut puțin rata la 15% fiind 3 linii
    const results = [[], [], []];

    try { 
        spinningSound.play(); 
        spinningSound.loop = true; 
    } catch(e) {}

    // 1. GENERARE SIMBOLURI ALEATORII
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            results[r][c] = symbols[Math.floor(Math.random() * symbols.length)];
        }
    }

    // 2. LOGICA DE CÂȘTIG FORȚAT (pe o linie aleatorie din cele 3)
    if (willWin) {
        const winSym = symbols[Math.floor(Math.random() * symbols.length)];
        const luckyRow = Math.floor(Math.random() * 3); // Alege rândul 0, 1 sau 2
        results[luckyRow][0] = winSym; 
        results[luckyRow][1] = winSym; 
        results[luckyRow][2] = winSym;
    }

    const spinReel = (reel, index) => {
        return new Promise(resolve => {
            reel.innerHTML = '<div class="reel-inner"></div>';
            const inner = reel.querySelector('.reel-inner');
            
            // Creăm animația de "blur" cu simboluri random
            for (let i = 0; i < 20; i++) {
                const s = document.createElement('div');
                s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                s.className = 'result-symbol';
                inner.appendChild(s);
            }

            reel.classList.add('spinning');

            // Timpul de oprire (decalat ușor pentru efect vizual, dar pornit simultan)
            setTimeout(() => {
                reel.classList.remove('spinning');
                reel.innerHTML = '';
                // Afișăm toate cele 3 rânduri pe coloana curentă
                for (let i = 0; i < 3; i++) {
                    const s = document.createElement('div');
                    s.textContent = results[i][index];
                    s.className = 'result-symbol';
                    reel.appendChild(s);
                }
                resolve();
            }, 1000 + index * 300); 
        });
    };

    // 3. PORNIRE SIMULTANĂ (Rezolvă problema timpului de așteptare)
    await Promise.all([
        spinReel(reels[0], 0),
        spinReel(reels[1], 1),
        spinReel(reels[2], 2)
    ]);

    spinningSound.pause();
    spinningSound.currentTime = 0;

    // 4. CALCULARE CÂȘTIG PE TOATE CELE 3 LINII
    let totalWin = 0;
    let wonAnyLine = false;

    for (let r = 0; r < 3; r++) {
        if (results[r][0] === results[r][1] && results[r][1] === results[r][2]) {
            const s = results[r][0];
            let rowWin = (s === '💎') ? bet * 20 : (s === '💰') ? bet * 10 : bet * 5;
            totalWin += rowWin;
            wonAnyLine = true;
        }
    }

    // 5. FINALIZARE ȘI AFISARE
    if (wonAnyLine) {
        balance += totalWin;
        resultElement.textContent = `WIN TOTAL: ${totalWin.toFixed(2)}`;
        paytable.classList.add('winning-glow');
        createMoneyRain();
    } else {
        resultElement.textContent = "Try again!";
    }

    saveGame();
    spinButton.disabled = false;
}

// ... (Restul codului pentru saveGame, listeners etc. rămâne identic)
function saveGame() {
    balanceElement.textContent = `Balance: ${balance.toFixed(2)}`;
    localStorage.setItem('balance', balance.toString());
}

// LISTENERS
document.getElementById('increase-bet').addEventListener('click', () => { bet = Math.min(bet + 0.5, 1000); betElement.textContent = `Bet: ${bet.toFixed(2)}`; });
document.getElementById('decrease-bet').addEventListener('click', () => { bet = Math.max(bet - 0.5, 0.5); betElement.textContent = `Bet: ${bet.toFixed(2)}`; });
spinButton.addEventListener('click', spin);

window.addEventListener('load', () => {
    const saved = localStorage.getItem('balance');
    balance = saved ? parseFloat(saved) : 10;
    saveGame();
    updateTimer();
});
