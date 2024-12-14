const chicken = document.getElementById('chicken');
const boulder = document.getElementById('boulder');
const moveButton = document.getElementById('moveButton');
const cashOutButton = document.getElementById('cashOutButton');
const road = document.querySelector('.road');
let statusText = document.getElementById('status');
const loseSound = document.getElementById("loseSound");
const chickenSound = document.getElementById("chickenSound");
const jackpotSound = document.getElementById("jackpotSound");

let position = 0;
let score = 0;
let bet = 0;
let multiplier = 1;
let steps = 0;
let isGameOver = false;
let gameStarted = false;
let chanceOfDeath = 0.33;

function startGame() {
    bet = parseInt(document.getElementById("bet").value, 10);
    if (isNaN(bet) || bet <= 0) {
        alert("Please enter a valid bet amount!");
        return;
    }
    score = bet;
    gameStarted = true;
    toggleBet();
}

function moveChicken() {
    if (!gameStarted || isGameOver) {
        alert("Bet before trying to start the game!");
        return;
    }

    moveButton.disabled = true;

    if (Math.random() < chanceOfDeath) { 
        loseSound.play();
        const offset = (40 / road.clientWidth) * 100; 
        fallAnimation(offset + position);
        setTimeout(() => endGame(bet * (-1)), 1000);
        return;
    }
    
    steps += 1;
    const roadWidth = road.clientWidth;
    const stepSize = (70 / roadWidth) * 100;
    position += stepSize;

    //bounce animacija
    chicken.style.transition = 'left 0.5s, transform 0.3s';
    chicken.style.left = position + '%';
    chicken.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        chicken.style.transform = 'translateY(0px)';
    }, 300);

    multiplier += Math.random() * 1.55; 
    statusText.textContent = `Chicken moved safely! Potential reward: ${multiplier.toFixed(1)}x`;

    if (steps != 10) {
        chickenSound.play();
        setTimeout(() => {
            moveButton.disabled = false;
        }, 1000);
    } else {
        multiplier = 100.2;
        const totalScore = score * multiplier;
        jackpotSound.play();
        setTimeout(() => endGame(totalScore), 1000);
    }
}

function cashOut() {
    if (isGameOver) return;
    const totalScore = score * multiplier;
    showResultModal(`Cash Out!`, `You earned 🥩${totalScore.toFixed(2)}.`);
    statusText.textContent = `You cashed out!`;
    isGameOver = true;
}

function endGame(totalScore) {
    isGameOver = true;
    statusText.textContent = "Game Over!";
    showResultModal(`Game Over!`, `You lost 🥩${Math.abs(totalScore.toFixed(2))}.`);
}

function resetGame() {
    position = 0;
    score = 0;
    multiplier = 1;
    steps = 0;
    isGameOver = false;
    gameStarted = false;
    chanceOfDeath = 0.33;

    const chickenImage = chicken.querySelector('img');
    chicken.style.transition = 'transform 0.3s ease-out';
    chicken.style.transform = 'scale(1)';
    chicken.style.left = position + '%';
    boulder.style.display = "none";

    moveButton.disabled = false;
    cashOut.disabled = false;
    toggleBet();

    statusText.textContent = "Place a bet and move the chicken to start.";
}

function fallAnimation(position) {
    const boulder = document.getElementById('boulder');
    boulder.style.left = position + '%';
    boulder.style.display = 'block';
    boulder.style.animation = 'fall 1s forwards';
    setTimeout(() => {
        const chickenImage = chicken.querySelector('img');
        chicken.style.transition = 'transform 0.3s ease-out';
        chicken.style.transform = 'scale(0.3)';
    }, 550);
}

function showResultModal(title, message) {
    const resultModal = document.createElement("div");
    resultModal.id = "resultModal";
    resultModal.innerHTML = `
        <div class="resultModal-content">
            <span class="close" onclick="closeResultModal()">&times;</span>
            <h2>${title}</h2>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(resultModal);
    resultModal.addEventListener("click", (e) => {
        if (e.target === resultModal) {
            closeResultModal();
        }
    });
}

function closeResultModal(){
    document.body.removeChild(resultModal);
    resetGame();  
}

function toggleBet(){
    const betButton = document.getElementById("start");
    const betInput= document.getElementById("bet");

    const isDisabled = !betButton.disabled;
    betButton.disabled = isDisabled;
    betInput.disabled = isDisabled;

    betButton.classList.toggle("disabled", isDisabled);
    betInput.classList.toggle("disabled", isDisabled);
}


const infoIcon = document.getElementById('info');
const infoModal = document.getElementById('infoModal');
const closeModal = document.getElementById('closeModal');

infoIcon.addEventListener('click', () => {
    infoModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    infoModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === infoModal) {
        infoModal.style.display = 'none';
    }
});