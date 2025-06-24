const gameWindow = document.getElementById("game-window");
const startPanel = document.getElementById("start-panel");

const playerCardHolder = document.getElementById("player-card-holder");
const dealerCardHolder = document.getElementById("dealer-card-holder");

const playerButtons = document.getElementById("player-buttons");

const statusText = document.getElementById("status-text");
const statusArea = document.getElementById("status");

const betInput = document.getElementById("bet");

const balanceDisplay = document.getElementById("balance");

function UpdateBalance(){
    balanceDisplay.textContent = ("Guthaben: " + parseFloat(localStorage.getItem("balance")).toFixed(2) + "€").replace(".", ",");
}

UpdateBalance();

class Card{
    constructor(){
        this.cardValue = 0;
    }
}

const playerSumText = document.getElementById("player-hand-sum");
const dealerSumText = document.getElementById("dealer-hand-sum");

var playerCards = [];
var dealerCards = [];

var playerSum = 0;
var dealerSum = 0;

var betBalance = 0;

var endOfGame = false;
var activeStay = false;

var gameReady = false;

var isOver = false;

function UpdateSums(){
    let dealerHandSum = 0;
    let playerHandSum = 0;

    dealerCards.forEach(card => {
        dealerHandSum += card.cardValue;
    });

    playerCards.forEach(card => {
        playerHandSum += card.cardValue;
    });

    if (dealerCards.length > 0) {
        dealerSumText.textContent = `Dealer's Hand | X + ${dealerHandSum - dealerCards[0].cardValue}`;
    } else {
        dealerSumText.textContent = "Dealer's Hand | ";
    }

    playerSumText.textContent = `Deine Hand | ${playerHandSum}`;
}


function GetRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function waitForSeconds(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function Bet(){
    let currentbet = parseFloat(betInput.value);

    if (isNaN(currentBet) || currentBet <= 0 || currentBet > parseFloat(localStorage.getItem("balance")) || currentBet <= 0.009) {
        alert("Bitte eine gültige Wette eingeben.");
        return;
    }

    localStorage.setItem("balance", currentBalance - currentbet);

    betBalance = currentbet;

    UpdateBalance(); 

    betInput.value = false;

    gameReady = true;
}


function GetRandomCard(){
    var card = new Card();

    var randomNum = GetRandomNumber(1, 10);

    card.cardValue = randomNum;

    return card;
}

function PlayerPullCard(){
    activeStay = false;
    const card = GetRandomCard();

    playerCards.push(card);

    let cardElement = document.createElement("div");
    cardElement.className = "card";
    cardElement.innerHTML = '<p>' + card.cardValue + '</p>';

    playerCardHolder.appendChild(cardElement);

    CalculatePlayerSum();

    console.log(playerSum);

    if(playerSum > 21){
        PlayerLose();
        isOver = true;
    }

    if(playerSum == 21){
        DealerLose();
        isOver = true;
    }
    
    UpdateSums();
}

function PlayerStay(){
    CheckStay();
    activeStay = true;
}

function PlayerPullButton(){
    PlayerPullCard();
    DealerPlay();
}

function PlayerStayButton(){
    PlayerStay();
    DealerPlay();
}

function PlayerTurn(){
    playerButtons.hidden = false;
}

function CalculatePlayerSum(){
    playerSum = 0;

    playerCards.forEach(card => {
        playerSum += card.cardValue;
    });
}

async function PlayerLose(){
    playerButtons.hidden = true;
    statusArea.hidden = false;
    statusText.innerHTML = "Du hast verloren!<br>⠀";
    endOfGame = true;
    await waitForSeconds(3);
    startPanel.hidden = false;
    gameWindow.hidden = true;
    endOfGame = false;
}

//Dealer

function CalculateDealerSum(){
    dealerSum = 0;

    dealerCards.forEach(card => {
        dealerSum += card.cardValue;
    });
}

function DealerPullCard(){
    activeStay = false;
    const card = GetRandomCard();

    let cardElement = document.createElement("div");
    cardElement.className = "card";

    cardElement.innerHTML = dealerCards.length == 0 ? '<p>X</p>' : '<p>' + card.cardValue + '</p>';

    dealerCardHolder.appendChild(cardElement);

    dealerCards.push(card);

    CalculateDealerSum();

    if(dealerSum > 21){
        DealerLose();
        isOver = true;
    }

    if(dealerSum == 21){
        PlayerLose();
        isOver = true;
    }

    UpdateSums();
}

function DealerStay(){
    CheckStay();
    activeStay = true;
}

async function DealerPlay(){
    playerButtons.hidden = true;
    await waitForSeconds(3);

    if(dealerSum <= 16){
        DealerPullCard();
    }

    if(dealerSum >= 17){
        DealerStay();
    }

    console.log(dealerSum);

    if(endOfGame) return;
    playerButtons.hidden = false;
}

async function DealerLose(){
    playerButtons.hidden = true;
    statusArea.hidden = false;
    statusText.innerHTML = "Du hast gewonnen!<br>⠀";

    var win = (parseFloat(localStorage.getItem("balance")) + betBalance * 2).toFixed(2);

    localStorage.setItem("balance", win);

    endOfGame = true;
    await waitForSeconds(3);
    startPanel.hidden = false;
    gameWindow.hidden = true;
    endOfGame = false;

    UpdateBalance();
}

function StartRound(){

    ResetGame();

    playerButtons.hidden = false;

    PlayerPullCard();
    PlayerPullCard();

    DealerPullCard();
    DealerPullCard();
}

function StartGame(){
    Bet();

    if(!gameReady) return;

    startPanel.hidden = true;
    gameWindow.hidden = false;

    StartRound();
}

function ResetGame(){
    playerCards = [];
    dealerCards = [];

    CalculatePlayerSum();
    CalculateDealerSum();

    while (playerCardHolder.firstChild) {
        playerCardHolder.removeChild(playerCardHolder.firstChild);
    }

    while (dealerCardHolder.firstChild) {
        dealerCardHolder.removeChild(dealerCardHolder.firstChild);
    }

    statusArea.hidden = true;

    endOfGame = false;

    gameReady = false;
    isOver = false;
}

async function GameDraw(){
    playerButtons.hidden = true;
    statusArea.hidden = false;
    statusText.innerHTML = "Unentschieden!<br>⠀";

    var drawBalance = parseFloat(localStorage.getItem("balance")) + betBalance;
    localStorage.setItem("balance", drawBalance.toFixed(2));
    UpdateBalance();

    endOfGame = true;

    await waitForSeconds(3);

    startPanel.hidden = false;
    gameWindow.hidden = true;
    endOfGame = false;
}

function CheckStay() {
    if (playerSum > 21 || dealerSum > 21) return;

    if (activeStay && playerButtons.hidden) {
        isOver = true;

        if (playerSum > dealerSum) {
            DealerLose();
        } else if (playerSum < dealerSum) {
            PlayerLose();
        } else {
            GameDraw();
        }
    }
}
