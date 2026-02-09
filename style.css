body {
    background-image: url('a0bb6582-2c9e-4c0b-a1a5-98b6382e1826.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-family: 'Segoe UI', sans-serif;
    overflow: hidden;
}

.container {
    display: flex;
    background: rgba(0, 0, 0, 0.85);
    padding: 30px;
    border-radius: 20px;
    border: 3px solid #2e7d32;
    box-shadow: 0 0 30px rgba(46, 125, 50, 0.6);
    color: white;
    gap: 20px;
}

/* Paytable cu animație de Glow */
#paytable { 
    background: rgba(255, 255, 255, 0.05); 
    padding: 15px; 
    border-radius: 12px; 
    min-width: 170px;
    border: 1px solid #2e7d32;
    transition: all 0.5s ease;
}

#paytable.winning-glow {
    box-shadow: 0 0 25px #ffd700;
    border-color: #ffd700;
    transform: scale(1.02);
}

.pay-row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); }
.pay-row span:last-child { color: #ffd700; font-weight: bold; }

/* Slot Reels */
.slot-machine { display: flex; background: #111; padding: 10px; border-radius: 10px; }
.reel { width: 90px; height: 300px; margin: 5px; overflow: hidden; position: relative; border: 1px solid #333; }
.result-symbol { width: 100%; height: 100px; display: flex; justify-content: center; align-items: center; font-size: 45px; }

/* Ploaia de bani */
.coin {
    position: fixed;
    top: -60px;
    font-size: 45px;
    z-index: 9999;
    pointer-events: none;
    animation: fall linear forwards;
}

@keyframes fall { to { transform: translateY(110vh) rotate(720deg); } }

/* Restul controlului */
.main-controls { display: flex; flex-direction: column; gap: 15px; align-items: center; }
button { background: #2e7d32; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; }
button:disabled { background: #444; }

.spinning .reel-inner { animation: scrollReel 2.5s cubic-bezier(0.25, 0.1, 0.25, 1); }
@keyframes scrollReel { 0% { transform: translateY(0); } 100% { transform: translateY(-3000px); } }
