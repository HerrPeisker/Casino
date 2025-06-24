const balanceDisplay = document.getElementById("balance");

if(localStorage.getItem("balance") == null){
    localStorage.setItem("balance", 0);
}

function UpdateBalance(){
    balanceDisplay.textContent = ("Guthaben: " + parseFloat(localStorage.getItem("balance")).toFixed(2) + "€").replace(".", ",");
}

UpdateBalance();

const siteContent = document.getElementById("site");
const verificationScreen = document.getElementById("verification");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

if(localStorage.getItem("isVerified") == null){
    localStorage.setItem("isVerified", false);
}

function CheckVerification(){
    if(localStorage.getItem("isVerified") == "true"){
        siteContent.hidden = false;
        verificationScreen.hidden = true;
        console.log("Verified");
        return;
    } else{
        siteContent.hidden = true;
        verificationScreen.hidden = false;
        console.log("Not Verified");
        return;
    }
}

function Login(){
    if(usernameInput.value == "" || passwordInput.value == "") {
        alert("Bitte gültige Daten angeben!");
        return;
    }

    if(usernameInput.value != "stavenhagen" && passwordInput.value != "stavenhagen123"){
        alert("Falsches Passwort oder Benutzername!");
        return;
    }

    localStorage.setItem("isVerified", true);  
    CheckVerification();
}

CheckVerification();
