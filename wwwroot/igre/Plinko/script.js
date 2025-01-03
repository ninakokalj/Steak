let balance = 20;
let startingBalance = balance;
let currentBet = 0;
document.querySelector('#username').textContent = "jan";
document.getElementById('usermeat').textContent = balance.toFixed(2);

let totalWin = 0;
let totalLoss = 0;

const canvas = document.getElementById('plinkoCanvas');
const ctx = canvas.getContext('2d');
const randomBallButton = document.getElementById('randomBallButton');
const riskSelect = document.getElementById('risk');
const betSizeInput = document.getElementById('betSize');
const logBody = document.getElementById('logBody');
const exitButton = document.getElementById("exit");

exitButton.addEventListener("click", () => {
    const sessionProfit = balance - startingBalance;
    console.log(`Session Profit/Loss: $${sessionProfit.toFixed(2)}`);
    //window.location.href = "mainmenu.html"; // Redirect to mainmenu.html
});

const balls = [];
const ballRadius = 8;
const gravity = 0.1;

const pegs = [];
const pegRadius = 7;
const rows = 12;
const cols = 18;
const pegSpacingX = canvas.width / cols;
const pegSpacingY = 40;

const risks = {
    low: [0.8, 0.9, 1.0, 1.1, 2, 1.1, 1.0, 0.9, 0.8],
    medium: [0.4, 0.6, 0.8, 1.0, 3, 1.0, 0.8, 0.6, 0.4],
    high: [0.0, 0.2, 0.4, 0.6, 10, 0.6, 0.4, 0.2, 0.0]
};

let multipliers = risks.low;
const multiplierZones = [];
const zoneHeight = 40;
let zoneWidth;

function createMultiplierZones() {
    multiplierZones.length = 0;
    zoneWidth = canvas.width / multipliers.length;
    for (let i = 0; i < multipliers.length; i++) {
        multiplierZones.push({
            x: i * zoneWidth,
            y: canvas.height - zoneHeight,
            width: zoneWidth,
            multiplier: multipliers[i],
        });
    }
}

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const offsetX = row % 2 === 0 ? pegSpacingX / 2 : 0;
        pegs.push({
            x: col * pegSpacingX + offsetX + pegSpacingX / 4,
            y: row * pegSpacingY + 80,
            originalX: col * pegSpacingX + offsetX + pegSpacingX / 4,
            originalY: row * pegSpacingY + 80,
            color: '#3498db',
            isShaking: false,
            shakeTime: 0,
        });
    }
}

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawPegs() {
    pegs.forEach(peg => {
        if (peg.isShaking) {
            const shakeOffset = Math.random() * 2 - 1;
            peg.x = peg.originalX + shakeOffset;
            peg.y = peg.originalY + shakeOffset;

            ctx.fillStyle = '#5dade2';
            peg.shakeTime -= 1;
            if (peg.shakeTime <= 0) {
                peg.isShaking = false;
                peg.x = peg.originalX;
                peg.y = peg.originalY;
                peg.color = '#3498db';
            }
        }

        ctx.beginPath();
        ctx.arc(peg.x, peg.y, pegRadius, 0, Math.PI * 2);
        ctx.fillStyle = peg.color;
        ctx.fill();
        ctx.closePath();
    });
}

function drawMultiplierZones() {
    multiplierZones.forEach(zone => {
        ctx.fillStyle = '#ffeb3b';
        ctx.fillRect(zone.x, zone.y, zone.width, zoneHeight);
        ctx.strokeStyle = '#23043f';
        ctx.strokeRect(zone.x, zone.y, zone.width, zoneHeight);

        ctx.fillStyle = '#2c3e50';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            `${zone.multiplier}x`,
            zone.x + zone.width / 2,
            zone.y + zoneHeight / 2 + 6
        );
    });
}

function addBall(x) {
    balls.push({
        x: x,
        y: 50,
        vx: 0,
        vy: 0,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        scored: false,
    });
}

function spawnRandomBall() {
    const betSize = parseFloat(betSizeInput.value);
    if (betSize <= 0 || isNaN(betSize)) {
        alert("Please enter a valid bet size.");
        return;
    }

    if (balance >= betSize) {
        const randomX = Math.random() * canvas.width;
        addBall(randomX);

        balance -= betSize;
        document.getElementById('usermeat').textContent = balance.toFixed(2);
        currentBet = betSize;
    } else {
        alert("Balance not big enough to place a bet!");
    }
}

function addLogEntry(bet, payout, profit) {
    const currentTime = new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    if (profit >= 0) totalWin += profit;
    else totalLoss += Math.abs(profit);
    console.log(`Total Wins: $${totalWin.toFixed(2)}`);
    console.log(`Total Losses: $${totalLoss.toFixed(2)}`);

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${currentTime}</td>
        <td>${bet.toFixed(2)}</td>
        <td>${payout.toFixed(1)}x</td>
        <td>${profit >= 0 ? '+' : ''}${profit.toFixed(2)}</td>
    `;

    logBody.prepend(row);

    if (logBody.rows.length > 14) {
        logBody.deleteRow(logBody.rows.length - 1);
    }
}
function checkCollisions(ball) {
    pegs.forEach(peg => {
        const dx = ball.x - peg.x;
        const dy = ball.y - peg.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ballRadius + pegRadius) {
            const angle = Math.atan2(dy, dx);
            const collisionImpact = 1.5;
            ball.vx += Math.cos(angle) * collisionImpact;
            ball.vy += Math.sin(angle) * collisionImpact;

            peg.isShaking = true;
            peg.shakeTime = 15;
        }
    });
}

function checkMultiplierZone(ball) {
    if (ball.y + ballRadius >= canvas.height - zoneHeight && !ball.scored) {
        for (const zone of multiplierZones) {
            if (ball.x >= zone.x && ball.x <= zone.x + zone.width) {
                const profit = currentBet * zone.multiplier - currentBet;
                balance += currentBet * zone.multiplier;
                document.getElementById('usermeat').textContent = balance.toFixed(2);
                addLogEntry(currentBet, zone.multiplier, profit);
                ball.scored = true;
                ball.vy = 0;
                ball.vx = 0;
                break;
            }
        }
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPegs();
    drawMultiplierZones();

    balls.forEach(ball => {
        ball.vy += gravity;

        ball.vx *= 0.98; 
        ball.vy *= 0.98; 

        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x - ballRadius < 0 || ball.x + ballRadius > canvas.width) {
            ball.vx *= -0.9;
            ball.x = Math.max(ballRadius, Math.min(canvas.width - ballRadius, ball.x));
        }

        if (ball.y + ballRadius > canvas.height) {
            ball.y = canvas.height - ballRadius;
            ball.vy *= -0.6;
        }

        checkCollisions(ball);
        checkMultiplierZone(ball);
        drawBall(ball);
    });

    requestAnimationFrame(update);
}

update();

randomBallButton.addEventListener('click', spawnRandomBall);

riskSelect.addEventListener('change', () => {
    const risk = riskSelect.value;
    multipliers = risks[risk];
    createMultiplierZones();
});

createMultiplierZones();

function adjustLogContainer() {
    const logContainer = document.querySelector('.log-container');
    const maxAvailableHeight = window.innerHeight * 0.7;
    logContainer.style.maxHeight = `${maxAvailableHeight}px`;
}

window.addEventListener('resize', adjustLogContainer);
adjustLogContainer();