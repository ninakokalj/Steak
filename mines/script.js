let balance = 20;
let startingBalance = balance;
let currentBet = 0;
document.querySelector('#username').textContent = "jan";
document.getElementById('usermeat').textContent = balance.toFixed(2);

let totalWin = 0;
let totalLoss = 0;

const gridElement = document.getElementById("grid");
const minesInput = document.getElementById("mines");
const betSizeInput = document.getElementById("betSize");
const startButton = document.getElementById("start");
const cashoutButton = document.getElementById("cashout");
const profitInput = document.getElementById("profitInput");
const exitButton = document.getElementById("exit");

exitButton.addEventListener("click", () => {
    const sessionProfit = balance - startingBalance;
    console.log(`Session Profit/Loss: $${sessionProfit.toFixed(2)}`);
    //window.location.href = "mainmenu.html"; // Redirect to mainmenu.html
});

const SIZE = 5; // 5x5 grid
let minePositions = [];
let revealedCells = 0;
let betSize = 0;
let currentProfit = 0;

const sounds = {
    start: "media/start.mp3",
    cashout: "media/cashout.mp3",
    emerald: "media/emerald.mp3",
    mine: "media/mine.mp3"
};

function playSound(sound) {
    const audio = new Audio(sound);
    audio.play();
}

// https://stakecommunity.com/topic/77099-mines-multipliers/
const multipliers = [
    [1.01, 1.08, 1.12, 1.18, 1.24, 1.30, 1.37, 1.46, 1.55, 1.65, 1.77, 1.99, 2.06, 2.25, 2.47, 2.75, 3.09, 3.54, 4.12, 4.95, 6.19, 8.25, 12.38, 24.75],
    [1.08, 1.17, 1.29, 1.41, 1.56, 1.74, 1.94, 2.18, 2.47, 2.83, 3.26, 3.81, 4.50, 5.40, 6.60, 8.25, 10.61, 14.14, 19.80, 29.70, 49.50, 99.00, 297.00],
    [1.12, 1.29, 1.48, 1.71, 2.00, 2.35, 2.79, 3.35, 4.07, 5.00, 6.26, 7.96, 10.35, 13.80, 18.97, 27.11, 40.66, 65.06, 113.9, 227.7, 569.3, 2277],
    [1.18, 1.41, 1.71, 2.09, 2.58, 3.23, 4.09, 5.26, 6.88, 9.17, 12.51, 17.52, 25.3, 37.95, 59.64, 99.39, 178.9, 357.8, 834.9, 2504, 12523],
    [1.24, 1.56, 2.00, 2.58, 3.39, 4.52, 6.14, 8.5, 12.04, 17.52, 26.27, 40.87, 66.41, 113.9, 208.7, 417.5, 939.3, 2504, 8766, 52598],
    [1.30, 1.74, 2.35, 3.23, 4.52, 6.46, 9.44, 14.17, 21.89, 35.03, 58.38, 102.17, 189.75, 379.50, 834.90, 2087, 6261, 25047, 175329],
    [1.37, 1.94, 2.79, 4.09, 6.14, 9.44, 14.95, 24.47, 41.60, 73.95, 138.66, 277.33, 600.87, 1442, 3965, 13219, 59486, 475893],
    [1.46, 2.18, 3.35, 5.26, 8.50, 14.17, 24.47, 44.05, 83.20, 166.40, 356.56, 831.98, 2163, 6489, 23794, 118973, 1070759],
    [1.55, 2.47, 4.07, 6.88, 12.04, 21.89, 41.60, 83.20, 176.80, 404.10, 1010, 2828, 9193, 36773, 202254, 2022545],
    [1.65, 2.83, 5.00, 9.17, 17.52, 35.03, 73.95, 166.40, 404.10, 1077, 3232, 11314, 49031, 294188, 3236072],
    [1.77, 3.26, 6.26, 12.51, 26.77, 58.38, 138.66, 356.56, 1010, 3232, 12123, 56574, 367735, 4412826],
    [1.90, 3.81, 7.96, 17.52, 40.87, 102.17, 277.33, 831.98, 2828, 11314, 56574, 396022, 5148297],
    [2.06, 4.50, 10.35, 25.30, 66.41, 189.75, 600.87, 2163, 9193, 49031, 367735, 5148297],
    [2.25, 5.4, 13.80, 37.95, 113.85, 379.50, 1442, 6489, 36773, 294188, 4412826],
    [2.47, 6.60, 18.97, 59.64, 208.72, 834.90, 3965, 23794, 202254, 3236072],
    [2.75, 8.25, 27.11, 99.39, 417.45, 2087, 13219, 118973, 2022545],
    [3.09, 10.61, 40.66, 178.91, 939.26, 6261, 59486, 1070759],
    [3.54, 14.14, 65.06, 357.81, 2504, 25047, 475893],
    [4.12, 19.80, 113.85, 834.90, 8768, 175329],
    [4.95, 29.70, 227.70, 2504],
    [6.19, 49.50, 569.30],
    [8.25, 99, 2277],
    [12.37, 297],
    [24.75]
];

// init grid

for (let i = 0; i < SIZE * SIZE; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.classList.add("revealed"); // not clickable
    cell.style.backgroundColor = "#ccc";
    cell.dataset.index = i;
    gridElement.appendChild(cell);
}


function startGame() {
    const numMines = parseInt(minesInput.value);
    betSize = parseFloat(betSizeInput.value);

    if (isNaN(numMines) || numMines < 1 || numMines > 24) {
        alert("Enter a valid number of mines (1 to 24).");
        return;
    }
    if (isNaN(betSize) || betSize <= 0) {
        alert("Enter a valid bet size greater than $0.00.");
        return;
    }

    if (betSize > balance) {
        alert("Insufficient balance to place this bet.");
        return;
    }

    playSound(sounds.start);

    balance -= betSize;
    document.getElementById('usermeat').textContent = balance.toFixed(2);

    // disable inputs while game is active
    minesInput.classList.add("disabled");
    betSizeInput.classList.add("disabled");
    profitInput.classList.remove("disabled");
    startButton.disabled = true;

    // reset game
    gridElement.innerHTML = "";
    minePositions = [];
    revealedCells = 0;
    currentProfit = 0;
    cashoutButton.disabled = true;
    cashoutButton.style.display = 'inline-block';
    profitInput.style.display = 'inline-block'; // show  profit field
    profitInput.value = "0.00 (0.0x)";

    // generate mine positions
    while (minePositions.length < numMines) {
        const position = Math.floor(Math.random() * SIZE * SIZE);
        if (!minePositions.includes(position)) {
            minePositions.push(position);
        }
    }

    // create grid
    for (let i = 0; i < SIZE * SIZE; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", () => revealCell(cell, i));
        gridElement.appendChild(cell);
    }
}

function revealCell(cell, index) {
    if (cell.classList.contains("revealed")) return;

    cell.classList.add("revealed");
    const content = document.createElement("div");
    
    if (minePositions.includes(index)) {
        playSound(sounds.mine);
        cell.classList.add("mine");
        content.textContent = "💣";
        content.classList.add("mine");
        cell.appendChild(content);
        totalLoss += betSize;
        console.log(`Total Wins: $${totalWin.toFixed(2)}`);
        console.log(`Total Losses: $${totalLoss.toFixed(2)}`);
        endGame(false);
    } else {
        playSound(sounds.emerald);
        cell.classList.add("emerald");
        content.textContent = "💎";
        content.classList.add("emerald");
        cell.appendChild(content);
        revealedCells++;
        updateProfit();
        if (revealedCells === SIZE * SIZE - minePositions.length) {
            endGame(true);
        }
    }
}

function updateProfit() {
    const numMines = parseInt(minesInput.value);
    const multiplierRow = multipliers[numMines - 1];
    if (revealedCells - 1 < multiplierRow.length) {
        const currentMultiplier = multiplierRow[revealedCells - 1];
        currentProfit = betSize * currentMultiplier;
        cashoutButton.disabled = false;
        profitInput.value = `${currentProfit.toFixed(2)} (${currentMultiplier.toFixed(2)}x)`;
    } else {
        alert("No multiplier available for this many revealed cells!");
    }
}

function endGame(won) {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
        cell.classList.add("revealed");
        cell.removeEventListener("click", () => revealCell(cell, index));
        if (minePositions.includes(index)) {
            cell.classList.add("mine");
            cell.textContent = "💣";
        }
    });
    cashoutButton.disabled = true;

    if (won) totalWin += currentProfit - betSize;
    console.log(`Total Wins: $${totalWin.toFixed(2)}`);
    console.log(`Total Losses: $${totalLoss.toFixed(2)}`);

    // enable inputs after game ends
    minesInput.classList.remove("disabled");
    betSizeInput.classList.remove("disabled");
    profitInput.classList.remove("disabled");
    startButton.disabled = false;
}

function cashOut() {
    playSound(sounds.cashout); // Play cashout sound
    setTimeout(() => {
        alert(`You cashed out with a profit of $${currentProfit.toFixed(2)}!`);
    }, 200);

    balance += currentProfit;
    document.getElementById('usermeat').textContent = balance.toFixed(2);

    cashoutButton.disabled = true;
    endGame(true);
}

startButton.addEventListener("click", startGame);
cashoutButton.addEventListener("click", cashOut);

betSizeInput.addEventListener("blur", () => {
let value = parseFloat(betSizeInput.value);
if (!isNaN(value)) betSizeInput.value = value.toFixed(2);
else betSizeInput.value = "0.00";
});