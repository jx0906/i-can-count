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
    this.label = "label"; //optional argument?
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

    setCardSelection(playerNotSel) {
        this.selection = playerNotSel;
    }

    setCardStatus(inactive, playerNotSel) {
        this.status = inactive;
        this.selection = playerNotSel;
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
// to add event listener for time's up (no user action)?

// functions

function initialize() {
    // gameCards.innerHTML = ''; //so that new gameCards can be created through the render function
    cardArray = [];
    gameState.level = game1.getGameLevel();
    gameState.cardsLeft = game1.getTotalGameCards();
    createCards(game1.getTotalGameCards());
    updateCountdown(); 
    rStartGame();
}

function createCards(totalCardsToCreate) {
    while (gameCards.hasChildNodes()) {
        gameCards.
        removeChild(gameCards.firstChild);
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
    console.log(clickedCard); // returns an object
    //clickedCard.getCardSelection() doesn't work. is it cos clickedCard is not governed by the class properties as an object?

    let clickedCardSel = clickedCard.getCardSelection();
    console.log(clickedCardSel);

    if (clickedCardSel === "playerSel") {
        clickedCard.setCardSelection("playerNotSel");
        gameState.firstCardSel = null;
        renderCards(evt);
        return;
    }
    clickedCard.setCardSelection("playerSel");
    // console.log(clickedCard);
    // console.log(gameState.firstCardSel);
    gameState.firstCardSel = clickedCard;
    console.log(gameState.firstCardSel);
    renderCards(evt);
    return;
    }

// to check card.selection of clicked card (evt.target)
    // if "playerSel", update to "playerNotSel" (make sure renderView also updates accordingly, ie, selectionDisplay.textContent = "? + ? = 10 " )
    // if "playerNotSel", update to "playerSel"
        // if gameState.firstCardSel = NULL, set clickedCard = gameState.firstCardSel and return; (make sure correspondingly in renderView, selectionDisplay.textContent with "clickedCard value + ? = 10 ")
        // if gameState.firstCardSel != NULL, checkSum, checkWin
// render()

// checkSum, ie,
// if sum of cards add up to 10,
    // update for both selected cards: card.status = 'inactive' and card.selection = "playerNotSel"
    // cardArray.pop the two cards (renderMessage to prompt "bingo!" and renderView to remove display of selected cards) 
    // gameState.firstCardSel = NULL
    // gameState.cardsLeft should be updated by association of cardArray.length? -> to confirm
// else, for both cards: card.status = 'active' and card.selection = "playerNotSel" (renderMessage to prompt "let's try again!" and renderView to
// unselect cards)

// checkWin, ie, time and no. of cards left
// - if gameState.timeleft = 0, check
    //  - if gameState.cardsLeft =0, call updateGame function (renderMessage "Good Job! On to the next challenge now!") 
    //  - if gameState.cardsLeft > 0, call resetGame function (renderMessage "Aw, time's up! Shall we try again?") 
// - if gameState.timeleft > 0, check
    // - if gameState.cardsLeft =0, refreshGame (renderMessage "Good Job! On to the next challenge now!")
    // - if gameState.cardsLeft > 0, continue

// updateGame, refresh game for next level 


// Update the count down every 1 second
function updateCountdown() {
    // Set end time to be 1 min later (ie, 60000 miliseconds)
    // can use new Date.getTime() if you want to be very accurate about tmekeeping cos 1000 miliseconds != exactly 1sec. its more of 1.03 s.
    // var now = new Date().getTime(); var targetTime = 1 minute later (need to find the exact code)

    const seconds = gameState.timeLeft % 60; // how to get rid of the 0 s which appears at the start when gameState.timeLeft = 60 and 60%60  =0 
    timerDisplay.textContent = `${seconds} s`;
    const timer = setInterval(updateCountdown, 1000); // use setInterval to call the updateCountdown function every second (1000 milliseconds).  
    // If the count down is finished, 
    if (gameState.timeLeft === 0) {
      clearInterval(timer);
      timerDisplay.textContent = "TIME'S UP!";
      return;
    }
    gameState.timeLeft--;
  };

// for game start and game refresh (ie, new level)
function rStartGame() {
    playButton.textContent = 'Replay!';
    rCreateCards();
    gameStatus.textContent = 'Your time starts now!'
    setInterval(newMessage, 500);
}

function newMessage() {
    gameStatus.textContent = '? + ? = 10'
};

function rCreateCards() {
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

function renderCards(event) {
    const selCard = document.getElementById(event.target.id);
    const hasplayerSelClass = selCard.classList.contains('playerSel');
    if (hasplayerSelClass) {
        selCard.classList.replace('playerSel', 'playerNotSel');
        gameStatus.textContent = '? + ? = 10'
    }
    selCard.classList.replace('playerNotSel', 'playerSel');
    console.log(selCard.textContent);
    gameStatus.textContent = `${selCard.textContent} + ? = 10`;
};

// Reference: Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements at i and j
  }
}