//BALANCE
const balanceDisplay = document.getElementById("balance");

function UpdateBalance(){
    balanceDisplay.textContent = ("Guthaben: " + parseFloat(localStorage.getItem("balance")).toFixed(2) + "€").replace(".", ",");
}

UpdateBalance();
//

function waitForSeconds(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function GetRandomFloatNumber(min, max) {
  return parseFloat(((Math.random() * (max - min + 1)) + min).toFixed(2));
}

function GetRandomIntNumber(min, max) {
  return Math.floor((Math.random() * (max - min + 1)) + min);
}


const multiplierText = document.getElementById("multiplier");

const betInput = document.getElementById("bet");

const statusText = document.getElementById("game-in-progress");

const enterButton = document.getElementById("enter-button");

const cashoutButton = document.getElementById("cashout-button");

var isRunning = false;

var hasCashedOut = false;

var hasCrashed = false;

var currentMultiplier = 0;
var multiplier = 0.01;
var multiplierUpdateSpeed = 1;

var crashMultiplier = 0;

async function UpdateMultiplier(){
    if(hasCashedOut || hasCrashed) return;
    await waitForSeconds(multiplierUpdateSpeed);
    currentMultiplier += multiplier;
    multiplierText.textContent = currentMultiplier.toFixed(2) + "x";

    if(currentMultiplier < 1){
        multiplierUpdateSpeed = 0.1;
    }

    if(currentMultiplier > 1 || currentMultiplier < 3){
        multiplierUpdateSpeed = 0.07;
    }

    if(currentMultiplier > 3){
        multiplierUpdateSpeed = 0.03;
    }

    if(currentMultiplier >= crashMultiplier){
        isRunning = false;
        Crash();
        return;
    }

    if(isRunning) UpdateMultiplier();
}


function CalcCrashMultiplier(){
    let seed = GetRandomIntNumber(1, 100);

    if(seed <= 3){
        crashMultiplier = GetRandomFloatNumber(10, 100);
    }

    if(seed > 3 && seed <= 10){
        crashMultiplier = GetRandomFloatNumber(5, 10);
    }

    if(seed >= 11 && seed <= 25){
        crashMultiplier = GetRandomFloatNumber(3, 5);
    }

    if(seed >= 25 && seed <= 100){
        crashMultiplier = GetRandomFloatNumber(0.5, 3);
    }
}

function Cashout(){
    hasCashedOut = true;
    isRunning = false;
    enterButton.hidden = false;
    cashoutButton.hidden = true;

    statusText.style.color = "green";
    statusText.textContent = "Ausgestiegen, Gewonnen!"

    bet = parseFloat(betInput.value);

    localStorage.setItem("balance", (parseFloat(localStorage.getItem("balance")) + (bet * currentMultiplier)).toFixed(2));

    UpdateBalance();
}

function Enter(){
    bet = parseFloat(betInput.value);

    if (isNaN(bet) || bet <= 0 || bet > parseFloat(localStorage.getItem("balance")) || bet <= 0.009) {
        alert("Bitte eine gültige Wette eingeben.");
        return;
    }

    localStorage.setItem("balance", 
        parseFloat(parseFloat(localStorage.getItem("balance")) - bet));

    UpdateBalance();

    isRunning = true;
    hasCashedOut = false;
    hasCrashed = false;

    enterButton.hidden = true;
    cashoutButton.hidden = false;

    currentMultiplier = 0;

    statusText.style.color = "orange";
    statusText.textContent = "Runde im Gange...";

    multiplierText.style.color = "#14CC60";

    CalcCrashMultiplier();

    UpdateMultiplier();
}

function Crash(){
    isRunning = false;
    hasCrashed = true;

    statusText.style.color = "red";
    statusText.textContent = "Abgestürzt!";

    multiplierText.textContent = crashMultiplier.toString() + "x";
    multiplierText.style.color = "red";

    enterButton.hidden = false;
    cashoutButton.hidden = true;
}

statusText.style.color = "yellow";