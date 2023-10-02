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
var game2 = new game(2,10);
var game3 = new game(3,20);

//based on cardValue
const cardCombi = [
    [1,9],
    [2,8],
    [3,7],
    [4,6],
    [5,5]
]

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
    }
}
// class Player - if i want to do scoreboard

// state variables

let cardArray = [];

//always try to set smth for the keys in the object
let gameState = {
    level: null,
    firstCardSel: null,
    timeLeft: 60,
    cardsLeft: 0
}

// cached elements - This term emphasizes the idea of storing a reference to a DOM element in a variable to improve performance 
// by avoiding repeated DOM queries. When you cache an element, you are essentially setting it as a variable.

const playButton = document.getElementById('play-button');
const timerDisplay = document.getElementById('timer-display');
const gameStatus = document.getElementById('game-status');
const gameCards = document.getElementById('game-cards');

// event listeners

playButton.addEventListener('click', initialize);
gameCards.addEventListener('click', handleMove);

// functions

function initialize() {
    cardArray = [];
    gameState.level = game1.getGameLevel();
    gameState.cardsLeft = game1.getTotalGameCards();
    createCards(game1.getTotalGameCards());
    renderStartGame();
    const timer = setInterval(updateCountdown, 1000); // use setInterval to call the updateCountdown function every second (1000 milliseconds).  
}

function createCards(totalCardsToCreate) {
    while (gameCards.hasChildNodes()) {
        gameCards.removeChild(gameCards.firstChild);
    }

    for (i = 0; i < (totalCardsToCreate /2); i++) {
        // get a random item from an array
        // get random index value
        const randomIndex = Math.floor(Math.random() * cardCombi.length);
        let combiToCreate = cardCombi[randomIndex];
        // console.log(combiToCreate); for debugging, to confirm what we are getting is a set of numbers
        let cardA = new card(combiToCreate[0], "active", "playerNotSel");
        let cardB = new card(combiToCreate[1], "active", "playerNotSel");
        cardArray.push(cardA, cardB); //doesn't replace, just appends, so command would work in this loop and not reset cardArray each loop
    }
        // console.log(cardArray); for debugging to confirm cardArray is rightly established
    for (j = 0; j < cardArray.length; j++) {
        cardArray[j].setCardLabel("card " + j); //want to do this so i can assign the created DOM element with the same label to facilitate
        // subsequent needs to check on the card class properties (eg, getClassSelection())
    }
    // console.log(cardArray[1]); for debugging to confirm the cardLabel is rightly assigned
    }

// rmb to write codes to update Model, not DOM (that's render)
function handleMove(evt) {
    // console.log(evt.target); //gives DOM value so we need to call on the its ID to link it back to the cardArraylet clickedCardID = evt.target.id; // returns "card 1"
    // (based on the way I had created the cards)

    // "id" is a DOM property so you  have to be on the DOM element object to use it.
    let idx = parseInt(evt.target.id.replace('card ', ''));
    // console.log(idx);
    let clickedCard = cardArray[idx];
    // console.log(clickedCard); // returns an object

    let clickedCardSel = clickedCard.getCardSelection();
    // console.log(clickedCardSel);
    // console.log(gameState.firstCardSel);
    if (gameState.firstCardSel != null) {
        if (clickedCardSel === "playerSel") {
            clickedCard.setCardSelection("playerNotSel");
            gameState.firstCardSel = null;
            renderCardSel(evt);
            return;
        }
        //clickedCardSel === "playerNotSel"
        clickedCard.setCardSelection("playerSel");
        // console.log(clickedCard);
        // console.log(gameState.firstCardSel);
        renderCardSel(evt);
        checkSum(gameState.firstCardSel, clickedCard);
        gameState.firstCardSel = null;
        checkWin();
        return;
        }
    //gameState.firstCardSel === null
    clickedCard.setCardSelection("playerSel");    
    gameState.firstCardSel = clickedCard;
    console.log(gameState.firstCardSel);
    renderCardSel(evt);
    return;
    }

function checkSum (firstCard, secCard) {
    if (firstCard.getCardValue() + secCard.getCardValue() === 10) {
        firstCard.setCardProfile("inactive", "playerNotSel");
        secCard.setCardProfile("inactive", "playerNotSel");
        console.log(firstCard,secCard);
        // console.log(cardArray);
        
        let updatedCardArray = cardArray.filter(dropCard);
        function dropCard(card) {
             return card.getCardStatus() == 'active';
            }
        gameState.cardsLeft = updatedCardArray.length;
        console.log(updatedCardArray);
        renderCardStatus (firstCard, secCard);
        checkWin();
        return;
    }
    firstCard.setCardSelection("playerNotSel");
    secCard.setCardSelection("playerNotSel");
    renderCardStatus(firstCard, secCard);
    return;
}

function checkWin() {
    if ((gameState.timeLeft >= 0 && gameState.cardsLeft == 0) || (gameState.timeLeft <= 0 && gameState.cardsLeft > 0)) {
        renderMessage();
        return;
    }
    // gameState.timeLeft > 0 && gameState.cardsLeft > 0) 
    return;
    }

// Update the count down every 1 second
function updateCountdown() {
    // Set end time to be 1 min later (ie, 60000 miliseconds)
    // can use new Date.getTime() if you want to be very accurate about tmekeeping cos 1000 miliseconds != exactly 1sec. its more of 1.03 s.
    // var now = new Date().getTime(); var targetTime = 1 minute later (need to find the exact code)
    const seconds = gameState.timeLeft % 60; 
    // If the count down is finished, 
    if (gameState.timeLeft === 60) {
        timerDisplay.textContent = "1 minute"; // need to specify this so we don't see "0 s" at the start when gameState.timeLeft = 60 and 60%60  =0  (if left to else stmt alone)
    }
    else {timerDisplay.textContent = `${seconds} s`;}
    gameState.timeLeft--;

    if (gameState.timeLeft === 0) {
        timerDisplay.textContent = "TIME'S UP!";
        checkWin();
        clearInterval(timer);
      }
    return;
  };

function resetGame() {
    renderCreateCards();
    gameStatus.textContent = 'Your time starts now!'
    setTimeout(newMessage, 500); // setTimeout (not setInterval) cos you only want it to run once 
}

function updateGame() {
    cardArray = [];
    if (gameState.level = game1.getGameLevel()) {
        gameState.level = game2.getGameLevel();
        gameState.cardsLeft = game2.getTotalGameCards();
        createCards(game2.getTotalGameCards());
    };
    if (gameState.level = game2.getGameLevel()) { 
    gameState.level = game3.getGameLevel();
    gameState.cardsLeft = game3.getTotalGameCards();
    createCards(game3.getTotalGameCards());
    }
    renderStartGame();
    const timer = setInterval(updateCountdown, 1000);
}

function newMessage() {
    gameStatus.textContent = '? + ? = 10'
};


// for game start and game refresh (ie, new level)
function renderStartGame() {
    document.getElementById('instructions').style.display = "block";
    document.getElementById('updated-instructions').style.display = "none";
    timerDisplay.style.display = "block";
    renderCreateCards();
    gameStatus.textContent = 'Your time starts now!'
    setTimeout(newMessage, 500); // setTimeout (not setInterval) cos you only want it to run once 
}

function renderMessage() {
    gameStatus.textContent = '';
    timerDisplay.style.display = "none";
    document.getElementById('instructions').style.display = "none";

    let replay = document.getElementById('replay');
    let nextLevel = document.getElementById('next-level');
    let newGame = document.getElementById('new-game');
    
    let updatedInstructions = document.getElementById('updated-instructions');
    updatedInstructions.style.display = "block";

    if (gameState.timeLeft <= 0 && gameState.cardsLeft > 0) {
        ???? let gCard = document.createElement('button');
        updatedInstructions.innerHTML = 'Good attempt! Shall we try again?'+ '<br><br><button id = "replay">Ok! I can do this!</button>';
        replay.addEventListener('click', initialize);
        return;
    }
    if (gameState.timeLeft >= 0 && gameState.cardsLeft == 0) {
        if (gameState.level == game1.getGameLevel() || gameState.level == game2.getGameLevel()) {
        updatedInstructions.innerHTML = 'That was awesome! Shall we move on to the next challenge?' +
        '<br><br><button id = "next-level">Challenge Accepted!</button>';
        nextLevel.addEventListener('click', updateGame);
        return;
    }
    updatedInstructions.innerHTML = 'You did an amazing job! Would you like to play again?' +
    '<br><br><button id = "new-game">Replay!</button>';
    newGame.addEventListener('click', initialize);
    return;
}
}

function renderCreateCards() {
    for (let i = 0; i < cardArray.length; i++) {
        //this will lead to the same effect as having </div><div> in the .game-board HTML elem to facilitate css styling, js functions
        let gCard = document.createElement('div');
        gCard.classList.add("cards", cardArray[i].getCardStatus(), cardArray[i].getCardSelection())
        gCard.setAttribute("id",cardArray[i].getCardLabel());
        gCard.innerText = cardArray[i].getCardValue();
        // Append created card to the pile of gameCards so that the css styling can be applied
        gameCards.appendChild(gCard);
    };
}

function renderCardSel(event) {
    let selCard = document.getElementById(event.target.id);
    let firstCard = document.querySelector('.firstCardSel');
    // console.log(firstCard);

    if (firstCard != null) {
        if (selCard.classList.contains('playerSel')) {
        selCard.classList.replace('playerSel', 'playerNotSel');
        selCard.classList.remove('firstCardSel');
        gameStatus.textContent = '? + ? = 10'
        return;
    }
    selCard.classList.replace('playerNotSel', 'playerSel');
    gameStatus.textContent = `${firstCard.textContent} + ${selCard.textContent} = 10`;
    return;
    }
    selCard.classList.replace('playerNotSel', 'playerSel');
    selCard.classList.add("firstCardSel");
    gameStatus.textContent = `${selCard.textContent} + ? = 10`
    return;
};

function renderCardStatus (firstCard, secCard) {
    let card1 = document.getElementById(firstCard.getCardLabel());
    let card2 = document.getElementById(secCard.getCardLabel());

    //for checkSum, the two selected cards would already be "active" and "playerSel" so we just replace with whatever status and selection
    // info was assigned in the Model (after the win eligibility checks, ie = 10)
    card1.classList.replace('active', firstCard.getCardStatus());
    card2.classList.replace('active', secCard.getCardStatus());
    card1.classList.replace('playerSel', firstCard.getCardSelection());
    card2.classList.replace('playerSel', secCard.getCardSelection());
    gameStatus.textContent = '? + ? = 10';
    card1.classList.remove('firstCardSel'); //because firstCard in my function arguement is always defined as gameState.firstCardSel
}

// Reference: Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements at i and j
  }
}