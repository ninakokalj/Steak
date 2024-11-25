const urlParams = new URLSearchParams(window.location.search);
const betAmount = urlParams.get('money_bet');
console.log(betAmount);

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
        })
}

rollButton.addEventListener("click", rollAll);

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