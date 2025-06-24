const bombContainer = document.getElementById("bomb-container");
const multiplierIndicator = document.getElementById("multiplier-indicator");
const statusText = document.getElementById("game-in-progress");
const betInput = document.getElementById("bet");
const selectedDifficulty = document.getElementById("difficulty");
const exitButton = document.getElementById("exit-button");
const betButton = document.getElementById("bet-button");

let bombButtons = Array.from(bombContainer.children);
let gameActive = false;
let bombIndexes = [];
let revealedCount = 0;
let multiplier = 1;

var bet = 0;

var multiplicationAmount = 0;

statusText.hidden = true;
exitButton.hidden = true;

//BALANCE
const balanceDisplay = document.getElementById("balance");

function UpdateBalance(){
    balanceDisplay.textContent = ("Guthaben: " + parseFloat(localStorage.getItem("balance")).toFixed(2) + "€").replace(".", ",");
}

UpdateBalance();



statusText.style.color = "green";

function GetBombCount(difficulty) {
    switch (difficulty) {
        case "Easy": return 3;
        case "Medium": return 6;
        case "Hard": return 12;
        default: return 3;
    }
}

function ResetGame() {
    bombButtons.forEach(btn => {
        const imgs = btn.querySelectorAll("img");
        imgs.forEach(img => img.hidden = true);
        btn.disabled = false;
    });

    revealedCount = 0;
    multiplier = 1;
    UpdateMultiplierDisplay();
    statusText.hidden = false;
    exitButton.hidden = false;
    UpdateBalance();
}

function UpdateMultiplierDisplay() {
    multiplierIndicator.textContent = `Multiplikator: ${multiplier.toFixed(2)}x`;
}

function LoseGame() {
    gameActive = false;
    bombButtons.forEach(btn => btn.disabled = true);
    statusText.textContent = "Boom! Spiel vorbei.";
    statusText.style.color = "red";
    exitButton.hidden = true;
    betButton.hidden = false;
    UpdateBalance();
}

function RevealButton(button) {
    if (!gameActive || button.disabled) return;

    const index = bombButtons.indexOf(button);
    const isBomb = bombIndexes.includes(index);

    const imgs = button.querySelectorAll("img");
    if (isBomb) {
        imgs[1].hidden = false;
        LoseGame();
    } else {
        imgs[0].hidden = false;
        button.disabled = true;
        revealedCount++;
        multiplier += multiplicationAmount;
        UpdateMultiplierDisplay();

        if (revealedCount === bombButtons.length - bombIndexes.length) {
            ExitGame()
        }
    }
}

function PlaceBombs(count) {
    bombIndexes = [];
    const total = bombButtons.length;
    while (bombIndexes.length < count) {
        const rand = Math.floor(Math.random() * total);
        if (!bombIndexes.includes(rand)) {
            bombIndexes.push(rand);
        }
    }
}

function ExitGame(){
    statusText.textContent = "Glückwunsch!";
    statusText.style.color = "green";
    exitButton.hidden = true;
    bombButtons.forEach(btn => btn.disabled = true);
    gameActive = false;
    localStorage.setItem("balance", parseFloat((parseFloat(localStorage.getItem("balance")) + bet * multiplier).toFixed(2)));
    UpdateBalance();
    betButton.hidden = false;
}

bombButtons.forEach(btn => {
    btn.addEventListener("click", () => RevealButton(btn));
});

function BetButtonClick(){
    bet = parseFloat(betInput.value);
    if (isNaN(bet) || bet <= 0 || bet > parseFloat(localStorage.getItem("balance")) || bet <= 0.009) {
        alert("Bitte eine gültige Wette eingeben.");
        return;
    }

    const difficulty = selectedDifficulty.value;
    const bombCount = GetBombCount(difficulty);

    ResetGame();
    PlaceBombs(bombCount);
    gameActive = true;

    localStorage.setItem("balance", parseFloat(localStorage.getItem("balance")) - bet);
    
    UpdateBalance();

    switch (difficulty) {
        case "Easy": multiplicationAmount = 0.1; break;
        case "Medium": multiplicationAmount = 0.25; break;
        case "Hard": multiplicationAmount = 0.4; break;
    }

    betButton.hidden = true;
    statusText.style.color = "green";
    statusText.textContent = "Spiel im Gange...";
}