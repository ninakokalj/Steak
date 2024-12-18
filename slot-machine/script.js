document.querySelector('#username').textContent = "ninakok";
document.querySelector('#usermeat').textContent = "20.000";

const msg = document.querySelector('.message');
const currentProfitInput = document.querySelector('#profitInput');
let betAmount;
let currentProfit = 0.0;
let freeRoll = false;

const icon_width = 150,
    icon_height = 150,
    num_icons = 9,
    time_per_icon = 100,
    indexes = [0, 0, 0];
const rollButton = document.querySelector('.roll');

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

        // Add event listener to handle transition end
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
            msg.classList.add('blink');
            currentProfitInput.value = '\u{1F969}' + currentProfit.toFixed(2);
            setTimeout(() => {
                msg.classList.remove('blink');
            }, 1500);
        })
}

rollButton.addEventListener("click", () => {
    betAmount = parseFloat(document.getElementById('betSize').value);
    if (isNaN(betAmount) || betAmount <= 0) {
        msg.textContent = 'Please enter a bet amount';
        // pogledam če ma dost na računu
    } else {
        
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
    } else {
        msg.textContent = 'NO WIN';
        if (deduct) {
            currentProfit -= betAmount;
        }
    }

    rollButton.textContent = freeRoll ? "FREE ROLL" : "ROLL";
    

}
function checkWin(element) {
    if (element === 1) { // 7 7 7
        msg.textContent = 'JACKPOT';
        currentProfit += betAmount * 100;
    } else if (element === 5) { // bell bell bell
        msg.textContent = 'YOU WIN';
        currentProfit += betAmount * 10;
    } else if (element === 6) {  // BAR BAR BAR
        msg.textContent = 'YOU WIN';
        currentProfit += betAmount * 20;
    } else {    // fruit fruit fruit
        msg.textContent = 'YOU WIN';
        currentProfit += betAmount * 3;
    }
}
function checkForFreeRoll(indexes) {
    freeRoll = indexes.includes(5);
}

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