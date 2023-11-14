# I CAN COUNT!
An addition game for budding mathematicians, created in fond anticipation of my 2 year old (and in future, newborn's!) next learning milestone. 

_Technologies Used: JavaScript, HTML, CSS_

## Gameplay

**Instructions**

Given a deck of cards, choose two cards that add up to 10, or a predetermined number of choice. Game will continue until the cards are cleared or when time's up (1 min for each game play), whichever is earlier. There are a total of three levels, with varying number of game cards (6, 10, 20). Players can earn bonus points and advance to the next level if they clear the cards before time's up.

**Screenshots of Game**

_Welcome screen_
<img width="932" alt="image" src="https://github.com/jx0906/jx0906.github.io/assets/142247158/51312d58-0874-409b-b270-2ff0fdb15a54">

_Option to customise summation goal_
<img width="916" alt="image" src="https://github.com/jx0906/jx0906.github.io/assets/142247158/07330f83-bc5c-4922-a5d3-9d99ccb49a2c">

_Start Game_
<img width="942" alt="image" src="https://github.com/jx0906/jx0906.github.io/assets/142247158/c3fec6f1-ae11-4ae6-b9ab-91ca6cb47ffd">

_Informative prompts to guide game play throughout_

_(A) Card selection, feedback on time left_
<img width="935" alt="image" src="https://github.com/jx0906/jx0906.github.io/assets/142247158/bfa34d55-e499-49fb-b906-c1ba2d957323">

_(B) Successful addition_
<img width="942" alt="image" src="https://github.com/jx0906/jx0906.github.io/assets/142247158/256aaa98-6006-4bbb-84e7-331cf9d2fdd1">

_(C) Incorrect combinations_
<img width="940" alt="image" src="https://github.com/jx0906/jx0906.github.io/assets/142247158/fe4a8bf4-6857-45d3-b8b1-770464b99358">

_(D) Round-up of game play with score and motivational message_
<img width="931" alt="image" src="https://github.com/jx0906/jx0906.github.io/assets/142247158/c26f942d-aba8-4c24-b63b-82cd051320eb">
<img width="941" alt="image" src="https://github.com/jx0906/jx0906.github.io/assets/142247158/5eb40382-8ecb-44b3-b224-8740f6165f33">

[Link to Game](https://jx0906.github.io/i-can-count/)

## Planned future enhancements
a. Add distraction cards<br> 
b. Allow customisation of arithmetric operation - summation, minus, multiplication, division<br>
c. Have animation for timer progress bar (eg, to show dinosaur catching up with the prey)<br>
d. Keeping a scoreboard of players' history<br>
e. Responsive design for UI

## Reflections: Challenges and Learning Points

In retrospect, the game UI, model data and logic weren't difficult to establish and code. What was challenging was the need to link the view and model data to ensure both were consistent and users get an accurate feedback on the game. I thus spent a significant amount of time at the start to internalise the concepts of rendering and to engineer a way to link the UI elements and data. After much reading and code testing, I finally stumbled on the "Eureka!" moment when I realised I could leverage on HTML element attributes (ie, by setting multiple class attributes). It was a golden realisation as it not only facilitated any interactions I wanted to establish between the UI and data, but also greatly enhanced my ability to control their styling (eg, to display or hide). Having crossed this mindblock, coding for the subsequent functions, including a last-min enhancement to shuffle the card display, definitely became a lot easier, faster and satisfying. 

Here's a sample of the code where I had applied the concept to update the UI based on the user's card selections:

```
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
```

In retrospect, considering the time pressure to deliver the project, it could have been more sensible of me to reach out to fellow classmates who may had resolved similar learning challenges or the instructional team for clarifications rather than let my progress be held back indefinitely by the knowledge gap - will definitely keep this learning point with me for the next project, and life, in general :) 
