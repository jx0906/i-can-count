// constants
class game {
    constructor(level, totalCards) {
    this.level = level;
    this.totalCards = totalCards;
    }

    getGameLevel() {
        return this.level;
    }

    getTotalGameCards() {
        return this.totalCards;
    }
}

var game1 = new game(1, 6);
var game2 = new game(2, 10);
var game3 = new game(3, 20);

class card {
    constructor(value, status, selection) {
    this.value = value;
    this.status= status;
    this.selection = selection;
    this.label = "label"; //optional argument
    }

    getCardLabel() {
        return this.label;
    }

    getCardValue() {
        return this.value;
    }

    getCardStatus() {
        return this.status;
    }

    getCardSelection() {
        return this.selection;
    }
    
    setCardLabel(newLabel) {
        this.label = newLabel;
    }

    setCardValue(val) {
        this.value = val;
    }

    setCardSelection(newSel) {
        this.selection = newSel;
    }

    setCardProfile(newStatus, newSel) {
        this.status = newStatus;
        this.selection = newSel;
    };
}

// variables

let timer;
let progress;

let gameSel;

let cardArray = [];

let gameState = {
    level: null,
    score: 0,
    firstCardSel: null,
    timeLeft: 60,
    cardsLeft: 0,
    sumGoal: 0
}

// cached elements

const playButton = document.getElementById('play-button');
const replayButton = document.getElementById('replay-button');
const scoreDisplay = document.getElementById('score-display');
const timerDisplay = document.getElementById('timer-display');
const gameStatus = document.getElementById('game-status');
const gameCards = document.getElementById('game-cards');
const nextGame = document.getElementById('next-game');
const startInstructions = document.getElementById('instructions');
const updatedInstructions = document.getElementById('updated-instructions');
const nGame = document.getElementById('ngame-button');

// event listeners

playButton.addEventListener('click', customize);
gameCards.addEventListener('click', handleMove);
nGame.addEventListener('click', nextSteps);
replayButton.addEventListener('click', reinitialize);

function customize() {
    clearInterval(timer);
    clearInterval(progress);
    startInstructions.style.display = "none";
    let summationInput = document.getElementById('summation-input');
    summationInput.style.display = "flex";
    document.getElementById('input-feedback').textContent = "";

    document.getElementById('yes-button').addEventListener("click", function() {
        if (document.getElementById('summation-target').checkValidity()) {
            document.getElementById('input-feedback').textContent = "";
            gameState.sumGoal = parseInt(document.querySelector('#summation-target').value);        
            summationInput.style.display = "none";
            initialize();
            document.getElementById("form").reset();
        } else {
        document.getElementById('input-feedback').textContent = "Please enter a valid integer from 2 to 100. Leave blank if you prefer to use the default summation value of 10.";
        document.getElementById("form").reset();
    };});

    document.getElementById('no-button').addEventListener('click', function() {
        gameState.sumGoal = 10;
        summationInput.style.display="none";
        document.getElementById("form").reset();
        initialize();
    });
}

function initialize() {
    cardArray = [];
    clearInterval(timer);
    clearInterval(progress); 
    gameState.timeLeft = 60;
    gameState.score = 0;
    gameState.level = game1.getGameLevel();
    gameState.cardsLeft = game1.getTotalGameCards();
    createCards(game1.getTotalGameCards());
    renderStartGame();
    move();
    timer = setInterval(function () {
        const seconds = gameState.timeLeft % 60; 
        if (gameState.timeLeft === 60) {
            timerDisplay.textContent = "1 minute";
        }
        else {timerDisplay.textContent = `${seconds} s`;}
        gameState.timeLeft--;
    
        if (gameState.timeLeft <= 0) {
            timerDisplay.textContent = "TIME'S UP!";
            checkWin();
            clearInterval(timer);
            clearInterval(progress);
          }
        return;
      }, 1000);
}

function createCards(totalCardsToCreate) {

    for (i = 0; i < (totalCardsToCreate/2); i++) {
        let randomValue = Math.floor(Math.random() * gameState.sumGoal);
        let combiValue = gameState.sumGoal - randomValue; 
        let cardA = new card(randomValue, "active", "playerNotSel");
        let cardB = new card(combiValue, "active", "playerNotSel");
        cardArray.push(cardA, cardB);
    }

    for (j = 0; j < cardArray.length; j++) {
        cardArray[j].setCardLabel("card " + j);
    };}

function handleMove(evt) {
    let idx = parseInt(evt.target.id.replace('card ', ''));
    let clickedCard = cardArray[idx];
    let clickedCardSel = clickedCard.getCardSelection();
    if (gameState.firstCardSel != null) {
        if (clickedCardSel === "playerSel") {
            clickedCard.setCardSelection("playerNotSel");
            gameState.firstCardSel = null;
            renderCardSel(evt);
            return;
        }
        clickedCard.setCardSelection("playerSel");
        renderCardSel(evt);
        checkSum(gameState.firstCardSel, clickedCard);
        gameState.firstCardSel = null;
        checkWin();
        return;
        }
    clickedCard.setCardSelection("playerSel");    
    gameState.firstCardSel = clickedCard;
    renderCardSel(evt);
    return;
    }

function checkSum (firstCard, secCard) {
    if (firstCard.getCardValue() + secCard.getCardValue() === gameState.sumGoal) {
        gameState.score +=10;
        firstCard.setCardProfile("inactive", "playerNotSel");
        secCard.setCardProfile("inactive", "playerNotSel");

        let updatedCardArray = cardArray.filter(dropCard);
        function dropCard(card) {
             return card.getCardStatus() == 'active';
            }
        gameState.cardsLeft = updatedCardArray.length;
        renderCardStatus (firstCard, secCard);
        return;
    }
    firstCard.setCardSelection("playerNotSel");
    secCard.setCardSelection("playerNotSel");
    renderCardStatus(firstCard, secCard);
    return;
}

function checkWin() {
    clearInterval(gameSel);
    if ((gameState.timeLeft >= 0 && gameState.cardsLeft == 0) || (gameState.timeLeft <= 0 && gameState.cardsLeft > 0)) {
        gameState.score += parseInt(gameState.timeLeft);
        renderMessage();
    };
    return;
}

function nextSteps() {
    if (gameState.timeLeft >= 0 && gameState.cardsLeft == 0 && (gameState.level === game1.getGameLevel() || gameState.level === game2.getGameLevel())) {
        updateGame();
        return;
        }
    else {
        reinitialize();
        };
    }

function updateGame() {
    cardArray = [];
    clearInterval(timer);
    clearInterval(progress); 
    gameState.timeLeft = 60;
    if (gameState.level === game2.getGameLevel()) {
        gameState.level = game3.getGameLevel();
        gameState.cardsLeft = game3.getTotalGameCards();
        createCards(game3.getTotalGameCards());
    }
    if (gameState.level === game1.getGameLevel()) {
        gameState.level = game2.getGameLevel();
        gameState.cardsLeft = game2.getTotalGameCards();
        createCards(game2.getTotalGameCards());
    } 
    renderStartGame();
    move();
    timer = setInterval(function () {
        const seconds = gameState.timeLeft % 60; 
        if (gameState.timeLeft === 60) {
            timerDisplay.textContent = "1 minute";
        }
        else {timerDisplay.textContent = `${seconds} s`;}
        gameState.timeLeft--;
    
        if (gameState.timeLeft <= 0) {
            timerDisplay.textContent = "TIME'S UP!";
            checkWin();
            clearInterval(timer);
            clearInterval(progress); 
          }
      }, 1000);
}

function reinitialize() {
    startInstructions.style.display = "flex";
    document.getElementById('game-state').style.display = "none";
    nextGame.style.display = "none";
}

function renderStartGame() {
    startInstructions.style.display = "none";
    nextGame.style.display = "none";
    // document.querySelectorAll('.next-game').forEach(a=>a.style.display = "none");
    document.getElementById('game-state').style.display = "flex";
    scoreDisplay.textContent = `Current Score: ${gameState.score}`;
    gameStatus.textContent = 'Your time starts now!'
    replayButton.style.display = "block";
    renderCreateCards();
    gameSel = setTimeout(newMessage, 1000);
}

function newMessage() {
    gameStatus.textContent = `? + ? = ${gameState.sumGoal}`;
};

function move() {
    let i = 0;
    if (i == 0) {
    i = 1;
    progress = setInterval(function() {
        let width = 1;
      if (width >= 100) {
        clearInterval(progress);
        i = 0;
      } else {
        width+=1.67;
        timerDisplay.style.width = width + "%";
      }
    }, 1000);
};}

function renderMessage() {
    document.getElementById('game-state').style.display = "none";
    startInstructions.style.display = "none";
    nextGame.style.display = "flex";

    if (gameState.timeLeft <= 0 || gameState.cardsLeft > 0) {
        updatedInstructions.innerHTML = `Good attempt! You scored ${gameState.score}! Shall we try again?<br><br>`;
        nGame.textContent = "Ok, I can do this!";
        return;
    }
    if (gameState.timeLeft >= 0 && gameState.cardsLeft == 0) {
        if (gameState.level == game1.getGameLevel() || gameState.level == game2.getGameLevel()) {
        updatedInstructions.innerHTML = `That was awesome! You scored ${gameState.score}! Shall we move on to the next challenge?`;
        nGame.textContent = "Ok, let's go!";      
        return;
        }
        updatedInstructions.innerHTML = `You did an amazing job with a total score of ${gameState.score}! Would you like to play again?`;
        nGame.textContent = "Ok, let's do this again!";
        return;
    }
}

function renderCreateCards() {
    while (gameCards.hasChildNodes()) {
        gameCards.removeChild(gameCards.firstChild);
    }

    for (let i = 0; i < cardArray.length; i++) {
        let gCard = document.createElement('div');
        gCard.classList.add("cards", cardArray[i].getCardStatus(), cardArray[i].getCardSelection())
        gCard.setAttribute("id",cardArray[i].getCardLabel());
        gCard.innerText = cardArray[i].getCardValue();
        gameCards.appendChild(gCard);
    };

    let cardDisplay = Array.from(gameCards.children);

    // ref: Fisher-Yates shuffle algorithm
    function shuffleArray(cardDisplay) {
        for (let i = cardDisplay.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardDisplay[i], cardDisplay[j]] = [cardDisplay[j], cardDisplay[i]];
        }
    }
    shuffleArray(cardDisplay);
    cardDisplay.forEach(card => gameCards.appendChild(card));
}

function renderCardSel(event) {
    let selCard = document.getElementById(event.target.id);
    let firstCard = document.querySelector('.firstCardSel');

    if (firstCard != null) {
        if (selCard.classList.contains('playerSel')) {
        selCard.classList.replace('playerSel', 'playerNotSel');
        selCard.classList.remove('firstCardSel');
        newMessage();
        return;
    }
    selCard.classList.replace('playerNotSel', 'playerSel');
    gameStatus.textContent = `${firstCard.textContent} + ${selCard.textContent} = ${gameState.sumGoal}`;
    return;
    }
    selCard.classList.replace('playerNotSel', 'playerSel');
    selCard.classList.add("firstCardSel");
    gameStatus.textContent = `${selCard.textContent} + ? = ${gameState.sumGoal}`;
    return;
}

function renderCardStatus (firstCard, secCard) {
    let card1 = document.getElementById(firstCard.getCardLabel());
    let card2 = document.getElementById(secCard.getCardLabel());

    card1.classList.replace('active', firstCard.getCardStatus());
    card2.classList.replace('active', secCard.getCardStatus());
    card1.classList.replace('playerSel', firstCard.getCardSelection());
    card2.classList.replace('playerSel', secCard.getCardSelection());
    card1.classList.remove('firstCardSel');
    if (card1.classList.contains('active')) {
        gameStatus.textContent = `That didn't quite add up to ${gameState.sumGoal}. Try again!`;
        gameSel = setTimeout(newMessage, 1500);
    }
    else {
        gameStatus.textContent = `Bingo! That summed up nicely to ${gameState.sumGoal}!`;
        scoreDisplay.textContent = `Current Score: ${gameState.score}`;
        gameSel = setTimeout(newMessage, 1500);    
    };
}