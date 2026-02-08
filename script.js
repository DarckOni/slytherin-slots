// Inițializare Discord SDK
const discordSdk = window.discordSdk ? new window.discordSdk.DiscordSDK({
    client_id: "ID_UL_APLICATIEI_TALE_DIN_PORTAL", 
}) : null;

const reels = document.querySelectorAll('.reel');
const spinButton = document.getElementById('spin-button');
const resultElement = document.getElementById('result');
const balanceElement = document.getElementById('balance');
const betElement = document.getElementById('bet');
const increaseBetButton = document.getElementById('increase-bet');
const decreaseBetButton = document.getElementById('decrease-bet');
const collectButton = document.getElementById('collect-button');

// --- AUDIO PENTRU GITHUB/DISCORD ---
// Acum scriptul caută fișierele direct în folderul unde se află index.html
const audioSpin = new Audio('spin.mp3');
const audioWin = new Audio('Castig.mp3');
const audioBetUp = new Audio('Betup.mp3');
const audioBetDown = new Audio('Betd.mp3');

audioSpin.loop = true;

const symbols = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍋', '💎', '💰'];
let balance = 10;
let bet = 0.50;

// Logica de pariuri
function updateBalanceUI() {
    balanceElement.textContent = `Balance: ${balance.toFixed(2)}`;
    localStorage.setItem('balance', balance);
}

function increaseBet() {
    if (bet < 1000) {
        audioBetUp.currentTime = 0;
        audioBetUp.play().catch(() => {});
        bet += 0.50;
        betElement.textContent = `Bet: ${bet.toFixed(2)}`;
    }
}

function decreaseBet() {
    if (bet > 0.50) {
        audioBetDown.currentTime = 0;
        audioBetDown.play().catch(() => {});
        bet -= 0.50;
        betElement.textContent = `Bet: ${bet.toFixed(2)}`;
    }
}

async function spin() {
    if (balance < bet) {
        resultElement.textContent = "Not enough balance!";
        return;
    }

    audioSpin.currentTime = 0;
    audioSpin.play().catch(() => {});

    balance -= bet;
    updateBalanceUI();

    // ... (restul logicii tale de spinAllReels pe care am făcut-o anterior) ...
    // La finalul spin-ului, nu uita:
    // audioSpin.pause();
    // Dacă câștigă: audioWin.play();
}

// Event Listeners
increaseBetButton.addEventListener('click', increaseBet);
decreaseBetButton.addEventListener('click', decreaseBet);
spinButton.addEventListener('click', spin);

// Încărcare date salvate
window.addEventListener('load', () => {
    const saved = localStorage.getItem('balance');
    if (saved) balance = parseFloat(saved);
    updateBalanceUI();
});
