// script.js

const reels = document.querySelectorAll('.reel');
const spinButton = document.getElementById('spin-button');
const resultElement = document.getElementById('result');
const balanceElement = document.getElementById('balance');
const betElement = document.getElementById('bet');
const increaseBetButton = document.getElementById('increase-bet');
const decreaseBetButton = document.getElementById('decrease-bet');
const gameContainer = document.getElementById('game-container');
const collectButton = document.getElementById('collect-button');

// --- DECLARARE SUNETE ---
const audioSpin = new Audio('spin.mp3');
const audioWin = new Audio('Castig.mp3');
const audioBetUp = new Audio('Betup.mp3');
const audioBetDown = new Audio('Betd.mp3');

// Configurări audio
audioSpin.loop = true; // Sunetul de spin va rula în buclă până la oprire

const symbols = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍋', '💎', '💰'];
let balance = 10;
let bet = 0.50;
const minBet = 0.50;
const maxBet = 1000;
let collectAvailable = true; 
let collectTimeout; 

function saveGameData(balance) {
    localStorage.setItem('balance', balance.toString());
}

function loadGameData() {
    const savedBalance = localStorage.getItem('balance');
    if (savedBalance) {
        balance = parseFloat(savedBalance);
        balanceElement.textContent = `Balance: ${balance.toFixed(2)}`;
    } else {
        balance = 10; 
        balanceElement.textContent = `Balance: ${balance.toFixed(2)}`;
    }
}

function showGameInterface() {
    gameContainer.style.display = 'block';
    loadGameData();
    checkCollectAvailability();
}

function collectCredits() {
    if (collectAvailable) {
        balance += 100;
        balanceElement.textContent = `Balance: ${balance.toFixed(2)}`;
        saveGameData(balance);
        collectAvailable = false;
        collectButton.disabled = true;
        collectButton.textContent = "Collect (30:00)";

        collectTimeout = setTimeout(() => {
            collectAvailable = true;
            collectButton.disabled = false;
            collectButton.textContent = "Collect";
        }, 30 * 60 * 1000);

        let timeLeft = 30 * 60; 
        let timerInterval = setInterval(() => {
            timeLeft--;
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            collectButton.textContent = `Collect (${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')})`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                collectButton.textContent = "Collect";
            }
        }, 1000);
    }
}

function checkCollectAvailability() {
    if (collectTimeout) {
        clearTimeout(collectTimeout);
    }
    collectAvailable = true;
    collectButton.disabled = false;
    collectButton.textContent = "Collect";
}

// --- MODIFICARE PARIURI CU SUNET ---
function increaseBet() {
    if (bet < maxBet) {
        audioBetUp.currentTime = 0;
        audioBetUp.play();
        bet = Math.min(bet + 0.50, maxBet);
        betElement.textContent = `Bet: ${bet.toFixed(2)}`;
    }
}

function decreaseBet() {
    if (bet > minBet) {
        audioBetDown.currentTime = 0;
        audioBetDown.play();
        bet = Math.max(bet - 0.50, minBet);
        betElement.textContent = `Bet: ${bet.toFixed(2)}`;
    }
}

function spin() {
    if (balance < bet) {
        resultElement.textContent = "Not enough balance!";
        return;
    }

    // Start sunet SPIN
    audioSpin.currentTime = 0;
    audioSpin.play();

    balance -= bet;
    balanceElement.textContent = `Balance: ${balance.toFixed(2)}`;

    const results = [[], [], []];
    const willWin = Math.random() < 0.20; 

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            results[row][col] = symbols[Math.floor(Math.random() * symbols.length)];
        }
    }

    async function spinReel(reel, index) {
        return new Promise(resolve => {
            reel.innerHTML = '';
            const reelInner = document.createElement('div');
            reelInner.classList.add('reel-inner');
            for (let i = 0; i < 50; i++) {
                const symbol = document.createElement('div');
                symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                reelInner.appendChild(symbol);
            }
            reel.appendChild(reelInner);
            reel.classList.add('spinning');
            setTimeout(() => {
                reel.classList.remove('spinning');
                reel.innerHTML = '';
                for (let i = 0; i < 3; i++) {
                    const symbol = document.createElement('div');
                    symbol.textContent = results[i][index];
                    symbol.style.top = `${i * 100}px`;
                    symbol.classList.add('result-symbol');
                    reel.appendChild(symbol);
                }
                resolve();
            }, 250 + index * 125);
        });
    }

    async function spinAllReels() {
        for (let i = 0; i < reels.length; i++) {
            await spinReel(reels[i], i);
        }

        // --- OPRIRE SUNET SPIN ---
        audioSpin.pause();

        let winnings = calculateWinnings(results);
        balance += winnings;
        balanceElement.textContent = `Balance: ${balance.toFixed(2)}`;

        if (winnings > 0) {
            resultElement.textContent = `You won ${winnings.toFixed(2)}!`;
            // --- REDARE SUNET CÂȘTIG ---
            audioWin.currentTime = 0;
            audioWin.play();
        } else {
            resultElement.textContent = "You lost.";
        }

        saveGameData(balance);
    }

    function calculateWinnings(results) {
        let winnings = 0;
        if (willWin) {
            const winningRow = Math.floor(Math.random() * 3);
            const winningSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            results[winningRow][0] = winningSymbol;
            results[winningRow][1] = winningSymbol;
            results[winningRow][2] = winningSymbol;
            if (winningSymbol === '💎') {
                winnings += bet * 20;
            } else {
                winnings += bet * 5; 
            }
        }
        return winnings;
    }
    spinAllReels();
}

increaseBetButton.addEventListener('click', increaseBet);
decreaseBetButton.addEventListener('click', decreaseBet);
spinButton.addEventListener('click', spin);
collectButton.addEventListener('click', collectCredits);

window.addEventListener('load', function() {
    showGameInterface();
});
