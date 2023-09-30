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
    }

    getCardVal() {
        return this.value;
    }

    getCardStatus() {
        return this.status;
    }

    getCardSel() {
        return this.selection;
    }
    
    setCardVal(val) {
        this.value = val;
    }

    setCardSel(playerNotSel) {
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

let gameState = {
    level: null,
    firstCardSel: null,
    timeLeft: 60000,
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
gCards.addEventListener('click', handleMove);
// to add event listener for time's up (no user action)

// functions

function initialize() {
    // gameCards.innerHTML = ''; //so that new gameCards can be created through the render function
    cardArray = [];
    gameState.level = game1.getGameLevel();
    gameState.cardsLeft = game1.getTotalGameCards();
    createCards(game1.getTotalGameCards());
    setTimeout(countdown(), 60000);
    rStartGame();
}

    // need to assign: gameSetting.level = 1 and gameSetting.totalGameCards = 6
    // createCards()
    // set gameState.cardsLeft = gameSetting.totalGameCards
    // render? -
        // update play-button from "Start Game" to "Replay!";
        // gameStatus = "your time starts now!"
        // clear gameArea, timer, selection-display
        // display new set of cards and timer


function createCards(totalCardsToCreate) {
    for (i = 0; i < (totalCardsToCreate /2); i++) {
        // get a random item from an array
        // get random index value
        const randomIndex = Math.floor(Math.random() * cardCombi.length);
        let combiToCreate = cardCombi[randomIndex];
        console.log(combiToCreate) // returns "object array" ie, cardCombi[randomIndex] is an array within combiToCreate array
        var cardA = new card(combiToCreate[0], "active", "playerNotSel");
        var cardB = new card(combiToCreate[1], "active", "playerNotSel");
        cardArray.push(cardA, cardB); //doesn't replace, just appends, so command would work in this loop and not reset cardArray each loop
    }
        console.log(cardArray);
    }


// createCards
    // set cardsToCreate = gameSetting.totalGameCards / 2
    // Loop x no. of cardsToCreate times:
        // randomly choose one combi from cardCombi
            // var cardA = new card(cardCombi[0], "active", "playerNotSel");
            // var cardB = new card(cardCombi[1], "active", "playerNotSel");
            // cardArray.push(cardA, cardB);

// handleMove (rmb to write codes to update Model, NOT DOM!!!!)
// set clickedCard = evt.target...
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
// createCards()

function rStartGame() {
        playButton.textContent = 'Replay!';
        renderCards();
        gameStatus.textContent = 'Your time starts now!';
}

function renderCards() {
    for (let i = 0; i < cardArray.length; i++) {
        //this will lead to the same effect as having </div><div> in the .game-board HTML elem to facilitate css styling, js functions
        const gCard = document.createElement('ul');
        gCard.setAttribute("id",i);
        gCard.setAttribute("class","cards");
        gCard.innerText = cardArray[i].value;
        // Append created card to the pile of gameCards so that the css styling can be applied
        gameCards.appendChild(gCard);
    }
};


// Update the count down every 1 second
function countdown() {

  // Set end time to be 1 min later (ie, 60000 miliseconds)
  var now = new Date();
  var targetTime = now + 60000;

  // Find the distance between now and the count down date
  var distance = targetTime - now;

  // Time calculations for days, hours, minutes and seconds
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  timerDisplay.innerHTML = seconds + "s ";

  //how to update gameState.timeleft?

  // If the count down is finished, 
  if (distance < 0) {
    clearInterval(x);
    timerDisplay.innerHTML = "TIME'S UP!";
    gameState.timeLeft = 0;
  }
};