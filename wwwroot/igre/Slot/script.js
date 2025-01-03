// USER
let balance = 20000.0;
let userName = 'User';
let totalWin = 0.0;
let totalLoss = 0.0;
let sessionProfit = 0.0;
// ----------------------------

document.querySelector('#username').textContent = userName;
document.querySelector('#usermeat').textContent = balance.toFixed(2);

const msg = document.querySelector('.message');
const currentProfitInput = document.querySelector('#profitInput');
const slots = document.querySelector('.slots');
const rollButton = document.querySelector('.roll');

let betAmount;
let currentProfit = 0.0;
let freeRoll = false;

var clickAudio = new Audio('media/click.mp3');
var jackpotAudio = new Audio('media/jackpot.wav');
var fruitAudio = new Audio('media/fruit_win.wav');
var freeRollAudio = new Audio('media/free_roll.wav');
var endAudio = new Audio('media/end_game.wav');

const icon_width = 150,
    icon_height = 150,
    num_icons = 9,
    time_per_icon = 100,
    indexes = [0, 0, 0];


const roll = (reel, offset = 0) => {
    const delta = (offset + 2) * num_icons + Math.round(Math.random() * num_icons);
    const style = getComputedStyle(reel),
        backgroundPositionY = parseFloat(style["background-position-y"]),
        targetBackgroundPositionY = backgroundPositionY + delta * icon_height,
        normTargetBackgroundPositionY = targetBackgroundPositionY%(num_icons * icon_height);

    return new Promise((resolve, reject) => {
        reel.style.transition = `background-position-y ${8 + delta * time_per_icon}ms`;
        reel.style.backgroundPositionY = `${targetBackgroundPositionY}px`;
    
        const onTransitionEnd = () => {
            reel.removeEventListener('transitionend', onTransitionEnd); 
            reel.style.transition = 'none';
            reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;

            resolve(delta % num_icons);
        };

        reel.addEventListener('transitionend', onTransitionEnd);
  
        
    })
    
};

function rollAll() {
    const reelsList = document.querySelectorAll('.slots > .reel');

    Promise
        .all([... reelsList].map((reel, i) => roll(reel, i)))
        .then((deltas) => {
            deltas.forEach((delta, i) => indexes[i] = (indexes[i] + delta) % num_icons )
            console.log(indexes);
            // check wins
            checkWins(indexes);
        })
}

rollButton.addEventListener("click", () => {
    betAmount = parseFloat(document.getElementById('betSize').value);
    if (isNaN(betAmount) || betAmount <= 0) {
        msg.textContent = 'Please enter a bet amount';
    } else if (balance < betAmount) {
        msg.textContent = 'Not enough balance';        
    } else {
        clickAudio.play();
        rollAll();
    }
});

function checkWins(indexes) {
    const deduct = !freeRoll;
    checkForFreeRoll(indexes);
    if (indexes.every(element => element === indexes[0])) {
        checkWin(indexes[0]);
    } else if (indexes.includes(6) && (indexes[0] === indexes[1] || indexes[0] === indexes[2] || indexes[1] === indexes[2])) {
        checkWin(indexes.find(element => element !== 6));
    } else if (fruitNbellCheck(indexes)) {
        fruitBellWin();
    } else {
        msg.textContent = 'NO WIN';
        msg.classList.add('no-win');
        setTimeout(() => {
            msg.classList.remove('no-win');
        }, 2500);
        if (freeRoll) {
            freeRollAudio.play();
            setTimeout(() => {
                freeRollAudio.pause();
                freeRollAudio.currentTime = 0;
            }, 3000);
        }
    }
    if (deduct) {
        balance -= betAmount;
        currentProfit -= betAmount;
        totalLoss += betAmount;
    }
    rollButton.textContent = freeRoll ? "FREE ROLL" : "ROLL";
    currentProfitInput.value = '\u{1F969}' + currentProfit.toFixed(2);
    document.querySelector('#usermeat').textContent = balance.toFixed(2);

}
function checkWin(element) {
    
    if (element === 1) { // 7 7 7
        jackpotWin();
    } else if (element === 5) { // bell bell bell
        bellWin();
    } else if (element === 6) {  // BAR BAR BAR
        barWin();
    } else {    // fruit fruit fruit
        fruitWin();
    }
    
}
function checkForFreeRoll(indexes) {
    freeRoll = indexes.includes(5);
}

function jackpotWin() {
    currentProfit += betAmount * 100;
    totalWin += betAmount * 100;
    balance += betAmount * 100;

    msg.textContent = 'JACKPOT';
    msg.classList.add('jackpot');
    slots.classList.add('jackpot-glow');
    jackpotAudio.play();
    setTimeout(() => {
        slots.classList.remove('jackpot-glow');
        jackpotAudio.pause();
        jackpotAudio.currentTime = 0;
        msg.classList.remove('jackpot');
    }, 4700);
}
function fruitWin() {
    currentProfit += betAmount * 10;
    totalWin += betAmount * 10;
    balance += betAmount * 10;

    msg.textContent = 'YOU WIN';
    msg.classList.add('fruit');
    slots.classList.add('fruit-glow');
    fruitAudio.play();
    setTimeout(() => {
        slots.classList.remove('fruit-glow');
        fruitAudio.pause();
        fruitAudio.currentTime = 0;
        msg.classList.remove('fruit');
    }, 4500);
}
function barWin() {
    currentProfit += betAmount * 50;
    totalWin += betAmount * 50;
    balance += betAmount * 50;

    msg.textContent = 'YOU WIN !!!';
    msg.classList.add('bars');
    slots.classList.add('bar-glow');
    fruitAudio.play();
    setTimeout(() => {
        slots.classList.remove('bar-glow');
        fruitAudio.pause();
        fruitAudio.currentTime = 0;
        msg.classList.remove('bars');
    }, 4500);
}
function bellWin() {
    currentProfit += betAmount * 30;
    totalWin += betAmount * 30;
    balance += betAmount * 30;

    msg.textContent = 'YOU WIN !!';
    msg.classList.add('bells');
    slots.classList.add('bell-glow');
    fruitAudio.play();
    setTimeout(() => {
        slots.classList.remove('bell-glow');
        fruitAudio.pause();
        fruitAudio.currentTime = 0;
        msg.classList.remove('bells');
    }, 4500);
}
function fruitBellWin() {
    currentProfit += betAmount * 20;
    totalWin += betAmount * 20;
    balance += betAmount * 20;

    msg.textContent = 'YOU WIN !';
    msg.classList.add('fb');
    slots.classList.add('fb-glow');
    fruitAudio.play();
    setTimeout(() => {
        slots.classList.remove('fb-glow');
        fruitAudio.pause();
        fruitAudio.currentTime = 0;
        msg.classList.remove('fb');
    }, 4500);
}
function fruitNbellCheck(indexes) {
    fruitIndexes = [0, 2, 3, 4, 7, 8];
    const filteredIndexes = indexes.filter(index => index !== 5);
    if (    // če je en sam bell
        filteredIndexes.length === 2
    ) {
        if (filteredIndexes[0] === filteredIndexes[1] && fruitIndexes.includes(filteredIndexes[0])) {
            return true;
        } else if ( // če bar simbol zamenja sadje
            (filteredIndexes[0] === 6 && fruitIndexes.includes(filteredIndexes[1])) ||
            (filteredIndexes[1] === 6 && fruitIndexes.includes(filteredIndexes[0]))) {
                return true;
        }
    }

    return false;
}

document.querySelector('#exit').addEventListener('click', () => {
    sessionProfit = currentProfit;
    endAudio.play();
    // let balance 
    // let totalWin
    // totalLoss
    // sessionProfit
    // redirect
    console.log(sessionProfit);
    console.log(totalWin);
    console.log(totalLoss);
})
/*
banana -> 0
seven -> 1
cherry -> 2
plum -> 3
orange -> 4
bell -> 5
bar -> 6
lemon -> 7
watermelon -> 8
*/