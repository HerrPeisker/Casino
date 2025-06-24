//BALANCE
const balanceDisplay = document.getElementById("balance");

function UpdateBalance(){
    balanceDisplay.textContent = ("Guthaben: " + parseFloat(localStorage.getItem("balance")).toFixed(2) + "€").replace(".", ",");
}

UpdateBalance();
//

function GetRandomIntNumber(min, max) {
  return Math.floor((Math.random() * (max - min + 1)) + min);
}

function waitForSeconds(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

const ballon = document.getElementById("ballon-visual");

const betInput = document.getElementById("bet");

const betButton = document.getElementById("bet-button");

const pumpButton = document.getElementById("pump-button");

const statusText = document.getElementById("game-status");

const multiplierText = document.getElementById("multiplier-text");

const exitButton = document.getElementById("exit-button");

var timesPumped = 0;

var maxPumps = 0;

var multiplier = 1;

var isIntact = false;

var bet = 0;

function PumpBallon(){
    if(!isIntact) return;
    ballon.style.scale = parseFloat(ballon.style.scale) + 0.05;
    ballon.style.top = (parseInt(ballon.style.top) - 7).toString() + "px";
    timesPumped++;
    multiplier += 0.1;
    multiplierText.textContent = multiplier.toFixed(2) + "x";
    if(timesPumped == maxPumps){
        End();
    }
}

async function End(){
    isIntact = false;
    multiplierText.style.color = "red";
    multiplierText.style.textDecoration = "line-through";

    pumpButton.hidden = true;
    exitButton.hidden = true;

    statusText.textContent = "Geplatzt!";
    statusText.style.color = "red";
    statusText.hidden = false;

    await waitForSeconds(3);

    statusText.textContent = "Warte auf Wette...";
    statusText.style.color = "yellow";

    betInput.hidden = false;
    betButton.hidden = false;
    multiplierText.hidden = true;
}

async function Exit(){
    localStorage.setItem("balance", (parseFloat(localStorage.getItem("balance")) + (bet * multiplier)).toFixed(2));
    UpdateBalance();

    multiplierText.style.color = "green";
    multiplierText.style.textDecoration = "underline";

    pumpButton.hidden = true;
    exitButton.hidden = true;

    statusText.textContent = "Glückwunsch!";
    statusText.style.color = "green";
    statusText.hidden = false;

    await waitForSeconds(3);

    statusText.textContent = "Warte auf Wette...";
    statusText.style.color = "yellow";

    betInput.hidden = false;
    betButton.hidden = false;
    multiplierText.hidden = true;
}

function Start(){
    isIntact = true;
    multiplier = 1;
    ballon.style.scale = 0.25;
    ballon.style.top = "300px"
    multiplierText.style.color = "white";
    multiplierText.textContent = "1.00x"
    multiplierText.style.fontSize =  "3em";
    multiplierText.hidden = true;
    multiplierText.style.textDecoration = "";
    statusText.style.color = "yellow";
    statusText.textContent = "Warte auf Wette...";
    exitButton.style.backgroundColor = "lightblue";
    exitButton.hidden = true;
}

function Bet(){
    bet = parseFloat(betInput.value);

    if (isNaN(bet) || bet <= 0 || bet > parseFloat(localStorage.getItem("balance")) || bet <= 0.009) {
        alert("Bitte eine gültige Wette eingeben.");
        return;
    }

    Start();

    localStorage.setItem("balance", 
        parseFloat(parseFloat(localStorage.getItem("balance")) - bet));

    UpdateBalance();

    betInput.hidden = true;
    betInput.value = "";

    betButton.hidden = true;
    pumpButton.hidden = false;

    statusText.hidden = true;

    multiplierText.hidden = false;
    exitButton.hidden = false;

    maxPumps = GetRandomIntNumber(1, 30);
}

Start();