
//-----------------logika igre-------------------------

//globalne spremenljivke
let score;
let bet;
let chanceOfDeath;
let isGameOver; 
let gameStarted;
let isDoorLocked = false;

//za bazo spremeljivke
let totalWin;
let totalLoss;
let sessionProfit;
let balance;
let username;

//exit
const exitButton = document.getElementById("exit");
exitButton.addEventListener("click", () => {
    // ---------tomi------------- 
});

//toggle za bet
function toggleBet(){
    const betButton = document.getElementById("betButton");
    const betInput= document.getElementById("bet");

    const isDisabled = !betButton.disabled;
    betButton.disabled = isDisabled;
    betInput.disabled = isDisabled;

    betButton.classList.toggle("disabled", isDisabled);
    betInput.classList.toggle("disabled", isDisabled);
}

//init
function startGame() {
    //resetiraj
    score = 0;
    chanceOfDeath = 0;
    isGameOver = false;
    gameStarted = false;
    isDoorLocked = false;
    document.querySelectorAll('.door').forEach(door => {
        if (door.id !== "emergency") {
            const img = door.querySelector('img');
            img.src = "media/closed-door.png";
            img.alt = "Closed Door";

            const number = door.querySelector('.behind-door');
            number.style.display = "none";
        }
    });
    toggleBet();
    
    //inicializiraj
    bet = parseInt(document.getElementById("bet").value, 10);
    if (isNaN(bet) || bet <= 0) {
        alert("Please enter a valid bet amount!");
        return;
    }
    score = bet;
    isGameOver = false;
    gameStarted = true;
    document.getElementById('message').querySelector('p').textContent = `Current Score: ${score}.`;
}

// odpri vrata in prikaži usodo igralca
function openDoor(doorNumber) {
    if (!gameStarted || isGameOver) {
        alert("Bet before trying to start the game!");
        return;
    }

    if (isDoorLocked) return;

    const door = document.getElementById(`door${doorNumber}`);
    const img = door.querySelector('img');
    const number = document.getElementById(`number${doorNumber}`);
    const survived = Math.random();
    const winSound = document.getElementById("winSound");
    const loseSound = document.getElementById("loseSound");
    const bombSound = document.getElementById("bombSound");

    isDoorLocked = true;
    img.src = "media/open-door.png";
    img.alt = "Open Door";

    let randomNumber = 0.0;
    let outcome;
    let randomOperation;

    switch (doorNumber) {
        case 1: // Low Risk
            chanceOfDeath = 0.2; 
            randomOperation = Math.random() < 0.7 ? "+" : "-"; // pogosteje +
            break;
        case 2: // Moderate Risk
            chanceOfDeath = 0.3; 
            randomOperation = Math.random() < 0.4 ? "+" : (Math.random() < 0.7 ? "×" : (Math.random() < 0.55 ?  "-" : "÷"));
            break;
        case 3: // High Risk
            chanceOfDeath = 0.4; 
            randomOperation = Math.random() < 0.7 ? "×" : "÷"; // samo × in ÷
            break;
        default:
            alert("Invalid door selected!");
            return;
    }

    if (survived < chanceOfDeath) {
        number.textContent = "💣";
        number.style.display = "block";
        score = bet *(-1); // izguba bet
        bombSound.play();
        document.body.style.backgroundColor = "#880808";
        setTimeout(() => {
            document.body.style.backgroundColor = ""; 
        }, 500);
        setTimeout(() => {
            resetState(doorNumber);
            isDoorLocked = false;
        }, 1500);
        setTimeout(() => endGame("You hit a bomb! Game over."), 1500);
        return;
    }

    if (chanceOfDeath > 1.0) {
        chanceOfDeath = 1.0; 
    }

    switch (randomOperation) {
        case "+":
            randomNumber = Math.floor(Math.random() * 25) + 1; //od 1 do 25
            outcome = `+ ${randomNumber}`;
            score += randomNumber;
            number.style.color = 'green';
            winSound.play();
            break;
        case "-":
            randomNumber = Math.floor(Math.random() * 25) + 1; //od 1 do 25
            outcome = `- ${randomNumber}`;
            score -= randomNumber;
            number.style.color = 'red';
            loseSound.play();
            break;
        case "×":
            randomNumber = Math.random() * 5 + 1; //od 1.00 do 6.00
            randomNumber = Math.round(randomNumber * 100) / 100; // 2 decimalki
            outcome = `× ${randomNumber}`;
            score *= randomNumber;
            score = Math.round(score * 100) / 100; 
            number.style.color = 'green';
            winSound.play();
            break;
        case "÷":
            randomNumber = Math.random() * 5 + 1; //od 1.00 do 6.00
            randomNumber = Math.round(randomNumber * 100) / 100; // 2 decimalki
            outcome = `÷ ${randomNumber}`;
            score /= randomNumber;
            score = Math.round(score * 100) / 100; 
            number.style.color = 'red';
            loseSound.play();
            break;

    }

    number.textContent = outcome;
    number.style.display = "block";
    document.getElementById('message').querySelector('p').textContent = `Current Profit: 🥩${score}.`;
    setTimeout(() => {
        resetState(doorNumber);
        isDoorLocked = false;
    }, 1500);

}

function resetState(doorNumber) {
    const door = document.getElementById(`door${doorNumber}`);
    const img = door.querySelector('img');
    const number = document.getElementById(`number${doorNumber}`);

    // odprta vrata zapri
    img.src = "media/closed-door.png";
    img.alt = "Closed Door";
    number.style.display = "none";

    document.getElementById('message').querySelector('p').textContent = `Current profit: 🥩${score}.`;
}

function endGame(message) {
    isGameOver = true;
    document.getElementById('message').querySelector('p').textContent = message;
    showResultModal(`Game Over!`, `You lost 🥩${Math.abs(score)}.`);
}

function cashOut() {
    if (gameStarted){
    const jacpotSound = document.getElementById("jackpotSound");
    document.body.style.backgroundColor = "#90EE90";
    jacpotSound.play();
    setTimeout(() => {
        document.body.style.backgroundColor = ""; 
    }, 500);

    setTimeout(() => {
        showResultModal(`Cash Out!`, `You earned 🥩${score}.`)
    }, 1500);
 }
 return;
}

//-------------info modal--------------------
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
    toggleBet();
    document.getElementById('message').querySelector('p').textContent = `>Welcome! Place your bet to start the game.`;
}
