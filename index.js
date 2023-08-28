/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    for(let i = 0; i < games.length; i++){
        const gameDiv = document.createElement("div");
        gameDiv.classList.add('game-card');
        gameDiv.innerHTML = 
                        `<div>
                            <img class = "game-img" src = "${games[i].img}" /> 
                            <h3>${games[i].name}</h3>
                            <h4>${games[i].description}</h4>
                            <h4> Backers: ${games[i].backers}</h4>
                        </div>`;
        gamesContainer.appendChild(gameDiv);
    }
}

addGamesToPage(GAMES_JSON);
// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers

let totalContributions = GAMES_JSON.reduce( (acc, backers) => {
    return acc + backers.backers;
}, 0);

contributionsCard.innerHTML = totalContributions.toLocaleString('en-US');
// set the inner HTML using a template literal and toLocaleString to get a number with commas


// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

let totalRaised = GAMES_JSON.reduce( (acc, pledged) => {
    return acc + pledged.pledged;
}, 0);

// set inner HTML using template literal

raisedCard.innerHTML = "$" + totalRaised.toLocaleString('en-US');

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

gamesCard.innerHTML = GAMES_JSON.length;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);
    document.getElementById("mostfunded").checked = false;

    let notAtGoal = GAMES_JSON.filter ( (games) => {
        return games.pledged < games.goal;
    })

    addGamesToPage(notAtGoal);

    document.getElementById("mostfunded").addEventListener("change", function() {
        if(document.getElementById("mostfunded").checked){
            let [...copyGames] = notAtGoal;
            sortByMost(copyGames);
        }
        else{
            deleteChildElements(gamesContainer);
            addGamesToPage(notAtGoal);
        }
    });
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);
    document.getElementById("mostfunded").checked = false;


    let atGoal = GAMES_JSON.filter ( (games) => {
        return games.pledged >= games.goal;
    })

    addGamesToPage(atGoal);


    document.getElementById("mostfunded").addEventListener("change", function() {
        if(document.getElementById("mostfunded").checked){
            let [...copyGames] = atGoal;
            sortByMost(copyGames);
        }
        else{
            deleteChildElements(gamesContainer);
            addGamesToPage(atGoal);
        }
    });
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);
    document.getElementById("mostfunded").checked = false;


    addGamesToPage(GAMES_JSON);
    document.getElementById("mostfunded").addEventListener("change", function() {
        if(document.getElementById("mostfunded").checked){
            let [...copyGames] = GAMES_JSON;
            sortByMost(copyGames);
        }
        else{
            deleteChildElements(gamesContainer);
            addGamesToPage(GAMES_JSON);
        }    
    });

}

//====================BONUS FEATURE======================
//Sort by Most Funded
function sortByMost(games){
    deleteChildElements(gamesContainer);

    const sorted =  games.sort( (item1, item2) => {
        return item2.pledged - item1.pledged;
    });

    addGamesToPage(sorted);
}
// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button

unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);
/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

//filter for those games at the goal
let atGoal = GAMES_JSON.filter ( (games) => {
    return games.pledged >= games.goal;
})
//filter for those games not at goal
let notAtGoal = GAMES_JSON.filter ( (games) => {
    return games.pledged < games.goal;
})

//ternary operators to dictate how the stats for funded games will display depending on if it is more than 1. 
const notAtGoalPlural = notAtGoal.length > 1 ? `games` : `game`;

const goalPlural = atGoal.length > 1 ? `games` : `game`;

let fundedStats = document.createElement("p");

//template
fundedStats.innerHTML = `A total of $${totalRaised.toLocaleString('en-US')} has been raised for ${GAMES_JSON.length} ${goalPlural}. Currently, ${notAtGoal.length} ${notAtGoalPlural} remain unfunded. We need your help to fund these amazing games!`;

//append to parent
descriptionContainer.appendChild(fundedStats)

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

let [...sortedCopy] = GAMES_JSON;

const sortedGames = sortedCopy.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

//grabbing only the first and second games from the sorted array
let [first, second, ...others] = sortedGames;

//first and second elements
let mostFunded = document.createElement("div");
let secondFunded = document.createElement("div");

mostFunded.innerHTML = first.name;
secondFunded.innerHTML = second.name;

firstGameContainer.appendChild(mostFunded);
secondGameContainer.appendChild(secondFunded);
