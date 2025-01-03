// USER
let balance = 20000.0;
let userName = 'User';
let totalWin = 0.0;
let totalLoss = 0.0;
let sessionProfit = 0.0;
// ----------------------------

document.querySelector('#username').textContent = userName;
document.querySelector('#usermeat').textContent = balance.toFixed(2);

const bet = document.getElementById('betSize')
const playButton = document.querySelector('#playButton');
const higherButton = document.querySelector('#higherButton');
const lowerButton = document.querySelector('#lowerButton');
const prof = document.querySelector('#prof');
const currentCardPlaceholder = document.querySelector('#currentCard');
const history = document.querySelector('#history');
const loseModal = document.getElementById('loseModal');
const playAgainButton = document.getElementById('playAgainButton');
const cashOutButton = document.getElementById('cashOutButton');
const profitDisplay = document.getElementById('profitInput');

let betAmount;
let currentProfit = 0.0;
let currentCard;
let currentArrow;
var audio = new Audio('media/correct-choice.mp3');
var fail_audio = new Audio('media/fail.wav');
const first = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
const second = ["H", "D", "C", "S"];


playButton.addEventListener('click', () => {
    betAmount = parseFloat(bet.value);
    if (isNaN(betAmount) || betAmount <= 0) {
        alert("Please enter a valid bet amount greater than 0!");
    } else if (balance < betAmount) {
        alert("Not enough balance");
    } else {
        currentProfit = betAmount;
        bet.readOnly = true;
        playButton.style.display = 'none';
        document.getElementById('prof').style.marginTop = '90%';
        higherButton.style.display = 'inline-block';
        lowerButton.style.display = 'inline-block';
        cashOutButton.style.display = 'inline-block';
        profitDisplay.style.display = 'inline-block';
        prof.style.display = 'inline-block';
        cashOutButton.textContent = 'CASH OUT';
        startGame();
    }
    
});

higherButton.addEventListener('click', () => {
    const prevCard = currentCard;
    chooseCard();
    displayCard();
    const win = check(prevCard, "higher");
    if (win) {
        currentArrow = "green_up";
        setTimeout(() => {
            audio.play();
        }, 1300);
    } else {
        currentArrow = "red_up";
        setTimeout(() => {
            fail_audio.play();
            showLoseModal();
        }, 2000);
    }
    setTimeout(() => {
        profitDisplay.value = '\u{1F969}' + currentProfit.toFixed(2);
        displayHistory();
    }, 1300);
});  

lowerButton.addEventListener('click', () => {
    const prevCard = currentCard;
    chooseCard();
    displayCard();
    const win = check(prevCard, "lower");
    if (win) {
        currentArrow = "green_down";
        setTimeout(() => {
            audio.play();
        }, 1000);
    } else {
        currentArrow = "red_down";
        setTimeout(() => {
            fail_audio.play();
            showLoseModal();
        }, 2000);
    }
    setTimeout(() => {
        profitDisplay.value = '\u{1F969}' + currentProfit.toFixed(2);
        displayHistory();
    }, 1300)
});


function startGame() { 
    chooseCard();
    displayCard();
    setTimeout(() => {
        displayHistory();
    }, 1300)
}

function chooseCard() {
    const randomFirst = first[Math.floor(Math.random() * first.length)];
    const randomSecond = second[Math.floor(Math.random() * second.length)];
    
    currentCard = `${randomFirst}${randomSecond}`;
    console.log(currentCard);
}

function displayCard() {
    const oldCard = currentCardPlaceholder.querySelector('img');
    const img = document.createElement('img');
    img.src = `media/poker_cards/${currentCard}.svg`;
    img.alt = 'Current Card';
    currentCardPlaceholder.appendChild(img);
    img.addEventListener('animationend', () => {
        if (oldCard) {
            oldCard.remove();
        }
    });
}

function displayHistory() {
    const cards = history.querySelectorAll('.card');
    if (cards.length >= 5) {
        history.removeChild(cards[0]);
        const arrows = history.querySelectorAll('.arrow');
        history.removeChild(arrows[0]);
    }
    const img = document.createElement('img');
    img.src = `media/poker_cards/${currentCard}.svg`;
    img.classList.add('card');
    img.alt = 'Previous Card';
    if (cards.length > 0) {
        const arrow = document.createElement('img');
        arrow.src = `media/arrows/${currentArrow}.svg`; 
        arrow.alt = 'Arrow';
        arrow.classList.add('arrow');
        history.appendChild(arrow);
    }
    history.appendChild(img);
}

function check(prevCard, choosenDirection) {   // direction se ujema z current card
    let direction;
    const idx = first.indexOf(prevCard[0]);
    const idx2 = first.indexOf(currentCard[0]);
    if (idx == idx2) {
        direction = choosenDirection;
    } else if (idx < idx2) {
        direction = "higher";
    } else {
        direction = "lower";
    }
    let factor;
    if (direction === choosenDirection) {
        if (choosenDirection === "higher") {
            factor = 1 - (first.length - idx - 1) / first.length;
        } else {
            factor = 1 - idx / first.length;
        }
        currentProfit *= (1 + factor);
        console.log("current profit: " + currentProfit);
        return true;
    }
    return false;
    
}

// LOSE
function showLoseModal() {
    totalLoss += betAmount;
    balance -= betAmount;
    loseModal.style.display = 'block';

    document.querySelector('#usermeat').textContent = balance.toFixed(2);

    document.querySelector('#loseModal .modal-content h2').textContent = "You Lose";
    document.querySelector('#loseModal .modal-content p').textContent = `You lost ${betAmount}\u{1F969}`;
}
playAgainButton.addEventListener('click', () => {
    currentProfit = 0.0;
    profitDisplay.value = '\u{1F969}' + currentProfit.toFixed(2);
    bet.readOnly = false;

    loseModal.style.display = 'none';
    playButton.style.display = 'inline-block';
    higherButton.style.display = 'none';
    lowerButton.style.display = 'none';
    cashOutButton.textContent = 'EXIT';
    profitDisplay.style.display = 'none';
    prof.style.display = 'none';

    while (history.firstChild) {
        history.removeChild(history.firstChild);
    }
    while (currentCardPlaceholder.firstChild) {
        currentCardPlaceholder.removeChild(currentCardPlaceholder.firstChild);
    }
});
document.getElementById('exit').addEventListener('click', () => {
    sessionProfit = totalWin - totalLoss;
    
    console.log(sessionProfit);
    console.log(totalWin);
    console.log(totalLoss);
});

// WIN
cashOutButton.addEventListener('click', () => {
    if (cashOutButton.textContent === 'EXIT') {
        //SHRANI V BAZO
        console.log('RELOAD'); 
    } else {
        if (currentProfit == betAmount) {
            currentProfit = 0.0;
            profitDisplay.value = '\u{1F969}' + currentProfit.toFixed(2);
        }
        totalWin += currentProfit;
        balance += currentProfit;
        document.querySelector('#usermeat').textContent = balance.toFixed(2);
        document.querySelector('#loseModal .modal-content h2').textContent = "You Cashed Out";
        document.querySelector('#loseModal .modal-content p').textContent = `You got ${currentProfit.toFixed(2)}\u{1F969}`;
        loseModal.style.display = 'block';
    }
    
});
