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

let timer;

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
const updatedInstructions = document.getElementById('updated-instructions');
const nGame = document.getElementById('ngame-button');

// event listeners

playButton.addEventListener('click', initialize);
gameCards.addEventListener('click', handleMove);
nGame.addEventListener('click', nextSteps);

// functions

function initialize() {
    cardArray = [];
    clearInterval(timer); // it's ok to have this at the start of the game here even though timer is undefined; this is insurance for cases
    // when people click on replay when the timer is still running midway - we want to make sure its reset to run properly (instead of counting
    // down in (eg) double/triple quicktime) 
    gameState.timeLeft = 60;
    gameState.level = game1.getGameLevel();
    gameState.cardsLeft = game1.getTotalGameCards();
    createCards(game1.getTotalGameCards());
    renderStartGame();
    timer = setInterval(function () {
        const seconds = gameState.timeLeft % 60; 
        if (gameState.timeLeft === 60) {
            timerDisplay.textContent = "1 minute"; // need to specify this so we don't see "0 s" at the start when gameState.timeLeft = 60 and 60%60  =0  (if left to else stmt alone)
        }
        else {timerDisplay.textContent = `${seconds} s`;}
        gameState.timeLeft--;
    
        if (gameState.timeLeft <= 0) {
            timerDisplay.textContent = "TIME'S UP!";
            checkWin();
            clearInterval(timer);
          }
        return;
      }, 500); // use setInterval to call the updateCountdown function every second (60000 = 60 s; 1000 milliseconds = 1s).  
}

// store timer as a global variable
// elaborate on updateCountdown here instead of setting it as another standalone function

function createCards(totalCardsToCreate) {
    // while (gameCards.hasChildNodes()) {
    //     gameCards.removeChild(gameCards.firstChild);
    // }

    for (i = 0; i < (totalCardsToCreate/2); i++) {
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
    };
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

function newMessage() {
        gameStatus.textContent = '? + ? = 10'
    };

function nextSteps() {
    if (gameState.timeLeft >= 0 && gameState.cardsLeft == 0) {
        if (gameState.level == game1.getGameLevel() || gameState.level == game2.getGameLevel()) {
        updateGame();
        return;
        }
        //gameState.level == game3.getGameLevel()
        initialize();
};
    //gameState.timeLeft <= 0, gameState.cardsLeft !=0
    initialize();
}

function updateGame() {
    cardArray = [];
    clearInterval(timer);
    gameState.timeLeft = 60;
    if (gameState.level == game1.getGameLevel()) {
        gameState.level = game2.getGameLevel();
        gameState.cardsLeft = game2.getTotalGameCards();
        createCards(game2.getTotalGameCards());
        return;
    };
    if (gameState.level == game2.getGameLevel()) {
    gameState.level = game3.getGameLevel();
    gameState.cardsLeft = game3.getTotalGameCards();
    createCards(game3.getTotalGameCards());
    return;
    }
    renderStartGame();
    timer = setInterval(function () {
        const seconds = gameState.timeLeft % 60; 
        if (gameState.timeLeft === 60) {
            timerDisplay.textContent = "1 minute"; // need to specify this so we don't see "0 s" at the start when gameState.timeLeft = 60 and 60%60  =0  (if left to else stmt alone)
        }
        else {timerDisplay.textContent = `${seconds} s`;}
        gameState.timeLeft--;
    
        if (gameState.timeLeft <= 0) {
            timerDisplay.textContent = "TIME'S UP!";
            checkWin();
            clearInterval(timer);
          }
        return;
      }, 500);
}


// for game start and game refresh (ie, new level)
function renderStartGame() {
    document.getElementById('instructions').style.display = "block";
    playButton.textContent = "Replay!"
    document.querySelectorAll('.next-game').forEach(a=>a.style.display = "none");
    timerDisplay.style.display = "block";
    renderCreateCards();
    gameStatus.textContent = 'Your time starts now!'
    setTimeout(newMessage, 1000); // setTimeout (not setInterval) cos you only want it to run once 
}

function renderMessage() {
    gameStatus.textContent = '';
    timerDisplay.style.display = "none";
    document.getElementById('instructions').style.display = "none";
    document.querySelectorAll('.next-game').forEach(a=>a.style.display = "block");

    if (gameState.timeLeft <= 0 && gameState.cardsLeft > 0) {
        updatedInstructions.innerHTML = 'Good attempt! Shall we try again?<br><br>';
        nGame.textContent = "Ok, let's go!";
        return;
    }
    if (gameState.timeLeft >= 0 && gameState.cardsLeft == 0) {
        if (gameState.level == game1.getGameLevel() || gameState.level == game2.getGameLevel()) {
        updatedInstructions.innerHTML = 'That was awesome! Shall we move on to the next challenge?';
        nGame.textContent = "Ok! Challenge Accepted!";      
        return;
        }
        updatedInstructions.innerHTML = 'You did an amazing job! Would you like to play again?';
        nGame.textContent = "Ok, let's do this again!";
        return;
    }
}

//click(Callback) - if state is x, initialise(), else....
// remove eventlistener before i add

function renderCreateCards() {
    while (gameCards.hasChildNodes()) {
        gameCards.removeChild(gameCards.firstChild);
    }

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
        newMessage();
        // gameStatus.textContent = '? + ? = 10'
        return;
    }
    selCard.classList.replace('playerNotSel', 'playerSel');
    gameStatus.textContent = `${firstCard.textContent} + ${selCard.textContent} = 10`;
    return;
    }
    selCard.classList.replace('playerNotSel', 'playerSel');
    selCard.classList.add("firstCardSel");
    gameStatus.textContent = `${selCard.textContent} + ? = 10`;
    return;
}

function renderCardStatus (firstCard, secCard) {
    let card1 = document.getElementById(firstCard.getCardLabel());
    let card2 = document.getElementById(secCard.getCardLabel());

    //for checkSum, the two selected cards would already be "active" and "playerSel" so we just replace with whatever status and selection
    // info was assigned in the Model (after the win eligibility checks, ie = 10)
    card1.classList.replace('active', firstCard.getCardStatus());
    card2.classList.replace('active', secCard.getCardStatus());
    card1.classList.replace('playerSel', firstCard.getCardSelection());
    card2.classList.replace('playerSel', secCard.getCardSelection());

    console.log(card1, card2);
    
    card1.classList.remove('firstCardSel'); //because firstCard in my function arguement is always defined as gameState.firstCardSel
    if (card1.classList.contains('active')) {
        gameStatus.textContent = "That didn't quite add up. Try again!";
        console.log('bingo1');
        setTimeout(newMessage(), 6000);
    }
        {
        gameStatus.textContent = "Bingo! That summed up nicely to 10!";
        console.log('bingo2');
        setTimeout(newMessage(), 6000);    
    };
}

// Reference: Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements at i and j
  };
}

// put the numbers here then insert into DOM later; have a score